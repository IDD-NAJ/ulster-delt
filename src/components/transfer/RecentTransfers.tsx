import { Transfer } from '@prisma/client';
import { Card } from '@/components/ui/card';
import { formatCurrency, formatDate } from '@/lib/utils';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

interface RecentTransfersProps {
  transfers: Transfer[];
}

export default function RecentTransfers({ transfers }: RecentTransfersProps) {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Recent Transfers</h2>

      <div className="space-y-4">
        {transfers.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No recent transfers</p>
        ) : (
          transfers.map((transfer) => (
            <div
              key={transfer.id}
              className="flex items-center space-x-4 p-3 rounded-lg border border-gray-100"
            >
              <div className="flex-1">
                <p className="font-medium">{transfer.recipientName}</p>
                <p className="text-sm text-gray-500">
                  {formatDate(transfer.createdAt)}
                </p>
              </div>

              <ArrowRightIcon className="h-4 w-4 text-gray-400" />

              <div className="text-right">
                <p className="font-medium text-red-600">
                  -{formatCurrency(transfer.amount)}
                </p>
                <p className="text-sm text-gray-500">{transfer.reference}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
} 