"use client";

import { useState } from "react";
import Link from "next/link";
import { Bell, Search, Plus, User, Settings, LogOut, HelpCircle, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatRelativeTime } from "@/lib/utils";

const MOCK_NOTIFICATIONS = [
  { id: "1", type: "deal_won", title: "Deal closed", body: "HealthPlus Pilot Program — $12,000", time: new Date(Date.now() - 1000 * 60 * 32).toISOString(), read: false },
  { id: "2", type: "lead", title: "New lead captured", body: "Elena Rodriguez from ShopWave", time: new Date(Date.now() - 1000 * 60 * 68).toISOString(), read: false },
  { id: "3", type: "invoice_paid", title: "Invoice paid", body: "TechCorp — INV-2026-0021", time: new Date(Date.now() - 1000 * 60 * 200).toISOString(), read: true },
];

const QUICK_ADD_ITEMS = [
  { label: "New Contact", href: "/crm/contacts?new=true" },
  { label: "New Deal", href: "/crm/deals?new=true" },
  { label: "New Invoice", href: "/invoices?new=true" },
  { label: "New Campaign", href: "/marketing?new=true" },
  { label: "New Document", href: "/documents?new=true" },
];

export function TopBar() {
  const [search, setSearch] = useState("");
  const unreadCount = MOCK_NOTIFICATIONS.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b border-gray-200 bg-white/95 backdrop-blur-sm px-4 lg:px-6">
      {/* Mobile spacer for hamburger button */}
      <div className="w-10 lg:hidden shrink-0" />

      {/* Search */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        <Input
          placeholder="Search contacts, deals, documents..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 bg-gray-50 border-gray-200 focus-visible:ring-violet-500 h-9 text-sm"
          aria-label="Global search"
        />
      </div>

      <div className="flex items-center gap-2 ml-auto">
        {/* Quick add */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" className="gap-1.5 hidden sm:flex">
              <Plus className="h-3.5 w-3.5" />
              New
              <ChevronDown className="h-3 w-3 opacity-70" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Quick Add</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {QUICK_ADD_ITEMS.map((item) => (
              <DropdownMenuItem key={item.label} asChild>
                <Link href={item.href}>{item.label}</Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="relative flex h-9 w-9 items-center justify-center rounded-lg hover:bg-gray-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
              aria-label={`Notifications${unreadCount > 0 ? ` — ${unreadCount} unread` : ""}`}
            >
              <Bell className="h-4 w-4 text-gray-500" />
              {unreadCount > 0 && (
                <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                  {unreadCount}
                </span>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100">
              <span className="text-sm font-semibold">Notifications</span>
              {unreadCount > 0 && (
                <Badge variant="default" className="text-xs">{unreadCount} new</Badge>
              )}
            </div>
            <div className="max-h-72 overflow-y-auto">
              {MOCK_NOTIFICATIONS.map((n) => (
                <div
                  key={n.id}
                  className={`flex items-start gap-3 px-3 py-2.5 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-0 ${!n.read ? "bg-violet-50/50" : ""}`}
                >
                  <div className={`mt-0.5 h-2 w-2 rounded-full shrink-0 ${!n.read ? "bg-violet-500" : "bg-transparent"}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-900 truncate">{n.title}</p>
                    <p className="text-xs text-gray-500 truncate">{n.body}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">{formatRelativeTime(n.time)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 p-2">
              <Link href="/notifications" className="block text-center text-xs text-violet-600 hover:text-violet-700 font-medium py-1">
                View all notifications
              </Link>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="flex items-center gap-2 rounded-lg hover:bg-gray-100 transition-colors px-2 py-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
              aria-label="User menu"
            >
              <Avatar className="h-7 w-7">
                <AvatarFallback className="bg-violet-100 text-violet-700 text-xs font-semibold">AD</AvatarFallback>
              </Avatar>
              <span className="hidden sm:block text-sm font-medium text-gray-700">Alex D.</span>
              <ChevronDown className="hidden sm:block h-3.5 w-3.5 text-gray-400" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <div className="px-3 py-2 border-b border-gray-100">
              <p className="text-sm font-medium text-gray-900">Alex Demo</p>
              <p className="text-xs text-gray-500">alex@acme.com</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" /> Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <HelpCircle className="h-4 w-4 mr-2" /> Help &amp; Support
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600 focus:text-red-700 focus:bg-red-50">
              <LogOut className="h-4 w-4 mr-2" /> Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
