# Ulster Delt Investment

A modern investment platform built with Node.js, Express, MongoDB, and Redis.

## Features

- User Authentication & Authorization
  - JWT-based authentication
  - Two-factor authentication (2FA)
  - Email verification
  - Password reset functionality

- Account Management
  - Multiple account types (Checking, Savings, Investment)
  - Account creation and closure
  - Balance management
  - Transaction history

- Transaction Processing
  - Internal transfers
  - External payments
  - Transaction notifications
  - Transaction cancellation

- Security Features
  - Password hashing with bcrypt
  - Rate limiting
  - CORS protection
  - Helmet security headers
  - Input validation
  - Secure session management

## Tech Stack

- **Backend Framework**: Node.js with Express
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT, bcrypt
- **Email**: Nodemailer
- **2FA**: Speakeasy
- **Documentation**: Swagger/OpenAPI
- **Testing**: Jest
- **Logging**: Winston

## Prerequisites

- Node.js >= 14.0.0
- MongoDB >= 6.0
- Redis >= 7.0
- Docker and Docker Compose (optional)

## Getting Started

1. Clone the repository:
```bash
git clone <repository-url>
cd ulster-delt-investment
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```
Edit the `.env` file with your configuration.

4. Start the services using Docker Compose:
```bash
docker-compose up -d
```

5. Start the development server:
```bash
npm run dev
```

The server will start on `http://localhost:3000`.

## Project Structure

```
src/
├── config/         # Configuration files
├── models/         # Database models
├── routes/         # API routes
├── controllers/    # Route controllers
├── middleware/     # Custom middleware
├── services/       # Business logic
├── utils/          # Utility functions
└── app.js          # Application entry point
```

## Available Scripts

- `npm start` - Start the production server
- `npm run dev` - Start the development server with hot reload
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## API Documentation

The API documentation is available at `/api-docs` when running the server.

## Environment Variables

- `NODE_ENV` - Application environment (development/production)
- `PORT` - Server port
- `MONGODB_URI` - MongoDB connection string
- `MONGODB_USER` - MongoDB username
- `MONGODB_PASS` - MongoDB password
- `REDIS_HOST` - Redis host
- `REDIS_PORT` - Redis port
- `REDIS_PASSWORD` - Redis password
- `JWT_SECRET` - JWT secret key
- `JWT_EXPIRES_IN` - JWT expiration time
- `LOG_LEVEL` - Logging level

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Support

For support, please contact the development team at support@ulsterdeltinvestment.com 