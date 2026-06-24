import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/shared/stat-card";
import { DollarSign, Users, Target, TrendingUp, BarChart2 } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = { title: "Analytics" };

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics Center</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Revenue, customers, and campaign performance
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="MRR" value={0} icon={DollarSign} isCurrency iconColor="text-violet-600" iconBg="bg-violet-50" />
        <StatCard title="ARR" value={0} icon={TrendingUp} isCurrency iconColor="text-blue-600" iconBg="bg-blue-50" />
        <StatCard title="Active Customers" value={0} icon={Users} iconColor="text-green-600" iconBg="bg-green-50" />
        <StatCard title="Conversion Rate" value="0%" icon={Target} iconColor="text-orange-600" iconBg="bg-orange-50" />
      </div>

      {/* Empty state */}
      <Card>
        <CardContent className="py-20 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-100 mb-4">
            <BarChart2 className="h-8 w-8 text-violet-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">No data yet</h3>
          <p className="mt-2 text-sm text-gray-500 max-w-sm mx-auto">
            Analytics will populate automatically once you start adding contacts,
            creating deals, and running campaigns.
          </p>
          <div className="mt-5 flex justify-center gap-3">
            <Link href="/crm/contacts">
              <Button size="sm">Add Contacts</Button>
            </Link>
            <Link href="/marketing">
              <Button size="sm" variant="outline">Launch Campaign</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
