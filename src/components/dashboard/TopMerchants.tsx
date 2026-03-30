import { Card } from "@/components/ui/card";

const merchants = [
  {
    name: "TechShop Online",
    amount: "$12,456",
    transactions: "1,024 txns",
    pro: true,
  },
  {
    name: "Maria's Restaurant",
    amount: "$8,456",
    transactions: "567 txns",
    pro: true,
  },
  {
    name: "Urban Threads",
    amount: "$5,420",
    transactions: "234 txns",
    pro: true,
  },
  {
    name: "Joe's Corner Store",
    amount: "$3,255",
    transactions: "342 txns",
    pro: true,
  },
];

export default function TopMerchants() {
  return (
    <Card className="p-6 rounded-2xl border-0 shadow-sm">
      <h3 className="font-bold text-lg mb-6 text-gray-900">Top Merchants</h3>

      <div className="space-y-4">
        {merchants.map((m, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <span className="font-semibold text-gray-400 text-sm w-6">
                {i + 1}
              </span>
              <div>
                <p className="text-sm font-medium text-gray-900">{m.name}</p>
                <p className="text-xs text-gray-400">{m.transactions}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-900">{m.amount}</span>
              {m.pro && (
                <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded font-medium">
                  Pro
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
