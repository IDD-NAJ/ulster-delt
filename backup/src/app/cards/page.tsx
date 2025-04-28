import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  CreditCardIcon,
  LockClosedIcon,
  ShieldCheckIcon,
  ChartBarIcon,
  CogIcon,
  BanknotesIcon,
  ClockIcon,
  GiftIcon,
  ShoppingBagIcon,
  BellIcon,
  ArrowTrendingUpIcon,
  KeyIcon,
} from '@heroicons/react/24/outline';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CardData {
  id: string;
  type: string;
  lastFourDigits: string;
  isActive: boolean;
  limit?: number;
  balance?: number;
  expiryMonth?: number;
  expiryYear?: number;
}

export default async function CardsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login?callbackUrl=/cards');
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email! },
    include: {
      accounts: {
        where: {
          type: 'CREDIT_CARD',
        },
      },
    },
  });

  if (!user) {
    redirect('/login');
  }

  // Enhanced card data with mock limits and expiry dates
  const cards = user.accounts.map(account => ({
    id: account.id,
    type: 'CREDIT',
    lastFourDigits: account.accountNumber.slice(-4),
    isActive: true,
    limit: 5000, // Mock credit limit
    balance: parseFloat(account.balance.toString()),
    expiryMonth: Math.floor(Math.random() * 12) + 1, // Mock expiry month
    expiryYear: new Date().getFullYear() + 3, // Mock expiry year
  }));

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Your Cards
            </h1>
            <p className="text-gray-500 mt-1">Manage your credit and debit cards</p>
          </div>
          <Button className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 
                           transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02]">
            <CreditCardIcon className="h-5 w-5 mr-2" />
            Request New Card
          </Button>
        </div>

        {cards.length > 0 ? (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {cards.map((card) => (
                <Card 
                  key={card.id} 
                  className="relative overflow-hidden group hover:shadow-xl transition-all duration-300 
                           border-t-4 border-t-primary/80"
                >
                  {/* Card Preview */}
                  <div className="p-6 space-y-4">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/5 rounded-full -ml-12 -mb-12" />
                    
                    <div className="relative">
                      {/* Card Header */}
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <h3 className="text-lg font-medium flex items-center gap-2">
                            <CreditCardIcon className="h-5 w-5 text-primary" />
                            {card.type} Card
                          </h3>
                          <p className="text-sm text-gray-500 mt-1 font-mono">
                            **** **** **** {card.lastFourDigits}
                          </p>
                        </div>
                        <div className="flex flex-col items-end">
                          {card.isActive ? (
                            <span className="px-2 py-1 text-xs font-medium text-green-700 bg-green-50 
                                         rounded-full ring-1 ring-green-100/50">
                              Active
                            </span>
                          ) : (
                            <span className="px-2 py-1 text-xs font-medium text-red-700 bg-red-50 
                                         rounded-full ring-1 ring-red-100/50">
                              Inactive
                            </span>
                          )}
                          <p className="text-xs text-gray-500 mt-2">
                            Expires {card.expiryMonth.toString().padStart(2, '0')}/{card.expiryYear}
                          </p>
                        </div>
                      </div>

                      {/* Card Balance */}
                      <div className="mb-6">
                        <div className="flex justify-between items-end mb-2">
                          <p className="text-sm text-gray-500">Available Credit</p>
                          <p className="text-sm font-medium">
                            ${card.limit! - card.balance!} / ${card.limit}
                          </p>
                        </div>
                        <Progress 
                          value={(card.balance! / card.limit!) * 100}
                          className="h-2 bg-gray-100"
                        />
                      </div>

                      {/* Quick Stats */}
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                            <BanknotesIcon className="h-4 w-4" />
                            Current Balance
                          </div>
                          <p className="text-lg font-semibold">${card.balance!.toFixed(2)}</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                            <ClockIcon className="h-4 w-4" />
                            Last Activity
                          </div>
                          <p className="text-sm">2 days ago</p>
                        </div>
                      </div>

                      {/* Card Actions */}
                      <div className="pt-4 border-t border-gray-200">
                        <div className="flex flex-wrap gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="flex-1 min-w-[120px] hover:bg-red-50 hover:text-red-600 
                                     hover:border-red-200 transition-colors duration-200"
                          >
                            <LockClosedIcon className="h-4 w-4 mr-2" />
                            Freeze Card
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="flex-1 min-w-[120px] hover:bg-primary/5 hover:text-primary 
                                     hover:border-primary/20 transition-colors duration-200"
                          >
                            <ShieldCheckIcon className="h-4 w-4 mr-2" />
                            Security
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="flex-1 min-w-[120px] hover:bg-blue-50 hover:text-blue-600 
                                     hover:border-blue-200 transition-colors duration-200"
                          >
                            <ChartBarIcon className="h-4 w-4 mr-2" />
                            Analytics
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="flex-1 min-w-[120px] hover:bg-gray-50 hover:text-gray-600 
                                     hover:border-gray-200 transition-colors duration-200"
                          >
                            <CogIcon className="h-4 w-4 mr-2" />
                            Settings
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Additional Sections */}
            <div className="mt-12 space-y-8">
              {/* Tabs Container */}
              <Tabs defaultValue="transactions" className="w-full">
                <TabsList className="w-full justify-start">
                  <TabsTrigger value="transactions">Recent Transactions</TabsTrigger>
                  <TabsTrigger value="analytics">Spending Analytics</TabsTrigger>
                  <TabsTrigger value="benefits">Benefits & Rewards</TabsTrigger>
                  <TabsTrigger value="security">Security Settings</TabsTrigger>
                </TabsList>

                {/* Recent Transactions Tab */}
                <TabsContent value="transactions">
                  <div className="grid gap-6 grid-cols-1">
                    <Card className="p-6">
                      <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                        <ClockIcon className="h-5 w-5 text-primary" />
                        Recent Transactions
                      </h3>
                      <div className="space-y-4">
                        {[1, 2, 3].map((_, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-white rounded-full">
                                <ShoppingBagIcon className="h-4 w-4 text-primary" />
                              </div>
                              <div>
                                <p className="font-medium">Online Purchase</p>
                                <p className="text-sm text-gray-500">Amazon.com</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">-$49.99</p>
                              <p className="text-sm text-gray-500">2 hours ago</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <Button variant="outline" className="w-full mt-4">
                        View All Transactions
                      </Button>
                    </Card>
                  </div>
                </TabsContent>

                {/* Spending Analytics Tab */}
                <TabsContent value="analytics">
                  <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
                    <Card className="p-6">
                      <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                        <ArrowTrendingUpIcon className="h-5 w-5 text-primary" />
                        Monthly Spending Overview
                      </h3>
                      <div className="space-y-4">
                        {['Shopping', 'Dining', 'Travel'].map((category, index) => (
                          <div key={category} className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>{category}</span>
                              <span className="font-medium">${(Math.random() * 1000).toFixed(2)}</span>
                            </div>
                            <Progress value={Math.random() * 100} className="h-2" />
                          </div>
                        ))}
                      </div>
                    </Card>
                    <Card className="p-6">
                      <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                        <ChartBarIcon className="h-5 w-5 text-primary" />
                        Spending Limits
                      </h3>
                      <div className="space-y-6">
                        <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                          <div className="flex justify-between items-center mb-2">
                            <p className="font-medium text-yellow-800">Monthly Limit</p>
                            <p className="text-sm text-yellow-800">$3,000 / $5,000</p>
                          </div>
                          <Progress value={60} className="h-2 bg-yellow-100" />
                        </div>
                        <Button variant="outline" className="w-full">
                          Adjust Spending Limits
                        </Button>
                      </div>
                    </Card>
                  </div>
                </TabsContent>

                {/* Benefits & Rewards Tab */}
                <TabsContent value="benefits">
                  <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
                    <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <GiftIcon className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="text-lg font-medium">Rewards Balance</h3>
                      </div>
                      <p className="text-3xl font-bold mb-2">2,450</p>
                      <p className="text-sm text-gray-500">Points Available</p>
                      <Button className="w-full mt-4">Redeem Points</Button>
                    </Card>
                    
                    <Card className="p-6 lg:col-span-2">
                      <h3 className="text-lg font-medium mb-4">Current Benefits</h3>
                      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                        {[
                          { title: 'Cashback Rewards', desc: '2% on all purchases' },
                          { title: 'Travel Insurance', desc: 'Up to $500,000 coverage' },
                          { title: 'Extended Warranty', desc: 'Additional year of coverage' },
                          { title: 'Airport Lounge', desc: 'Free Priority Pass™ access' },
                        ].map((benefit) => (
                          <div key={benefit.title} className="p-4 bg-gray-50 rounded-lg">
                            <h4 className="font-medium">{benefit.title}</h4>
                            <p className="text-sm text-gray-500">{benefit.desc}</p>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </div>
                </TabsContent>

                {/* Security Settings Tab */}
                <TabsContent value="security">
                  <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
                    <Card className="p-6">
                      <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                        <KeyIcon className="h-5 w-5 text-primary" />
                        Security Features
                      </h3>
                      <div className="space-y-4">
                        {[
                          { title: 'Two-Factor Authentication', enabled: true },
                          { title: 'Transaction Notifications', enabled: true },
                          { title: 'International Purchases', enabled: false },
                          { title: 'Contactless Payments', enabled: true },
                        ].map((setting) => (
                          <div key={setting.title} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className={`w-2 h-2 rounded-full ${setting.enabled ? 'bg-green-500' : 'bg-gray-300'}`} />
                              <span className="font-medium">{setting.title}</span>
                            </div>
                            <Button variant="outline" size="sm">Configure</Button>
                          </div>
                        ))}
                      </div>
                    </Card>
                    <Card className="p-6">
                      <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                        <BellIcon className="h-5 w-5 text-primary" />
                        Notification Preferences
                      </h3>
                      <div className="space-y-4">
                        {[
                          'Large Transactions',
                          'Online Purchases',
                          'International Transactions',
                          'Card Status Changes',
                        ].map((notification) => (
                          <div key={notification} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="font-medium">{notification}</span>
                            <div className="flex items-center gap-2">
                              <Button variant="outline" size="sm" className="text-xs">Email</Button>
                              <Button variant="outline" size="sm" className="text-xs">SMS</Button>
                              <Button variant="outline" size="sm" className="text-xs">Push</Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </>
        ) : (
          <Card className="p-8 text-center max-w-md mx-auto">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-lg" />
              <div className="relative">
                <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                  <CreditCardIcon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mt-4 text-lg font-medium">No Cards Found</h3>
                <p className="mt-2 text-gray-500">
                  You haven't added any cards yet. Request your first card to get started.
                </p>
                <Button className="mt-6 bg-gradient-to-r from-primary to-primary/80 
                                hover:from-primary/90 hover:to-primary/70 transition-all duration-300 
                                shadow-lg hover:shadow-xl hover:scale-[1.02]">
                  Request Your First Card
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
} 