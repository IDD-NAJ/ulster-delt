# Ulster Delt - Modern Banking Platform

Ulster Delt is a modern banking platform built with Next.js, offering a comprehensive suite of financial services and features.

## Features

- Personal and Business Banking
- Digital Account Management
- Secure Transactions
- Investment Services
- Mobile Banking
- Customer Support Portal

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth.js
- **Database**: PostgreSQL with Prisma ORM
- **Deployment**: Netlify

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm or yarn
- PostgreSQL database

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/ulster-delt.git
cd ulster-delt
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory with the following variables:
```env
DATABASE_URL="your_postgresql_connection_string"
NEXTAUTH_SECRET="your_nextauth_secret"
NEXTAUTH_URL="http://localhost:3000"
```

4. Initialize the database:
```bash
npm run prisma:generate
npm run prisma:migrate
```

5. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Project Structure

```
ulster-delt/
├── src/
│   ├── app/              # Next.js app directory
│   ├── components/       # Reusable components
│   ├── lib/             # Utility functions
│   ├── styles/          # Global styles
│   └── types/           # TypeScript types
├── prisma/              # Database schema and migrations
├── public/              # Static assets
└── tests/              # Test files
```

## Deployment

The application is configured for deployment on Netlify. The deployment process is automated through the `netlify.toml` configuration file.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Contact

For any inquiries, please contact:
- Email: support@ulsterdelt.com
- Website: https://ulster-delt.netlify.app
