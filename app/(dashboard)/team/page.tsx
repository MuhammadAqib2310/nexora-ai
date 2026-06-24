"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Plus, UserCog, Search, MoreHorizontal } from "lucide-react";
import { getInitials } from "@/lib/utils";
import { toast } from "sonner";

type Member = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "manager" | "employee" | "client";
  department: string;
  job_title: string;
  status: "active" | "inactive";
};

const ROLE_VARIANT: Record<string, "default" | "info" | "secondary"> = {
  admin: "default",
  manager: "info",
  employee: "secondary",
  client: "secondary",
};

export default function TeamPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [search, setSearch] = useState("");

  const filtered = members.filter((m) => {
    const q = search.toLowerCase();
    return (
      !q ||
      m.name.toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q) ||
      m.department.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage workspace members and roles
          </p>
        </div>
        <Button
          size="sm"
          className="gap-1.5"
          onClick={() => toast.info("Invite member feature coming soon")}
        >
          <Plus className="h-3.5 w-3.5" />
          Invite Member
        </Button>
      </div>

      {members.length > 0 && (
        <div className="relative max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
          <Input
            placeholder="Search members..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-9 text-sm"
          />
        </div>
      )}

      {filtered.length === 0 ? (
        <Card>
          <CardContent className="py-4">
            <EmptyState
              icon={UserCog}
              title={search ? "No members match your search" : "No team members yet"}
              description={
                search
                  ? "Try a different search term."
                  : "Invite your team to collaborate. Assign roles and track performance."
              }
              action={
                !search
                  ? {
                      label: "Invite First Member",
                      onClick: () => toast.info("Invite member feature coming soon"),
                    }
                  : undefined
              }
            />
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((member) => (
            <Card key={member.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{member.name}</p>
                    <p className="text-xs text-gray-500 truncate">{member.email}</p>
                  </div>
                  <Badge
                    variant={ROLE_VARIANT[member.role] ?? "secondary"}
                    className="text-xs capitalize shrink-0"
                  >
                    {member.role}
                  </Badge>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                  <span>{member.department}</span>
                  <span className="flex items-center gap-1">
                    <span className={`h-1.5 w-1.5 rounded-full ${member.status === "active" ? "bg-green-500" : "bg-gray-300"}`} />
                    {member.status}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
