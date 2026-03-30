import { Card } from "@/components/ui/card";

export default function StatCard({
  title,
  value,
  icon,
  iconBg = "bg-yellow-100",
}: any) {
  return (
    <Card className="px-6 py-6 rounded-2xl border-0 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
            {title}
          </p>
          <h2 className="text-2xl font-bold mt-2 text-gray-900">{value}</h2>
        </div>
        <div
          className={`text-2xl ${iconBg} w-14 h-14 rounded-lg flex justify-center items-center`}
        >
          {icon}
        </div>
      </div>
    </Card>
  );
}
