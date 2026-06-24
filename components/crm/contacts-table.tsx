"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { AddContactDialog } from "./add-contact-dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search, Filter, MoreHorizontal, Mail, Star, Trash2, Edit, Copy, Users,
} from "lucide-react";
import { cn, getInitials, formatRelativeTime } from "@/lib/utils";
import { useContacts, type Contact } from "@/lib/hooks/use-contacts";

const SOURCE_LABELS: Record<string, string> = {
  web_form: "Web Form", linkedin: "LinkedIn", facebook: "Facebook",
  whatsapp: "WhatsApp", api: "API", manual: "Manual", import: "Import",
};

const SOURCES = Object.keys(SOURCE_LABELS);

function ScoreBadge({ score }: { score: number }) {
  const variant = score >= 80 ? "success" : score >= 60 ? "warning" : "secondary";
  return (
    <Badge variant={variant} className="gap-1 font-mono text-xs tabular-nums">
      <Star className="h-2.5 w-2.5" />{score}
    </Badge>
  );
}

function ContactRow({
  contact,
  onDelete,
}: {
  contact: Contact;
  onDelete: (id: string) => void;
}) {
  const [copying, setCopying] = useState(false);

  const copyEmail = async () => {
    if (!contact.email) return;
    setCopying(true);
    await navigator.clipboard.writeText(contact.email);
    toast.success("Email copied");
    setTimeout(() => setCopying(false), 1000);
  };

  return (
    <tr className="hover:bg-gray-50/50 transition-colors cursor-pointer group">
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarFallback className="text-xs">
              {getInitials(`${contact.first_name} ${contact.last_name}`)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="font-medium text-gray-900 truncate">
              {contact.first_name} {contact.last_name}
            </p>
            {contact.email && (
              <div className="flex items-center gap-1 mt-0.5">
                <Mail className="h-3 w-3 text-gray-400 shrink-0" />
                <span className="text-xs text-gray-400 truncate max-w-[160px]">{contact.email}</span>
              </div>
            )}
          </div>
        </div>
      </td>
      <td className="px-4 py-3.5">
        <p className="text-sm text-gray-900 truncate">{contact.company || "—"}</p>
        {contact.job_title && <p className="text-xs text-gray-400 truncate">{contact.job_title}</p>}
      </td>
      <td className="px-4 py-3.5 hidden sm:table-cell">
        <Badge variant="outline" className="text-xs">
          {SOURCE_LABELS[contact.source] ?? contact.source}
        </Badge>
      </td>
      <td className="px-4 py-3.5 hidden md:table-cell">
        <ScoreBadge score={contact.ai_score} />
      </td>
      <td className="px-4 py-3.5 hidden lg:table-cell">
        <div className="flex flex-wrap gap-1">
          {contact.tags.slice(0, 2).map((tag) => (
            <span key={tag} className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
              {tag}
            </span>
          ))}
          {contact.tags.length > 2 && (
            <span className="text-xs text-gray-400">+{contact.tags.length - 2}</span>
          )}
        </div>
      </td>
      <td className="px-4 py-3.5 hidden xl:table-cell">
        <span className="text-xs text-gray-400">{formatRelativeTime(contact.created_at)}</span>
      </td>
      <td className="px-4 py-3.5">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 focus:opacity-100" aria-label="Contact actions">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem>
              <Edit className="h-4 w-4 mr-2" />Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={copyEmail}>
              <Copy className="h-4 w-4 mr-2" />{copying ? "Copied!" : "Copy Email"}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-600 focus:text-red-700 focus:bg-red-50"
              onClick={() => onDelete(contact.id)}
            >
              <Trash2 className="h-4 w-4 mr-2" />Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  );
}

export function ContactsTable({ onAddClick }: { onAddClick?: () => void }) {
  const { contacts, isLoading, addContact, deleteContact } = useContacts();
  const [search, setSearch] = useState("");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const openAdd = onAddClick ?? (() => setAddDialogOpen(true));

  const filtered = contacts.filter((c) => {
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      c.first_name.toLowerCase().includes(q) ||
      c.last_name.toLowerCase().includes(q) ||
      (c.email ?? "").toLowerCase().includes(q) ||
      (c.company ?? "").toLowerCase().includes(q);
    const matchesSource = sourceFilter === "all" || c.source === sourceFilter;
    return matchesSearch && matchesSource;
  });

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this contact? This action cannot be undone.")) return;
    try {
      await deleteContact(id);
      toast.success("Contact deleted");
    } catch {
      toast.error("Failed to delete contact");
    }
  };

  return (
    <>
      <Card className="overflow-hidden">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3 border-b border-gray-100 p-4">
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
            <Input
              placeholder="Search contacts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 h-9 text-sm"
              aria-label="Search contacts"
            />
          </div>

          {/* Source filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
            <button
              onClick={() => setSourceFilter("all")}
              className={cn("text-xs px-2.5 py-1.5 rounded-full border transition-colors whitespace-nowrap",
                sourceFilter === "all" ? "bg-violet-600 text-white border-violet-600" : "border-gray-200 text-gray-600 hover:border-gray-300"
              )}
            >
              All
            </button>
            {["web_form", "linkedin", "facebook", "whatsapp"].map((s) => (
              <button
                key={s}
                onClick={() => setSourceFilter(s === sourceFilter ? "all" : s)}
                className={cn("text-xs px-2.5 py-1.5 rounded-full border transition-colors whitespace-nowrap",
                  sourceFilter === s ? "bg-violet-600 text-white border-violet-600" : "border-gray-200 text-gray-600 hover:border-gray-300"
                )}
              >
                {SOURCE_LABELS[s]}
              </button>
            ))}
          </div>

          <div className="ml-auto text-sm text-gray-500 whitespace-nowrap">
            {filtered.length} of {contacts.length}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm" role="table" aria-label="Contacts">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Source</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">AI Score</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Tags</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden xl:table-cell">Added</th>
                <th className="px-4 py-3 w-10" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-8 w-8 rounded-full shrink-0" />
                        <div className="space-y-1.5">
                          <Skeleton className="h-4 w-28" />
                          <Skeleton className="h-3 w-40" />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5"><Skeleton className="h-4 w-24" /></td>
                    <td className="px-4 py-3.5 hidden sm:table-cell"><Skeleton className="h-5 w-20 rounded-full" /></td>
                    <td className="px-4 py-3.5 hidden md:table-cell"><Skeleton className="h-5 w-12 rounded-full" /></td>
                    <td className="px-4 py-3.5 hidden lg:table-cell"><Skeleton className="h-4 w-32" /></td>
                    <td className="px-4 py-3.5 hidden xl:table-cell"><Skeleton className="h-4 w-16" /></td>
                    <td className="px-4 py-3.5" />
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-0">
                    <EmptyState
                      icon={Users}
                      title={search || sourceFilter !== "all" ? "No contacts match your filters" : "No contacts yet"}
                      description={search || sourceFilter !== "all" ? "Try adjusting your search or filters." : "Add your first contact to get started."}
                      action={!search && sourceFilter === "all" ? { label: "Add Contact", onClick: openAdd } : undefined}
                    />
                  </td>
                </tr>
              ) : (
                filtered.map((contact) => (
                  <ContactRow key={contact.id} contact={contact} onDelete={handleDelete} />
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination hint */}
        {filtered.length > 0 && (
          <div className="border-t border-gray-100 px-4 py-3 flex items-center justify-between">
            <p className="text-xs text-gray-500">
              Showing {filtered.length} contact{filtered.length !== 1 ? "s" : ""}
            </p>
          </div>
        )}
      </Card>

      <AddContactDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onSubmit={addContact}
      />
    </>
  );
}
