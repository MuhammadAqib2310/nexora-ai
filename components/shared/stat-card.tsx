import { cn, formatCurrency } from "@/lib/utils";
import { type LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

type StatCardProps = {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  prefix?: string;
  isCurrency?: boolean;
};

export function StatCard({
  title,
  value,
  change,
  changeLabel = "vs last month",
  icon: Icon,
  iconColor = "text-violet-600",
  iconBg = "bg-violet-50",
  prefix,
  isCurrency,
}: StatCardProps) {
  const isPositive = (change ?? 0) >= 0;

  const displayValue =
    isCurrency && typeof value === "number"
      ? formatCurrency(value, "USD", true)
      : `${prefix ?? ""}${typeof value === "number" ? value.toLocaleString() : value}`;

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">
              {displayValue}
            </p>
            {change !== undefined && (
              <div className="mt-1 flex items-center gap-1">
                {isPositive ? (
                  <TrendingUp className="h-3.5 w-3.5 text-green-600" />
                ) : (
                  <TrendingDown className="h-3.5 w-3.5 text-red-500" />
                )}
                <span
                  className={cn(
                    "text-xs font-medium",
                    isPositive ? "text-green-600" : "text-red-500"
                  )}
                >
                  {isPositive ? "+" : ""}
                  {change}%
                </span>
                <span className="text-xs text-gray-400">{changeLabel}</span>
              </div>
            )}
          </div>
          <div className={cn("rounded-xl p-2.5", iconBg)}>
            <Icon className={cn("h-5 w-5", iconColor)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
