const { execSync } = require('child_process');
const { PrismaClient } = require('@prisma/client');

async function deploymentChecks() {
  console.log('🔍 Running deployment checks...');

  // Check environment variables
  const requiredEnvVars = [
    'DATABASE_URL',
    'NEXTAUTH_SECRET',
    'NEXTAUTH_URL',
    'NEXT_PUBLIC_APP_URL'
  ];

  const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
  if (missingEnvVars.length > 0) {
    console.error('❌ Missing required environment variables:', missingEnvVars.join(', '));
    console.error('\nPlease set these environment variables in your Netlify dashboard:');
    console.error('1. Go to Site settings > Build & deploy > Environment variables');
    console.error('2. Add the following variables:');
    missingEnvVars.forEach(envVar => {
      console.error(`   - ${envVar}`);
    });
    console.error('\nFor local development, create a .env file with these variables.');
    process.exit(1);
  }

  try {
    // Run database migrations
    console.log('📦 Running database migrations...');
    execSync('npx prisma migrate deploy', { stdio: 'inherit' });

    // Generate Prisma Client
    console.log('🔧 Generating Prisma Client...');
    execSync('npx prisma generate', { stdio: 'inherit' });

    // Test database connection
    console.log('🔌 Testing database connection...');
    const prisma = new PrismaClient();
    await prisma.$connect();
    await prisma.$disconnect();

    console.log('✅ Deployment checks completed successfully!');
  } catch (error) {
    console.error('❌ Deployment checks failed:', error);
    process.exit(1);
  }
}

deploymentChecks(); 