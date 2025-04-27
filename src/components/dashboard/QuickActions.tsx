'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ArrowRightIcon, 
  CreditCardIcon, 
  BanknotesIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

const actions = [
  {
    title: 'Transfer Money',
    description: 'Send money to accounts',
    href: '/transfer',
    icon: ArrowRightIcon,
  },
  {
    title: 'Pay Bills',
    description: 'Pay your bills and utilities',
    href: '/pay',
    icon: BanknotesIcon,
  },
  {
    title: 'Manage Cards',
    description: 'View and manage your cards',
    href: '/cards',
    icon: CreditCardIcon,
  },
  {
    title: 'Recurring Payments',
    description: 'Set up automatic payments',
    href: '/recurring',
    icon: ArrowPathIcon,
  },
];

export default function QuickActions() {
  return (
    <Card className="p-3 xs:p-4 sm:p-5 lg:p-6 bg-white/50 backdrop-blur-sm">
      <h2 className="text-lg xs:text-xl sm:text-2xl font-semibold mb-3 xs:mb-4">Quick Actions</h2>
      
      <div className="grid gap-2 xs:gap-3 sm:gap-4">
        {actions.map((action) => (
          <Link key={action.title} href={action.href}>
            <Button
              variant="outline"
              className="w-full justify-start text-left h-auto py-2.5 xs:py-3 sm:py-4 
                       hover:scale-[1.02] hover:shadow-md transition-all duration-200
                       bg-white hover:bg-gray-50/80"
            >
              <div className="flex items-center gap-3 xs:gap-4">
                <div className="flex-shrink-0">
                  <action.icon className="h-5 w-5 xs:h-6 xs:w-6 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm xs:text-base font-medium truncate">
                    {action.title}
                  </h3>
                  <p className="text-xs xs:text-sm text-gray-500 truncate">
                    {action.description}
                  </p>
                </div>
              </div>
            </Button>
          </Link>
        ))}
      </div>
    </Card>
  );
} 