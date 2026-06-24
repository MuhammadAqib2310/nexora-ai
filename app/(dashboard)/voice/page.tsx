"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatCard } from "@/components/shared/stat-card";
import { Progress } from "@/components/ui/progress";
import {
  Phone, PhoneIncoming, PhoneOutgoing, PhoneMissed,
  Clock, Mic, PlayCircle, Download, Bot, Zap,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

const CALL_LOG = [
  { id: "1", contact: "Sarah Johnson", phone: "+1-555-0101", direction: "inbound", status: "completed", duration: "4:32", ai_summary: "Lead interested in Professional plan. Wants demo on Friday.", created_at: "2026-06-23T10:30:00Z" },
  { id: "2", contact: "James Okafor", phone: "+234-801-0104", direction: "outbound", status: "completed", duration: "2:14", ai_summary: "Follow-up call. Client confirmed interest in CRM module.", created_at: "2026-06-23T09:15:00Z" },
  { id: "3", contact: "Unknown", phone: "+1-555-0190", direction: "inbound", status: "missed", duration: "—", ai_summary: null, created_at: "2026-06-22T16:45:00Z" },
  { id: "4", contact: "Priya Sharma", phone: "+91-98-0105", direction: "outbound", status: "voicemail", duration: "0:45", ai_summary: "Left voicemail about pilot program follow-up.", created_at: "2026-06-22T14:20:00Z" },
];

const DIR_ICONS = {
  inbound: PhoneIncoming,
  outbound: PhoneOutgoing,
};

const STATUS_COLORS = {
  completed: "success",
  missed: "destructive",
  voicemail: "warning",
  failed: "destructive",
} as const;

export default function VoicePage() {
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Voice Agent</h1>
          <p className="text-sm text-gray-500 mt-0.5">AI-powered inbound & outbound calling</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-1.5">
            <PhoneOutgoing className="h-3.5 w-3.5" />
            Outbound Campaign
          </Button>
          <Button size="sm" className="gap-1.5">
            <Phone className="h-3.5 w-3.5" />
            Configure Agent
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard title="Total Calls Today" value={18} change={22} icon={Phone} iconBg="bg-blue-50" iconColor="text-blue-600" />
        <StatCard title="Avg. Duration" value="3m 24s" icon={Clock} iconBg="bg-violet-50" iconColor="text-violet-600" />
        <StatCard title="AI Handle Rate" value="87%" icon={Bot} iconBg="bg-green-50" iconColor="text-green-600" />
        <StatCard title="Leads Qualified" value={7} change={40} icon={Zap} iconBg="bg-amber-50" iconColor="text-amber-600" />
      </div>

      <Tabs defaultValue="calls">
        <TabsList>
          <TabsTrigger value="calls">Call Log</TabsTrigger>
          <TabsTrigger value="scripts">Scripts</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="calls" className="mt-4">
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Direction</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Duration</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">AI Summary</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Date</th>
                    <th className="px-4 py-3 w-10" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {CALL_LOG.map((call) => {
                    const DirIcon = DIR_ICONS[call.direction as keyof typeof DIR_ICONS] ?? Phone;
                    return (
                      <tr key={call.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-4 py-3.5">
                          <p className="font-medium text-gray-900 text-sm">{call.contact}</p>
                          <p className="text-xs text-gray-400">{call.phone}</p>
                        </td>
                        <td className="px-4 py-3.5 hidden sm:table-cell">
                          <div className="flex items-center gap-1.5 text-xs text-gray-600 capitalize">
                            <DirIcon className="h-3.5 w-3.5" />
                            {call.direction}
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          <Badge variant={STATUS_COLORS[call.status as keyof typeof STATUS_COLORS] ?? "secondary"} className="text-xs capitalize">
                            {call.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3.5 hidden md:table-cell text-sm text-gray-600">{call.duration}</td>
                        <td className="px-4 py-3.5 hidden lg:table-cell">
                          {call.ai_summary ? (
                            <p className="text-xs text-gray-600 max-w-xs truncate">{call.ai_summary}</p>
                          ) : (
                            <span className="text-xs text-gray-400">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3.5 hidden sm:table-cell text-xs text-gray-400">
                          {formatDate(call.created_at)}
                        </td>
                        <td className="px-4 py-3.5">
                          {call.status === "completed" && (
                            <Button variant="ghost" size="icon" className="h-7 w-7" aria-label="Play recording">
                              <PlayCircle className="h-4 w-4 text-gray-400" />
                            </Button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="scripts" className="mt-4">
          <Card>
            <CardContent className="py-12 text-center">
              <Mic className="h-10 w-10 text-gray-300 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-700">Call Scripts</h3>
              <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">
                Define what your AI agent says during inbound and outbound calls.
              </p>
              <Button className="mt-4" size="sm">Create Script</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Voice Agent Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: "Voice", value: "ElevenLabs — Rachel (Female, US)" },
                { label: "Language", value: "English (US)" },
                { label: "Greeting", value: "Hi, you've reached NEXORA AI. How can I help you today?" },
                { label: "Phone Number", value: "+1 (555) 000-0001 (Twilio)" },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <span className="text-sm font-medium text-gray-700">{label}</span>
                  <span className="text-sm text-gray-500">{value}</span>
                </div>
              ))}
              <Button size="sm" className="mt-2">Update Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
