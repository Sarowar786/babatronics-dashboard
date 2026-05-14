// src\components\dashboard\TopMerchants.tsx
import { Card } from "@/components/ui/card";
import { Crown } from "lucide-react";

interface Merchant {
  id: string;
  businessName: string;
  totalAmount: number;
  transactionCount: number;
  plan: string;
}

interface TopMerchantsProps {
  merchants?: Merchant[];
}

export default function TopMerchants({ merchants = [] }: TopMerchantsProps) {
  const topMerchants = merchants.slice(0, 5);

  return (
    <Card className="p-6 rounded-2xl border-0 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-lg text-gray-900">Top Merchants</h3>
        <Crown className="h-4 w-4 text-yellow-500" />
      </div>

      <div className="space-y-4">
        {topMerchants.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No merchants found</div>
        ) : (
          topMerchants.map((merchant, i) => (
            <div key={merchant.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                <span className="font-semibold text-gray-400 text-sm w-6">
                  {i + 1}
                </span>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {merchant.businessName}
                  </p>
                  <p className="text-xs text-gray-400">
                    {merchant.transactionCount?.toLocaleString() || 0} txns
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-900">
                  ${(merchant.totalAmount || 0).toLocaleString()}
                </span>
                {merchant.plan === "pro" && (
                  <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded font-medium">
                    Pro
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}