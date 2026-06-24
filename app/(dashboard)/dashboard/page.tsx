import type { Metadata } from "next";
import { DollarSign, Users, Target, Megaphone, ArrowRight, TrendingUp } from "lucide-react";
import { StatCard } from "@/components/shared/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export const metadata: Metadata = { title: "Dashboard" };

export default function DashboardPage() {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">{today}</p>
        </div>
        <Link href="/ai-ceo">
          <Button className="gap-2">
            Ask AI CEO
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      {/* KPI Cards — all zero until real data connected */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Revenue (MTD)"
          value={0}
          icon={DollarSign}
          isCurrency
          iconColor="text-violet-600"
          iconBg="bg-violet-50"
        />
        <StatCard
          title="Active Leads"
          value={0}
          icon={Users}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
        />
        <StatCard
          title="Conversion Rate"
          value="0%"
          icon={Target}
          iconColor="text-green-600"
          iconBg="bg-green-50"
        />
        <StatCard
          title="Active Campaigns"
          value={0}
          icon={Megaphone}
          iconColor="text-orange-600"
          iconBg="bg-orange-50"
        />
      </div>

      {/* Empty state guides */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          {
            href: "/crm/contacts",
            icon: "👥",
            title: "Add your first contact",
            desc: "Import or manually add leads to start tracking your pipeline.",
            badge: "CRM",
          },
          {
            href: "/crm/deals",
            icon: "💼",
            title: "Create a deal",
            desc: "Add deals to your pipeline and track them through to close.",
            badge: "Pipeline",
          },
          {
            href: "/marketing",
            icon: "📢",
            title: "Launch a campaign",
            desc: "Create your first email or ad campaign with AI-generated content.",
            badge: "Marketing",
          },
          {
            href: "/invoices",
            icon: "🧾",
            title: "Send an invoice",
            desc: "Create and send professional invoices to get paid faster.",
            badge: "Invoices",
          },
          {
            href: "/ai-ceo",
            icon: "🧠",
            title: "Talk to your AI CEO",
            desc: "Describe a goal and let AI analyze your business and propose strategies.",
            badge: "AI CEO",
          },
          {
            href: "/website-builder",
            icon: "🌐",
            title: "Build your website",
            desc: "Describe your business and get a live website in 30 seconds.",
            badge: "Website",
          },
        ].map((item) => (
          <Link key={item.href} href={item.href}>
            <div className="group rounded-xl border border-gray-200 bg-white p-5 hover:border-violet-300 hover:shadow-md transition-all cursor-pointer h-full">
              <div className="flex items-start justify-between gap-3">
                <span className="text-3xl">{item.icon}</span>
                <Badge variant="secondary" className="text-xs shrink-0">
                  {item.badge}
                </Badge>
              </div>
              <h3 className="mt-3 font-semibold text-gray-900 group-hover:text-violet-700 transition-colors">
                {item.title}
              </h3>
              <p className="mt-1 text-sm text-gray-500 leading-relaxed">
                {item.desc}
              </p>
              <div className="mt-3 flex items-center gap-1 text-xs font-medium text-violet-600 opacity-0 group-hover:opacity-100 transition-opacity">
                Get started <ArrowRight className="h-3 w-3" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Getting started card */}
      <Card className="border-violet-200 bg-gradient-to-r from-violet-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base text-violet-900">
            <TrendingUp className="h-4 w-4" />
            Getting Started with NEXORA AI
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { step: "1", label: "Add contacts", href: "/crm/contacts", done: false },
              { step: "2", label: "Create a deal", href: "/crm/deals", done: false },
              { step: "3", label: "Send an invoice", href: "/invoices", done: false },
              { step: "4", label: "Talk to AI CEO", href: "/ai-ceo", done: false },
            ].map((item) => (
              <Link key={item.step} href={item.href}>
                <div className="flex items-center gap-3 rounded-lg bg-white border border-violet-100 px-4 py-3 hover:border-violet-300 transition-colors cursor-pointer">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-100 text-xs font-bold text-violet-700">
                    {item.step}
                  </div>
                  <span className="text-sm font-medium text-gray-700">{item.label}</span>
                  <ArrowRight className="h-3.5 w-3.5 text-violet-400 ml-auto" />
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
