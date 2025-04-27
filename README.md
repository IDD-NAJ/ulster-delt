# Ulster Delt

A personal finance management application built with Next.js, Prisma, and PostgreSQL.

## Features

- User authentication
- Account management
- Transaction tracking
- Recurring transactions
- Category management
- Dashboard with financial insights

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
