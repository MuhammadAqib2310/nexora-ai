"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatCard } from "@/components/shared/stat-card";
import { Megaphone, Mail, Globe, MousePointer, TrendingUp, Plus } from "lucide-react";
import { toast } from "sonner";

export default function MarketingPage() {
  const [campaigns, setCampaigns] = useState<never[]>([]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Marketing Engine</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Campaigns that write and optimize themselves
          </p>
        </div>
        <Button
          size="sm"
          className="gap-1.5"
          onClick={() => toast.info("Campaign builder coming soon")}
        >
          <Plus className="h-3.5 w-3.5" />
          New Campaign
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard title="Active Campaigns" value={0} icon={Megaphone} iconBg="bg-violet-50" iconColor="text-violet-600" />
        <StatCard title="Emails Sent" value={0} icon={Mail} iconBg="bg-blue-50" iconColor="text-blue-600" />
        <StatCard title="Total Clicks" value={0} icon={MousePointer} iconBg="bg-green-50" iconColor="text-green-600" />
        <StatCard title="Total Conversions" value={0} icon={TrendingUp} iconBg="bg-amber-50" iconColor="text-amber-600" />
      </div>

      <Tabs defaultValue="campaigns">
        <TabsList>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="ads">Ads</TabsTrigger>
          <TabsTrigger value="seo">SEO Content</TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns" className="mt-4">
          <Card>
            <CardContent className="py-4">
              <EmptyState
                icon={Megaphone}
                title="No campaigns yet"
                description="Create your first AI-powered campaign — email, Facebook ads, Google ads, or LinkedIn posts."
                action={{
                  label: "Create Campaign",
                  onClick: () => toast.info("Campaign builder coming soon"),
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email" className="mt-4">
          <Card>
            <CardContent className="py-4">
              <EmptyState
                icon={Mail}
                title="No email campaigns"
                description="Design AI-written email sequences with smart send-time optimization."
                action={{ label: "Create Email Campaign", onClick: () => toast.info("Email builder coming soon") }}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ads" className="mt-4">
          <Card>
            <CardContent className="py-4">
              <EmptyState
                icon={Globe}
                title="No ad campaigns"
                description="Connect your Meta and Google Ads accounts to manage campaigns from here."
                action={{ label: "Connect Ad Account", onClick: () => toast.info("Ad integration coming soon") }}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo" className="mt-4">
          <Card>
            <CardContent className="py-4">
              <EmptyState
                icon={TrendingUp}
                title="No SEO content yet"
                description="Generate blog posts, landing pages, and metadata with AI to rank higher on Google."
                action={{ label: "Generate Content", onClick: () => toast.info("SEO content generator coming soon") }}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
