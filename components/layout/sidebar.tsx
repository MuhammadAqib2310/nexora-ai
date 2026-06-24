"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Megaphone,
  Brain,
  BarChart3,
  Globe,
  MessageSquare,
  Phone,
  FileText,
  Receipt,
  UserCog,
  Settings,
  Sparkles,
  ChevronRight,
  X,
  Menu,
  TrendingUp,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  {
    name: "CRM",
    href: "/crm/contacts",
    icon: Users,
    children: [
      { name: "Contacts", href: "/crm/contacts" },
      { name: "Deals", href: "/crm/deals" },
    ],
  },
  { name: "Marketing", href: "/marketing", icon: Megaphone },
  { name: "AI CEO", href: "/ai-ceo", icon: Brain, badge: "AI" },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Website Builder", href: "/website-builder", icon: Globe },
  { name: "WhatsApp Agent", href: "/whatsapp", icon: MessageSquare },
  { name: "Voice Agent", href: "/voice", icon: Phone },  { name: "Invoices", href: "/invoices", icon: Receipt },
  { name: "Documents", href: "/documents", icon: FileText },
  { name: "Team", href: "/team", icon: UserCog },
  { name: "Settings", href: "/settings", icon: Settings },
];

function NavContent({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();

  return (
    <>
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b border-white/10 px-6">
        <Link href="/dashboard" className="flex items-center gap-2.5" onClick={onClose}>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600 shrink-0">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight">NEXORA AI</span>
        </Link>
        {onClose && (
          <button onClick={onClose} className="lg:hidden text-gray-400 hover:text-white p-1 rounded-md" aria-label="Close menu">
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-0.5">
          {navigation.map((item) => {
            const isActive =
              pathname === item.href ||
              pathname.startsWith(item.href + "/") ||
              (item.children?.some((c) => pathname.startsWith(c.href)) ?? false);

            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                    isActive
                      ? "bg-violet-600/20 text-violet-400"
                      : "text-gray-400 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <item.icon
                    className={cn(
                      "h-4 w-4 shrink-0 transition-colors",
                      isActive ? "text-violet-400" : "text-gray-500 group-hover:text-gray-300"
                    )}
                  />
                  <span className="flex-1 truncate">{item.name}</span>
                  {item.badge && (
                    <span className="rounded-md bg-violet-600/30 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-violet-400">
                      {item.badge}
                    </span>
                  )}
                  {item.children && (
                    <ChevronRight
                      className={cn(
                        "h-3.5 w-3.5 text-gray-600 transition-transform",
                        isActive && "rotate-90"
                      )}
                    />
                  )}
                </Link>

                {item.children && isActive && (
                  <ul className="ml-7 mt-1 space-y-0.5 border-l border-white/10 pl-3">
                    {item.children.map((child) => (
                      <li key={child.name}>
                        <Link
                          href={child.href}
                          onClick={onClose}
                          className={cn(
                            "block rounded-md px-3 py-1.5 text-sm transition-colors",
                            pathname.startsWith(child.href)
                              ? "text-white"
                              : "text-gray-500 hover:text-gray-300"
                          )}
                        >
                          {child.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Plan badge */}
      <div className="border-t border-white/10 p-4">
        <div className="rounded-lg bg-violet-600/10 border border-violet-500/20 px-3 py-2.5">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-3.5 w-3.5 text-violet-400" />
            <p className="text-xs font-medium text-violet-400">Professional Plan</p>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">14 days trial remaining</p>
          <div className="mt-2 h-1 rounded-full bg-white/10">
            <div className="h-1 rounded-full bg-violet-500 w-[30%]" />
          </div>
        </div>
      </div>
    </>
  );
}

export function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile hamburger trigger — shown in TopBar via context, but also here as fallback */}
      <button
        className="fixed top-4 left-4 z-50 lg:hidden flex h-9 w-9 items-center justify-center rounded-lg bg-gray-900 text-white shadow-lg"
        onClick={() => setMobileOpen(true)}
        aria-label="Open menu"
      >
        <Menu className="h-4 w-4" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-gray-950 text-white transition-transform duration-300 lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <NavContent onClose={() => setMobileOpen(false)} />
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 z-50 w-64 flex-col bg-gray-950 text-white">
        <NavContent />
      </aside>
    </>
  );
}
