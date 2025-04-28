import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    // Get all users with their accounts and transactions
    const users = await prisma.user.findMany({
      include: {
        accounts: {
          include: {
            transactions: {
              orderBy: {
                createdAt: 'desc'
              },
              take: 5
            }
          }
        },
        cards: true,
        notificationPreferences: true
      },
    });

    console.log('Users in database:');
    console.log('=================');
    
    users.forEach(user => {
      console.log(`\nUser ID: ${user.id}`);
      console.log(`Email: ${user.email}`);
      console.log(`Name: ${user.firstName} ${user.lastName}`);
      console.log(`Role: ${user.role}`);
      console.log(`Phone: ${user.phoneNumber || 'Not set'}`);
      console.log(`Created: ${user.createdAt}`);
      
      console.log('\nAccounts:');
      user.accounts.forEach(account => {
        console.log(`  - Type: ${account.type}`);
        console.log(`    Balance: ${account.balance}`);
        console.log(`    Account ID: ${account.id}`);
        console.log(`    Provider: ${account.provider}`);
        
        if (account.transactions.length > 0) {
          console.log('    Recent Transactions:');
          account.transactions.forEach(tx => {
            console.log(`      * ${tx.type} - ${tx.amount} ${tx.currency}`);
            console.log(`        Description: ${tx.description}`);
            console.log(`        Date: ${tx.createdAt}`);
          });
        }
      });

      if (user.cards.length > 0) {
        console.log('\nCards:');
        user.cards.forEach(card => {
          console.log(`  - Type: ${card.type}`);
          console.log(`    Number: ${card.cardNumber.slice(-4)}`);
          console.log(`    Status: ${card.status}`);
          console.log(`    Expiry: ${card.expiryDate.toLocaleDateString()}`);
        });
      }

      console.log('\nNotification Preferences:');
      if (user.notificationPreferences) {
        console.log(`  Email: ${user.notificationPreferences.emailNotifications ? 'Enabled' : 'Disabled'}`);
        console.log(`  Push: ${user.notificationPreferences.pushNotifications ? 'Enabled' : 'Disabled'}`);
        console.log(`  SMS: ${user.notificationPreferences.smsNotifications ? 'Enabled' : 'Disabled'}`);
      } else {
        console.log('  No preferences set');
      }
      
      console.log('\n=================');
    });

  } catch (error) {
    console.error('Error fetching users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 