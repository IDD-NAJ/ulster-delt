import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Recurring Transactions | Ulster Delt",
  description: "Manage your recurring transactions",
};

export default function RecurringTransactionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 