import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from './db';
import { compare } from "bcryptjs";
import { JWT } from 'next-auth/jwt';
import { Session } from 'next-auth';

// Define custom types
interface CustomUser {
  id: string;
  email: string;
  name?: string | null;
  role?: string;
}

declare module "next-auth" {
  interface User extends CustomUser {}
  
  interface Session {
    user: CustomUser & {
      image?: string | null;
    }
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const isValidCredentials = (cred: any): cred is { email: string; password: string } => {
          return Boolean(cred) && 
            typeof cred === 'object' &&
            typeof cred.email === 'string' && 
            typeof cred.password === 'string';
        };

        if (!isValidCredentials(credentials)) {
          throw new Error("Invalid credentials");
        }

        // Try to find user in both User and AdminUser tables
        const [user, adminUser] = await Promise.all([
          prisma.user.findUnique({
            where: { email: credentials.email },
            select: {
              id: true,
              email: true,
              password: true,
              name: true,
              role: true,
            },
          }),
          prisma.adminUser.findUnique({
            where: { email: credentials.email },
            select: {
              id: true,
              email: true,
              hashedPassword: true,
              name: true,
              role: true,
            },
          }),
        ]);

        // Check if user exists in either table
        if (!user && !adminUser) {
          throw new Error("User not found");
        }

        // Handle regular user authentication
        if (user && user.password) {
          const isPasswordValid = await compare(credentials.password, user.password);
          if (!isPasswordValid) {
            throw new Error("Invalid password");
          }
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          };
        }

        // Handle admin user authentication
        if (adminUser) {
          const isPasswordValid = await compare(credentials.password, adminUser.hashedPassword);
          if (!isPasswordValid) {
            throw new Error("Invalid password");
          }
          return {
            id: adminUser.id,
            email: adminUser.email,
            name: adminUser.name,
            role: adminUser.role,
          };
        }

        throw new Error("Invalid credentials");
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }): Promise<Session> {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id as string,
          role: token.role as string,
        }
      };
    }
  }
}; 