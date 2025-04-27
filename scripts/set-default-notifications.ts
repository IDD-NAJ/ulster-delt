const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  try {
    // Get all users who don't have notification preferences
    const users = await prisma.user.findMany({
      where: {
        notificationPreferences: null,
      },
    });

    console.log(`Found ${users.length} users without notification preferences`);

    // Create default preferences for each user
    for (const user of users) {
      await prisma.notificationPreferences.create({
        data: {
          userId: user.id,
          emailNotifications: true,
          pushNotifications: true,
          smsNotifications: false,
          marketingEmails: true,
          transactionAlerts: true,
          securityAlerts: true,
          balanceAlerts: true,
        },
      });
      console.log(`Created default preferences for user ${user.email}`);
    }

    console.log('Successfully set default notification preferences');
  } catch (error) {
    console.error('Error setting default preferences:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 