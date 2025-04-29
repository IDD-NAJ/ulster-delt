# Ulster Delt - Personal Finance Management

A personal finance management application built with Next.js, Prisma, and PostgreSQL.

## Deployment Instructions

### Prerequisites
- Node.js 18 or later
- PostgreSQL database
- Netlify account

### Environment Variables
Create a `.env` file with the following variables:
```env
# Database connection string (PostgreSQL)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ulster_delt?schema=public"

# NextAuth.js configuration
NEXTAUTH_SECRET="j15s0r596z02bdVVpkrSbHf0hDkbrEL8MzCxtsOMdM8="
NEXTAUTH_URL="http://localhost:3000"

# Application URLs
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Netlify Deployment Steps

1. **Connect Repository**
   - Fork/Clone this repository
   - Log in to Netlify
   - Click "New site from Git"
   - Choose your repository

2. **Configure Build Settings**
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Node version: 18.x

3. **Environment Variables**
   Add the following environment variables in Netlify:
   - Go to Site settings > Build & deploy > Environment variables
   - Add each variable with its value:
     ```
     DATABASE_URL=your-postgresql-connection-string
     NEXTAUTH_SECRET=your-secret-key
     NEXTAUTH_URL=https://ulster-delt.netlify.app
     NEXT_PUBLIC_APP_URL=https://ulster-delt.netlify.app
     ```
   - For `NEXTAUTH_SECRET`, generate a secure random string:
     ```bash
     openssl rand -base64 32
     ```
   - For `NEXTAUTH_URL` and `NEXT_PUBLIC_APP_URL`, use your Netlify site URL
     (e.g., https://ulster-delt.netlify.app)

4. **Database Setup**
   - Ensure your PostgreSQL database is accessible from Netlify
   - The deployment script will automatically:
     - Run database migrations
     - Generate Prisma client
     - Test database connection

### Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run database migrations:
   ```bash
   npm run prisma:migrate
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

### Troubleshooting

If you encounter deployment issues:

1. Check environment variables in Netlify
   - Verify all required variables are set
   - Check for typos in variable names
   - Ensure values are correct

2. Verify database connection
   - Check if database is accessible from Netlify
   - Verify connection string format
   - Ensure database user has proper permissions

3. Check build logs
   - Look for specific error messages
   - Verify build command execution
   - Check for missing dependencies

4. Common issues:
   - Missing environment variables
   - Database connection failures
   - Build command errors
   - Node version mismatches

## Features

- Recurring transactions management
- User authentication
- Real-time updates
- Responsive design
- Dark/Light mode
- And more...

## Tech Stack

- [Next.js](https://nextjs.org/) - React framework
- [Prisma](https://www.prisma.io/) - Database ORM
- [PostgreSQL](https://www.postgresql.org/) - Database
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [NextAuth.js](https://next-auth.js.org/) - Authentication
- [React Query](https://tanstack.com/query/latest) - Data fetching
- [date-fns](https://date-fns.org/) - Date manipulation
- [sonner](https://sonner.emilkowal.ski/) - Toast notifications

## Getting Started

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file with the following variables:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ulster_delt?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"
```

4. Set up the database:

```bash
npx prisma migrate dev
```

5. Run the development server:

```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## License

MIT
