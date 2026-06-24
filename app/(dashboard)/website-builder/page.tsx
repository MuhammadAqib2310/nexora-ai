"use client";

import { useState, useTransition } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Globe, Sparkles, ExternalLink, Eye, Pencil, Trash2,
  Loader2, Send, CheckCircle2, Layout,
} from "lucide-react";
import { toast } from "sonner";
import { formatDate } from "@/lib/utils";

const DEMO_PAGES = [
  { id: "1", title: "Home Page", slug: "/", status: "published", views: 1284, updated_at: "2026-06-20" },
  { id: "2", title: "About Us", slug: "/about", status: "published", views: 342, updated_at: "2026-06-18" },
  { id: "3", title: "Services", slug: "/services", status: "published", views: 891, updated_at: "2026-06-15" },
  { id: "4", title: "Pricing", slug: "/pricing", status: "draft", views: 0, updated_at: "2026-06-22" },
  { id: "5", title: "Contact", slug: "/contact", status: "published", views: 456, updated_at: "2026-06-10" },
];

const PAGE_TEMPLATES = [
  { id: "real_estate", name: "Real Estate Agency", emoji: "🏘️" },
  { id: "agency", name: "Digital Agency", emoji: "🎨" },
  { id: "ecommerce", name: "E-commerce Store", emoji: "🛒" },
  { id: "saas", name: "SaaS Product", emoji: "⚡" },
  { id: "consulting", name: "Consulting Firm", emoji: "💼" },
  { id: "healthcare", name: "Healthcare Clinic", emoji: "🏥" },
];

export default function WebsiteBuilderPage() {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, startGeneration] = useTransition();
  const [generatedPreview, setGeneratedPreview] = useState<string | null>(null);

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    startGeneration(async () => {
      await new Promise((r) => setTimeout(r, 1500));
      setGeneratedPreview(prompt);
      toast.success("Website generated! Preview is ready.");
    });
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Website Builder</h1>
          <p className="text-sm text-gray-500 mt-0.5">Prompt to live website in 30 seconds</p>
        </div>
        <Button size="sm" variant="outline" className="gap-1.5">
          <ExternalLink className="h-3.5 w-3.5" />
          Visit Site
        </Button>
      </div>

      <Tabs defaultValue="generate">
        <TabsList>
          <TabsTrigger value="generate">AI Generate</TabsTrigger>
          <TabsTrigger value="pages">Pages</TabsTrigger>
          <TabsTrigger value="settings">Site Settings</TabsTrigger>
        </TabsList>

        {/* AI Generator */}
        <TabsContent value="generate" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="space-y-4">
              <Card>
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="h-4 w-4 text-violet-600" />
                    <h2 className="font-semibold text-gray-900">Describe your website</h2>
                  </div>
                  <Textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder='e.g. "Create a modern luxury real estate agency website with dark theme, property listings, and a contact form"'
                    className="h-28 text-sm resize-none"
                  />
                  <Button
                    className="w-full mt-3 gap-2"
                    onClick={handleGenerate}
                    disabled={!prompt.trim() || isGenerating}
                  >
                    {isGenerating ? (
                      <><Loader2 className="h-4 w-4 animate-spin" />Generating...</>
                    ) : (
                      <><Sparkles className="h-4 w-4" />Generate Website</>
                    )}
                  </Button>
                </CardContent>
              </Card>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Or start with a template</p>
                <div className="grid grid-cols-2 gap-2">
                  {PAGE_TEMPLATES.map((tmpl) => (
                    <button
                      key={tmpl.id}
                      onClick={() => setPrompt(`Create a professional ${tmpl.name} website`)}
                      className="flex items-center gap-2 rounded-lg border border-gray-200 p-3 text-left hover:border-violet-300 hover:bg-violet-50 transition-colors"
                    >
                      <span className="text-lg">{tmpl.emoji}</span>
                      <span className="text-xs font-medium text-gray-700">{tmpl.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Preview panel */}
            <Card className="overflow-hidden">
              {generatedPreview ? (
                <>
                  <div className="flex items-center justify-between border-b border-gray-100 px-4 py-2.5">
                    <div className="flex items-center gap-1.5">
                      <div className="h-3 w-3 rounded-full bg-red-400" />
                      <div className="h-3 w-3 rounded-full bg-yellow-400" />
                      <div className="h-3 w-3 rounded-full bg-green-400" />
                    </div>
                    <span className="text-xs text-gray-400">preview.nexora.ai</span>
                    <Badge variant="success" className="text-xs gap-1">
                      <CheckCircle2 className="h-2.5 w-2.5" />Ready
                    </Badge>
                  </div>
                  <div className="p-6 text-center">
                    <div className="h-64 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-800 flex items-center justify-center text-white">
                      <div>
                        <Globe className="h-10 w-10 mx-auto mb-3 opacity-80" />
                        <p className="font-bold text-lg">Your website is ready</p>
                        <p className="text-sm text-white/70 mt-1 max-w-xs">
                          Generated from: &quot;{generatedPreview.slice(0, 60)}...&quot;
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button className="flex-1 gap-1.5" size="sm">
                        <Eye className="h-3.5 w-3.5" />Preview
                      </Button>
                      <Button variant="outline" className="flex-1 gap-1.5" size="sm">
                        <Send className="h-3.5 w-3.5" />Publish
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <CardContent className="py-20 text-center">
                  <Layout className="h-12 w-12 text-gray-200 mx-auto mb-3" />
                  <p className="text-sm text-gray-400">
                    Your generated website preview will appear here
                  </p>
                </CardContent>
              )}
            </Card>
          </div>
        </TabsContent>

        {/* Pages list */}
        <TabsContent value="pages" className="mt-4">
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Page</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slug</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Views</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Last Updated</th>
                    <th className="px-4 py-3 w-20" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {DEMO_PAGES.map((page) => (
                    <tr key={page.id} className="hover:bg-gray-50/50">
                      <td className="px-4 py-3.5 font-medium text-gray-900">{page.title}</td>
                      <td className="px-4 py-3.5 font-mono text-xs text-gray-500">{page.slug}</td>
                      <td className="px-4 py-3.5">
                        <Badge variant={page.status === "published" ? "success" : "secondary"} className="text-xs capitalize">
                          {page.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3.5 hidden sm:table-cell text-gray-600">{page.views.toLocaleString()}</td>
                      <td className="px-4 py-3.5 hidden md:table-cell text-xs text-gray-400">{formatDate(page.updated_at)}</td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon" className="h-7 w-7" aria-label="Edit page">
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-red-400 hover:text-red-600" aria-label="Delete page">
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        {/* Site Settings */}
        <TabsContent value="settings" className="mt-4">
          <Card>
            <CardContent className="p-5 space-y-4 max-w-lg">
              <div className="space-y-1.5">
                <Label>Site Name</Label>
                <Input defaultValue="Acme Digital Agency" />
              </div>
              <div className="space-y-1.5">
                <Label>Custom Domain</Label>
                <Input defaultValue="acmedigital.com" placeholder="yourdomain.com" />
              </div>
              <div className="space-y-1.5">
                <Label>Meta Description</Label>
                <Textarea defaultValue="We help businesses grow with AI-powered digital marketing." className="h-20" />
              </div>
              <Button size="sm">Save Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
