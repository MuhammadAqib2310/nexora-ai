import type { Metadata } from "next";
import { DealKanban } from "@/components/crm/deal-kanban";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export const metadata: Metadata = {
  title: "Deals — CRM",
};

export default function DealsPage() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Deal Pipeline</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Track your deals through the sales pipeline
          </p>
        </div>
        <Button size="sm" className="gap-1.5">
          <Plus className="h-3.5 w-3.5" />
          Add Deal
        </Button>
      </div>
      <DealKanban />
    </div>
  );
}
