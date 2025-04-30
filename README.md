# Ulster Delt Investment

A personal finance management application built with Next.js, Prisma, and Supabase.

## Features

- User authentication and authorization
- Account management
- Transaction tracking
- Card management
- Notifications
- Security features

## Tech Stack

- [Next.js](https://nextjs.org/) - React framework
- [Prisma](https://www.prisma.io/) - ORM
- [Supabase](https://supabase.com/) - Backend as a Service
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [TypeScript](https://www.typescriptlang.org/) - Type safety

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Supabase account

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Application Configuration
NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:3000
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key

# Supabase Configuration
SUPABASE_DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
SUPABASE_URL=https://[YOUR-PROJECT-REF].supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Other configurations...
```

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your Supabase project and get your credentials
4. Copy the environment variables from `.env.template` to `.env` and fill in your values
5. Run the development server:
   ```bash
   npm run dev
   ```

## Database Setup

1. Create a new project in Supabase
2. Get your database connection string and API keys
3. Update your `.env` file with the Supabase credentials
4. Run the Prisma migrations:
   ```bash
   npx prisma migrate dev
   ```

## Deployment

The application is configured for deployment on Netlify. Make sure to:

1. Set up your environment variables in Netlify
2. Ensure your Supabase database is accessible from Netlify
3. Configure your build settings in `netlify.toml`

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License.
