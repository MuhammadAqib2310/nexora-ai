"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { CreateInvoiceDialog } from "@/components/invoices/create-invoice-dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus, FileText, Search, MoreHorizontal, Send, CheckCircle, XCircle, Trash2, Receipt,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useInvoices, type Invoice } from "@/lib/hooks/use-invoices";

const STATUS_VARIANT: Record<string, "success" | "info" | "secondary" | "destructive" | "warning"> = {
  paid: "success", sent: "info", viewed: "warning",
  draft: "secondary", overdue: "destructive", cancelled: "secondary",
};

const STATUS_LABELS: Record<string, string> = {
  paid: "Paid", sent: "Sent", viewed: "Viewed",
  draft: "Draft", overdue: "Overdue", cancelled: "Cancelled",
};

const FILTER_TABS = [
  { key: "all", label: "All" },
  { key: "draft", label: "Draft" },
  { key: "sent", label: "Sent" },
  { key: "paid", label: "Paid" },
  { key: "overdue", label: "Overdue" },
];

function InvoiceRow({
  invoice,
  onStatusChange,
  onDelete,
}: {
  invoice: Invoice;
  onStatusChange: (id: string, status: Invoice["status"]) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <tr className="hover:bg-gray-50/50 transition-colors cursor-pointer group">
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-gray-400 shrink-0" />
          <span className="font-mono text-xs text-gray-700 font-medium">
            {invoice.invoice_number}
          </span>
        </div>
      </td>
      <td className="px-4 py-3.5">
        <p className="text-sm font-medium text-gray-900">{invoice.client}</p>
        {invoice.client_email && (
          <p className="text-xs text-gray-400">{invoice.client_email}</p>
        )}
      </td>
      <td className="px-4 py-3.5 font-semibold text-gray-900">
        {formatCurrency(invoice.total, invoice.currency)}
      </td>
      <td className="px-4 py-3.5 text-sm text-gray-500 hidden sm:table-cell">
        {formatDate(invoice.issue_date)}
      </td>
      <td className="px-4 py-3.5 text-sm hidden md:table-cell">
        <span className={invoice.status === "overdue" ? "text-red-600 font-medium" : "text-gray-500"}>
          {formatDate(invoice.due_date)}
        </span>
      </td>
      <td className="px-4 py-3.5">
        <Badge variant={STATUS_VARIANT[invoice.status] ?? "secondary"} className="text-xs capitalize">
          {STATUS_LABELS[invoice.status] ?? invoice.status}
        </Badge>
      </td>
      <td className="px-4 py-3.5">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost" size="icon"
              className="h-8 w-8 opacity-0 group-hover:opacity-100 focus:opacity-100"
              aria-label="Invoice actions"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            {invoice.status === "draft" && (
              <DropdownMenuItem onClick={() => onStatusChange(invoice.id, "sent")}>
                <Send className="h-4 w-4 mr-2" />Send Invoice
              </DropdownMenuItem>
            )}
            {(invoice.status === "sent" || invoice.status === "viewed") && (
              <DropdownMenuItem onClick={() => onStatusChange(invoice.id, "paid")}>
                <CheckCircle className="h-4 w-4 mr-2 text-green-500" />Mark as Paid
              </DropdownMenuItem>
            )}
            {invoice.status !== "cancelled" && invoice.status !== "paid" && (
              <DropdownMenuItem onClick={() => onStatusChange(invoice.id, "cancelled")}>
                <XCircle className="h-4 w-4 mr-2 text-gray-400" />Cancel
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-600 focus:text-red-700 focus:bg-red-50"
              onClick={() => onDelete(invoice.id)}
            >
              <Trash2 className="h-4 w-4 mr-2" />Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  );
}

export default function InvoicesPage() {
  const { invoices, isLoading, createInvoice, updateStatus, deleteInvoice } = useInvoices();
  const [createOpen, setCreateOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const filtered = invoices.filter((inv) => {
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      inv.client.toLowerCase().includes(q) ||
      inv.invoice_number.toLowerCase().includes(q);
    const matchesTab = activeTab === "all" || inv.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const totalPaid = invoices
    .filter((i) => i.status === "paid")
    .reduce((s, i) => s + i.total, 0);
  const totalOutstanding = invoices
    .filter((i) => ["sent", "viewed", "overdue"].includes(i.status))
    .reduce((s, i) => s + i.total, 0);

  const handleStatusChange = async (id: string, status: Invoice["status"]) => {
    await updateStatus(id, status);
    toast.success(`Invoice marked as ${status}`);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this invoice? This cannot be undone.")) return;
    await deleteInvoice(id);
    toast.success("Invoice deleted");
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
          <p className="text-sm text-gray-500 mt-0.5">Create, send, and track your invoices</p>
        </div>
        <Button size="sm" className="gap-1.5" onClick={() => setCreateOpen(true)}>
          <Plus className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">New Invoice</span>
        </Button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Total Invoices", value: invoices.length, format: false },
          { label: "Paid", value: totalPaid, format: true, color: "text-green-600" },
          { label: "Outstanding", value: totalOutstanding, format: true, color: "text-amber-600" },
          {
            label: "Overdue",
            value: invoices.filter((i) => i.status === "overdue").length,
            format: false,
            color: "text-red-600",
          },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border border-gray-200 bg-white p-4">
            <p className="text-xs text-gray-500">{stat.label}</p>
            <p className={`mt-1 text-xl font-bold ${stat.color ?? "text-gray-900"}`}>
              {stat.format ? formatCurrency(stat.value as number, "USD", true) : stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Table */}
      <Card className="overflow-hidden">
        <div className="flex flex-wrap items-center gap-3 border-b border-gray-100 p-4">
          <div className="relative min-w-[200px] max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
            <Input
              placeholder="Search invoices..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 h-9 text-sm"
            />
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {FILTER_TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-colors whitespace-nowrap ${
                  activeTab === tab.key
                    ? "bg-violet-600 text-white border-violet-600"
                    : "border-gray-200 text-gray-600 hover:border-gray-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm" aria-label="Invoices">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice #</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Issued</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Due</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 w-10" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 6 }).map((_, j) => (
                      <td key={j} className="px-4 py-3.5">
                        <Skeleton className="h-4 w-full max-w-[120px]" />
                      </td>
                    ))}
                    <td className="px-4 py-3.5" />
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    <EmptyState
                      icon={Receipt}
                      title="No invoices found"
                      description="Create your first invoice to get paid faster."
                      action={{ label: "Create Invoice", onClick: () => setCreateOpen(true) }}
                    />
                  </td>
                </tr>
              ) : (
                filtered.map((inv) => (
                  <InvoiceRow
                    key={inv.id}
                    invoice={inv}
                    onStatusChange={handleStatusChange}
                    onDelete={handleDelete}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <CreateInvoiceDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSubmit={createInvoice}
      />
    </div>
  );
}
