"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus, FileText, FileSignature, FileCheck, Search, MoreHorizontal, Trash2, Eye,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";

type Doc = {
  id: string;
  title: string;
  type: "proposal" | "contract" | "nda" | "sow" | "other";
  status: "draft" | "sent" | "signed" | "expired";
  created_at: string;
};

const TYPE_ICONS = {
  contract: FileSignature,
  proposal: FileText,
  nda: FileCheck,
  sow: FileText,
  other: FileText,
};

const STATUS_VARIANT = {
  signed: "success",
  sent: "info",
  draft: "secondary",
  expired: "destructive",
} as const;

const DOC_TYPES = [
  { value: "proposal", label: "Proposal" },
  { value: "contract", label: "Contract" },
  { value: "nda", label: "NDA" },
  { value: "sow", label: "Statement of Work" },
];

export default function DocumentsPage() {
  const [docs, setDocs] = useState<Doc[]>([]);
  const [search, setSearch] = useState("");

  const filtered = docs.filter((d) => {
    const q = search.toLowerCase();
    return !q || d.title.toLowerCase().includes(q);
  });

  const handleDelete = (id: string) => {
    setDocs((prev) => prev.filter((d) => d.id !== id));
    toast.success("Document deleted");
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            AI-generated proposals, contracts, NDAs, and more
          </p>
        </div>
        <Button
          size="sm"
          className="gap-1.5"
          onClick={() => toast.info("Document generator coming soon")}
        >
          <Plus className="h-3.5 w-3.5" />
          New Document
        </Button>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          {DOC_TYPES.map((t) => (
            <TabsTrigger key={t.value} value={t.value}>
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {["all", ...DOC_TYPES.map((t) => t.value)].map((tab) => {
          const tabDocs = tab === "all"
            ? filtered
            : filtered.filter((d) => d.type === tab);

          return (
            <TabsContent key={tab} value={tab} className="mt-4">
              {tabDocs.length === 0 ? (
                <Card>
                  <CardContent className="py-4">
                    <EmptyState
                      icon={FileText}
                      title="No documents yet"
                      description="Generate a proposal, contract, or NDA in seconds using AI. Just answer a few questions."
                      action={{
                        label: "Generate Document",
                        onClick: () => toast.info("Document generator coming soon"),
                      }}
                    />
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {tabDocs.map((doc) => {
                    const Icon = TYPE_ICONS[doc.type] ?? FileText;
                    return (
                      <Card key={doc.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-5">
                          <div className="flex items-start justify-between gap-3">
                            <div className="rounded-lg bg-violet-50 p-2.5">
                              <Icon className="h-5 w-5 text-violet-600" />
                            </div>
                            <div className="flex items-center gap-1">
                              <Badge
                                variant={STATUS_VARIANT[doc.status] ?? "secondary"}
                                className="text-xs capitalize"
                              >
                                {doc.status}
                              </Badge>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-7 w-7">
                                    <MoreHorizontal className="h-3.5 w-3.5" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-36">
                                  <DropdownMenuItem>
                                    <Eye className="h-4 w-4 mr-2" />View
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    className="text-red-600 focus:text-red-700 focus:bg-red-50"
                                    onClick={() => handleDelete(doc.id)}
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                          <p className="mt-3 font-medium text-gray-900 text-sm">{doc.title}</p>
                          <p className="mt-1 text-xs text-gray-400 capitalize">{doc.type}</p>
                          <p className="mt-1.5 text-xs text-gray-400">
                            Created {formatDate(doc.created_at)}
                          </p>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
