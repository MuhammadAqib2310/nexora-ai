"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Building2, CreditCard, Bell, Shield, Key, Users, Zap,
  Check, AlertTriangle, Copy,
} from "lucide-react";

const NOTIFICATION_SETTINGS = [
  { id: "new_lead", label: "New lead captured", description: "When a new contact is created" },
  { id: "deal_won", label: "Deal won", description: "When a deal is marked as won" },
  { id: "invoice_paid", label: "Invoice paid", description: "When a payment is received" },
  { id: "ai_report", label: "AI CEO weekly report", description: "Every Monday morning" },
  { id: "campaign_alert", label: "Campaign performance alerts", description: "When ROAS drops below threshold" },
  { id: "trial_ending", label: "Trial ending reminder", description: "3 days before trial expires" },
];

export default function SettingsPage() {
  const [notifications, setNotifications] = useState<Record<string, boolean>>(
    Object.fromEntries(NOTIFICATION_SETTINGS.map((n) => [n.id, true]))
  );
  const [isSaving, setIsSaving] = useState(false);
  const [twoFA, setTwoFA] = useState(false);

  const aiUsedPct = 34; // 1700 / 5000

  const handleSaveWorkspace = async () => {
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setIsSaving(false);
    toast.success("Workspace settings saved");
  };

  const handleCopyKey = () => {
    navigator.clipboard.writeText("nxr_live_sk_xxxxxxxxxxxxxxxx");
    toast.success("API key copied to clipboard");
  };

  return (
    <div className="space-y-5 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-0.5">Manage your workspace and account</p>
      </div>

      <Tabs defaultValue="workspace">
        <TabsList className="flex flex-wrap h-auto gap-1">
          <TabsTrigger value="workspace">Workspace</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="api">API Keys</TabsTrigger>
        </TabsList>

        {/* Workspace */}
        <TabsContent value="workspace" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-gray-500" />
                <CardTitle className="text-base">Workspace Details</CardTitle>
              </div>
              <CardDescription>Update your workspace name and business info</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Workspace Name</Label>
                  <Input defaultValue="Acme Digital Agency" />
                </div>
                <div className="space-y-1.5">
                  <Label>Industry</Label>
                  <Input defaultValue="Digital Marketing" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Website</Label>
                  <Input defaultValue="https://acmedigital.com" />
                </div>
                <div className="space-y-1.5">
                  <Label>Team Size</Label>
                  <Input defaultValue="2–10" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Business Address</Label>
                <Input defaultValue="123 Main St, New York, NY 10001" />
              </div>
              <Button size="sm" onClick={handleSaveWorkspace} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </CardContent>
          </Card>

          {/* Members */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-gray-500" />
                <CardTitle className="text-base">Team Members</CardTitle>
              </div>
              <CardDescription>Manage who has access to this workspace</CardDescription>
            </CardHeader>
            <CardContent>
              {[
                { name: "Alex Demo", email: "alex@acme.com", role: "admin" },
                { name: "Jamie Lee", email: "jamie@acme.com", role: "manager" },
              ].map((m) => (
                <div key={m.email} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{m.name}</p>
                    <p className="text-xs text-gray-400">{m.email}</p>
                  </div>
                  <Badge variant={m.role === "admin" ? "default" : "secondary"} className="capitalize text-xs">
                    {m.role}
                  </Badge>
                </div>
              ))}
              <Button variant="outline" size="sm" className="mt-3">
                Invite Member
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billing */}
        <TabsContent value="billing" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-gray-500" />
                <CardTitle className="text-base">Current Plan</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-xl border border-violet-200 bg-violet-50 p-4">
                <div>
                  <p className="font-semibold text-violet-900">Professional Plan</p>
                  <p className="text-sm text-violet-600 mt-0.5">$149/month · Billed monthly</p>
                  <p className="text-xs text-violet-500 mt-0.5">Trial ends June 30, 2026</p>
                </div>
                <Badge className="bg-violet-600 text-white">Trial</Badge>
              </div>

              {/* AI Usage */}
              <div>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-gray-600 flex items-center gap-1.5"><Zap className="h-3.5 w-3.5 text-violet-500" />AI Requests</span>
                  <span className="text-gray-900 font-medium">1,700 / 5,000</span>
                </div>
                <Progress value={aiUsedPct} className="h-2" />
                <p className="text-xs text-gray-400 mt-1">Resets on July 1, 2026</p>
              </div>

              <Separator />

              <div className="flex flex-wrap gap-3">
                <Button size="sm">Upgrade to Business</Button>
                <Button variant="outline" size="sm">Manage Billing</Button>
                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-600 hover:border-red-200">
                  Cancel Subscription
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" className="mt-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-gray-500" />
                <CardTitle className="text-base">Notification Preferences</CardTitle>
              </div>
              <CardDescription>Choose which notifications you receive</CardDescription>
            </CardHeader>
            <CardContent className="space-y-1">
              {NOTIFICATION_SETTINGS.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{item.label}</p>
                    <p className="text-xs text-gray-400">{item.description}</p>
                  </div>
                  <Switch
                    checked={notifications[item.id] ?? true}
                    onCheckedChange={(checked) =>
                      setNotifications((prev) => ({ ...prev, [item.id]: checked }))
                    }
                  />
                </div>
              ))}
              <Button
                size="sm"
                className="mt-4"
                onClick={() => toast.success("Notification preferences saved")}
              >
                Save Preferences
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security */}
        <TabsContent value="security" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-gray-500" />
                <CardTitle className="text-base">Security</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <p className="text-sm font-medium text-gray-900">Two-Factor Authentication</p>
                  <p className="text-xs text-gray-400">Add an extra layer of security to your account</p>
                </div>
                <Switch
                  checked={twoFA}
                  onCheckedChange={(v) => {
                    setTwoFA(v);
                    toast.success(v ? "2FA enabled" : "2FA disabled");
                  }}
                />
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <p className="text-sm font-medium text-gray-900">Session Management</p>
                  <p className="text-xs text-gray-400">1 active session</p>
                </div>
                <Button
                  variant="outline" size="sm"
                  onClick={() => toast.info("All other sessions would be terminated")}
                >
                  Sign Out Others
                </Button>
              </div>
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-medium text-amber-800">Password last changed</p>
                  <p className="text-xs text-amber-700">Never — we recommend updating your password regularly</p>
                </div>
              </div>
              <Button
                variant="outline" size="sm"
                onClick={() => toast.info("Password reset email would be sent")}
              >
                Change Password
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* API Keys */}
        <TabsContent value="api" className="mt-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Key className="h-4 w-4 text-gray-500" />
                <CardTitle className="text-base">API Keys</CardTitle>
              </div>
              <CardDescription>Use these keys to integrate NEXORA with external services</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-gray-900">Secret API Key</p>
                  <Badge variant="success" className="gap-1 text-xs">
                    <Check className="h-2.5 w-2.5" />Active
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    value="nxr_live_sk_••••••••••••••••"
                    readOnly
                    className="font-mono text-sm bg-gray-50"
                  />
                  <Button
                    variant="outline" size="icon"
                    className="shrink-0 h-10 w-10"
                    onClick={handleCopyKey}
                    aria-label="Copy API key"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  Keep this secret. Never expose it in client-side code.
                </p>
              </div>
              <Button
                variant="outline" size="sm"
                onClick={() => toast.warning("Regenerating key will invalidate the existing one")}
              >
                Regenerate Key
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
