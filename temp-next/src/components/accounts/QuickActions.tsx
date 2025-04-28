'use client';

import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowUpRight,
  CreditCard,
  History,
  FileText,
} from "lucide-react";
import SendMoneyModal from './SendMoneyModal';
import PayBillsModal from './PayBillsModal';
import { useRouter } from 'next/navigation';

interface AccountOption {
  id: string;
  type: string;
  accountNumber: string;
}

export default function QuickActions({ accounts }: { accounts: AccountOption[] }) {
  const [openSendMoney, setOpenSendMoney] = useState(false);
  const [openPayBills, setOpenPayBills] = useState(false);
  const router = useRouter();

  const quickActions = [
    {
      icon: <ArrowUpRight className="h-4 w-4" />,
      label: "Send Money",
      action: () => setOpenSendMoney(true)
    },
    {
      icon: <CreditCard className="h-4 w-4" />,
      label: "Pay Bills",
      action: () => setOpenPayBills(true)
    },
    {
      icon: <History className="h-4 w-4" />,
      label: "Standing Orders",
      action: () => router.push('/accounts/standing-orders')
    },
    {
      icon: <FileText className="h-4 w-4" />,
      label: "Statements",
      action: () => router.push('/accounts/statements')
    }
  ];

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {quickActions.map((action, index) => (
          <Card 
            key={index} 
            className="cursor-pointer hover:bg-accent transition-colors"
            onClick={action.action}
          >
            <CardContent className="p-4 flex flex-col items-center justify-center space-y-2">
              {action.icon}
              <span className="text-sm font-medium">{action.label}</span>
            </CardContent>
          </Card>
        ))}
      </div>
      <SendMoneyModal open={openSendMoney} onOpenChange={setOpenSendMoney} accounts={accounts} />
      <PayBillsModal open={openPayBills} onOpenChange={setOpenPayBills} accounts={accounts} />
    </>
  );
} 