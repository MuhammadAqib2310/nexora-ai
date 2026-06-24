"use client";

import { useState } from "react";
import { toast } from "sonner";
import { cn, formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AddDealDialog } from "./add-deal-dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal, Plus, Trophy, TrendingUp, Hash, CheckCircle2, Trash2,
} from "lucide-react";
import { useDeals, type Deal } from "@/lib/hooks/use-deals";

const STAGES = [
  { id: "lead",        name: "Lead",         color: "#6366f1", bg: "bg-indigo-50",  dot: "bg-indigo-400" },
  { id: "qualified",   name: "Qualified",    color: "#8b5cf6", bg: "bg-violet-50",  dot: "bg-violet-400" },
  { id: "proposal",    name: "Proposal",     color: "#f59e0b", bg: "bg-amber-50",   dot: "bg-amber-400"  },
  { id: "negotiation", name: "Negotiation",  color: "#ef4444", bg: "bg-red-50",     dot: "bg-red-400"    },
  { id: "won",         name: "Closed Won",   color: "#22c55e", bg: "bg-green-50",   dot: "bg-green-400"  },
];

function DealCard({
  deal,
  onMove,
  onDelete,
}: {
  deal: Deal;
  onMove: (id: string, stage: string) => void;
  onDelete: (id: string) => void;
}) {
  const initials = deal.contact
    .split(" ")
    .map((n) => n[0] ?? "")
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const probColor =
    deal.probability >= 80
      ? "success"
      : deal.probability >= 60
      ? "warning"
      : "secondary";

  return (
    <div className="group rounded-lg border border-gray-200 bg-white p-3.5 shadow-sm hover:shadow-md transition-all">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-semibold text-gray-900 leading-snug flex-1">
          {deal.title}
        </p>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 opacity-0 group-hover:opacity-100 focus:opacity-100 shrink-0"
              aria-label="Deal actions"
            >
              <MoreHorizontal className="h-3.5 w-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem onClick={() => onMove(deal.id, "won")}>
              <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />Mark as Won
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {STAGES.filter((s) => s.id !== deal.stage).map((s) => (
              <DropdownMenuItem key={s.id} onClick={() => onMove(deal.id, s.id)}>
                Move to {s.name}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-600 focus:text-red-700 focus:bg-red-50"
              onClick={() => onDelete(deal.id)}
            >
              <Trash2 className="h-4 w-4 mr-2" />Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <p className="mt-0.5 text-xs text-gray-500 truncate">{deal.company}</p>

      {/* Value + probability */}
      <div className="mt-3 flex items-end justify-between">
        <div>
          <p className="text-base font-bold text-gray-900">
            {formatCurrency(deal.value)}
          </p>
          <p className="text-[11px] text-gray-400 mt-0.5">
            Close:{" "}
            {new Date(deal.close_date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </p>
        </div>
        <Badge variant={probColor} className="text-xs font-mono">
          {deal.probability}%
        </Badge>
      </div>

      {/* Footer */}
      <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center gap-2">
        <Avatar className="h-5 w-5 shrink-0">
          <AvatarFallback className="text-[9px] font-semibold">
            {initials}
          </AvatarFallback>
        </Avatar>
        <span className="text-xs text-gray-500 truncate">{deal.contact}</span>
      </div>
    </div>
  );
}

export function DealKanban() {
  const { deals, isLoading, addDeal, moveDeal, deleteDeal } = useDeals();
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [defaultStage, setDefaultStage] = useState("lead");

  const totalPipeline = deals
    .filter((d) => d.status === "open")
    .reduce((s, d) => s + d.value, 0);
  const weighted = deals
    .filter((d) => d.status === "open")
    .reduce((s, d) => s + (d.value * d.probability) / 100, 0);
  const wonValue = deals
    .filter((d) => d.status === "won")
    .reduce((s, d) => s + d.value, 0);

  const handleMove = async (id: string, stage: string) => {
    await moveDeal(id, stage);
    if (stage === "won") toast.success("🎉 Deal marked as won!");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this deal?")) return;
    await deleteDeal(id);
    toast.success("Deal deleted");
  };

  const openAddDialog = (stage: string) => {
    setDefaultStage(stage);
    setAddDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex gap-4 overflow-x-auto pb-4">
        {STAGES.map((s) => (
          <div key={s.id} className="w-72 shrink-0">
            <Skeleton className="h-6 w-32 mb-3" />
            <div className="space-y-2.5">
              {[1, 2].map((i) => (
                <Skeleton key={i} className="h-28 w-full rounded-lg" />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Summary bar */}
      <div className="flex flex-wrap items-center gap-4 rounded-xl border border-gray-200 bg-white px-5 py-3">
        <div className="flex items-center gap-2">
          <Hash className="h-4 w-4 text-gray-400" />
          <div>
            <p className="text-[11px] text-gray-500 uppercase tracking-wide">Pipeline</p>
            <p className="text-sm font-bold text-gray-900">
              {formatCurrency(totalPipeline)}
            </p>
          </div>
        </div>
        <div className="h-8 w-px bg-gray-200 hidden sm:block" />
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-violet-400" />
          <div>
            <p className="text-[11px] text-gray-500 uppercase tracking-wide">Weighted</p>
            <p className="text-sm font-bold text-violet-600">
              {formatCurrency(weighted)}
            </p>
          </div>
        </div>
        <div className="h-8 w-px bg-gray-200 hidden sm:block" />
        <div className="flex items-center gap-2">
          <Trophy className="h-4 w-4 text-green-500" />
          <div>
            <p className="text-[11px] text-gray-500 uppercase tracking-wide">Won</p>
            <p className="text-sm font-bold text-green-600">
              {formatCurrency(wonValue)}
            </p>
          </div>
        </div>
        <div className="h-8 w-px bg-gray-200 hidden sm:block" />
        <div>
          <p className="text-[11px] text-gray-500 uppercase tracking-wide">Total Deals</p>
          <p className="text-sm font-bold text-gray-900">{deals.length}</p>
        </div>
      </div>

      {/* Kanban columns */}
      <div className="flex gap-3 overflow-x-auto pb-4">
        {STAGES.map((stage) => {
          const stageDeals = deals.filter((d) => d.stage === stage.id);
          const stageValue = stageDeals.reduce((s, d) => s + d.value, 0);

          return (
            <div key={stage.id} className="w-68 min-w-[264px] shrink-0">
              {/* Column header */}
              <div className="mb-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={cn("h-2.5 w-2.5 rounded-full", stage.dot)} />
                  <span className="text-sm font-semibold text-gray-700">
                    {stage.name}
                  </span>
                  <span className="rounded-full bg-gray-100 px-1.5 py-0.5 text-xs font-medium text-gray-500">
                    {stageDeals.length}
                  </span>
                </div>
                <span className="text-xs text-gray-400">
                  {formatCurrency(stageValue, "USD", true)}
                </span>
              </div>

              {/* Cards */}
              <div
                className={cn(
                  "min-h-[120px] space-y-2.5 rounded-xl p-2",
                  stage.bg
                )}
              >
                {stageDeals.map((deal) => (
                  <DealCard
                    key={deal.id}
                    deal={deal}
                    onMove={handleMove}
                    onDelete={handleDelete}
                  />
                ))}

                {/* Add deal button */}
                <button
                  onClick={() => openAddDialog(stage.id)}
                  className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-gray-300 bg-white/50 py-2.5 text-xs text-gray-400 hover:border-violet-400 hover:text-violet-500 hover:bg-white transition-all"
                >
                  <Plus className="h-3 w-3" />
                  Add deal
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <AddDealDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onSubmit={addDeal}
        defaultStage={defaultStage}
      />
    </div>
  );
}
