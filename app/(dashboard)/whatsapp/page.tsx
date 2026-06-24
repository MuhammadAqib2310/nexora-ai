"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatCard } from "@/components/shared/stat-card";
import {
  MessageSquare, Send, Bot, User, Phone, Search,
  CheckCheck, Clock, Settings2, Zap,
} from "lucide-react";
import { formatRelativeTime, getInitials } from "@/lib/utils";

const CONVERSATIONS = [
  { id: "1", name: "Raj Patel", phone: "+91-98765-43210", last_message: "When can I schedule a demo?", time: new Date(Date.now() - 1000*60*5).toISOString(), status: "bot", unread: 1 },
  { id: "2", name: "Amara Nwosu", phone: "+234-803-456-7890", last_message: "What's your pricing for the Pro plan?", time: new Date(Date.now() - 1000*60*22).toISOString(), status: "human", unread: 0 },
  { id: "3", name: "Liu Wei", phone: "+86-138-0013-8000", last_message: "Thank you! I'll check it out.", time: new Date(Date.now() - 1000*60*60).toISOString(), status: "resolved", unread: 0 },
  { id: "4", name: "Sofia Andersen", phone: "+45-20-12-3456", last_message: "Can the AI handle appointment booking?", time: new Date(Date.now() - 1000*60*120).toISOString(), status: "bot", unread: 2 },
];

const MESSAGES = [
  { id: "1", role: "inbound", content: "Hi! I saw your ad on Instagram. Can you tell me more?", time: new Date(Date.now() - 1000*60*30).toISOString(), ai: false },
  { id: "2", role: "outbound", content: "Hey Raj! 👋 Welcome to NEXORA AI. I'm your AI assistant. What would you like to know?", time: new Date(Date.now() - 1000*60*29).toISOString(), ai: true },
  { id: "3", role: "inbound", content: "What does your platform do exactly?", time: new Date(Date.now() - 1000*60*28).toISOString(), ai: false },
  { id: "4", role: "outbound", content: "NEXORA is an all-in-one AI Business OS. It includes a CRM, marketing engine, AI CEO mode, WhatsApp automation, voice agents, and much more — all in one platform! 🚀", time: new Date(Date.now() - 1000*60*27).toISOString(), ai: true },
  { id: "5", role: "inbound", content: "When can I schedule a demo?", time: new Date(Date.now() - 1000*60*5).toISOString(), ai: false },
];

const STATUS_BADGE: Record<string, { label: string; variant: "success" | "info" | "secondary" }> = {
  bot: { label: "Bot", variant: "info" },
  human: { label: "Human", variant: "success" },
  resolved: { label: "Resolved", variant: "secondary" },
};

export default function WhatsAppPage() {
  const [selected, setSelected] = useState(CONVERSATIONS[0]);
  const [reply, setReply] = useState("");

  const handleSend = () => {
    if (!reply.trim()) return;
    setReply("");
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">WhatsApp Agent</h1>
          <p className="text-sm text-gray-500 mt-0.5">AI-powered conversations running 24/7</p>
        </div>
        <Button size="sm" className="gap-1.5">
          <Settings2 className="h-3.5 w-3.5" />
          Configure Agent
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard title="Active Conversations" value={4} icon={MessageSquare} iconBg="bg-green-50" iconColor="text-green-600" />
        <StatCard title="Messages Today" value={127} change={14} icon={Send} iconBg="bg-blue-50" iconColor="text-blue-600" />
        <StatCard title="AI Response Rate" value="94%" icon={Bot} iconBg="bg-violet-50" iconColor="text-violet-600" />
        <StatCard title="Avg. Response Time" value="8s" icon={Zap} iconBg="bg-amber-50" iconColor="text-amber-600" />
      </div>

      <Tabs defaultValue="inbox">
        <TabsList>
          <TabsTrigger value="inbox">Inbox</TabsTrigger>
          <TabsTrigger value="flows">Flows</TabsTrigger>
          <TabsTrigger value="training">Training</TabsTrigger>
        </TabsList>

        <TabsContent value="inbox" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[560px]">
            {/* Conversation list */}
            <div className="lg:col-span-1 flex flex-col border border-gray-200 rounded-xl overflow-hidden bg-white">
              <div className="p-3 border-b border-gray-100">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                  <Input placeholder="Search conversations..." className="pl-8 h-8 text-sm" />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
                {CONVERSATIONS.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => setSelected(conv)}
                    className={`w-full flex items-start gap-3 p-3.5 text-left hover:bg-gray-50 transition-colors ${selected?.id === conv.id ? "bg-violet-50" : ""}`}
                  >
                    <Avatar className="h-9 w-9 shrink-0">
                      <AvatarFallback className="text-xs">{getInitials(conv.name)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900 truncate">{conv.name}</p>
                        <span className="text-[11px] text-gray-400 shrink-0 ml-2">{formatRelativeTime(conv.time)}</span>
                      </div>
                      <p className="text-xs text-gray-500 truncate mt-0.5">{conv.last_message}</p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <Badge variant={STATUS_BADGE[conv.status]!.variant} className="text-[10px] py-0">
                          {STATUS_BADGE[conv.status]!.label}
                        </Badge>
                        {conv.unread > 0 && (
                          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-violet-600 text-[10px] font-bold text-white">{conv.unread}</span>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Chat window */}
            <div className="lg:col-span-2 flex flex-col border border-gray-200 rounded-xl overflow-hidden bg-white">
              {selected ? (
                <>
                  {/* Chat header */}
                  <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">{getInitials(selected.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{selected.name}</p>
                      <p className="text-xs text-gray-400">{selected.phone}</p>
                    </div>
                    <div className="ml-auto flex gap-2">
                      <Button variant="outline" size="sm" className="gap-1.5 h-8 text-xs">
                        <Phone className="h-3 w-3" /> Call
                      </Button>
                      <Button variant="outline" size="sm" className="gap-1.5 h-8 text-xs">
                        <User className="h-3 w-3" /> Take Over
                      </Button>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {MESSAGES.map((msg) => (
                      <div key={msg.id} className={`flex ${msg.role === "outbound" ? "justify-end" : "justify-start"}`}>
                        {msg.role === "inbound" && (
                          <Avatar className="h-6 w-6 mr-2 mt-1 shrink-0">
                            <AvatarFallback className="text-[9px]">{getInitials(selected.name)}</AvatarFallback>
                          </Avatar>
                        )}
                        <div className={`max-w-[75%] rounded-2xl px-3.5 py-2.5 ${
                          msg.role === "outbound"
                            ? msg.ai ? "bg-violet-600 text-white rounded-tr-sm" : "bg-gray-900 text-white rounded-tr-sm"
                            : "bg-gray-100 text-gray-900 rounded-tl-sm"
                        }`}>
                          <p className="text-sm leading-relaxed">{msg.content}</p>
                          <div className={`flex items-center gap-1 mt-1 ${msg.role === "outbound" ? "justify-end" : ""}`}>
                            <span className={`text-[10px] ${msg.role === "outbound" ? "text-white/60" : "text-gray-400"}`}>
                              {new Date(msg.time).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                            </span>
                            {msg.ai && <Bot className="h-2.5 w-2.5 text-white/60" />}
                            {msg.role === "outbound" && <CheckCheck className="h-3 w-3 text-white/60" />}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Reply box */}
                  <div className="border-t border-gray-100 p-3 flex items-center gap-2">
                    <Input
                      placeholder="Type a message..."
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSend()}
                      className="flex-1 h-9 text-sm"
                    />
                    <Button size="icon" className="h-9 w-9 shrink-0" onClick={handleSend} aria-label="Send">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
                  Select a conversation
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="flows" className="mt-4">
          <Card>
            <CardContent className="py-16 text-center">
              <Bot className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-700">Conversation Flows</h3>
              <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">
                Build automated conversation flows with drag-and-drop. Connect triggers, conditions, and AI responses.
              </p>
              <Button className="mt-4" size="sm">Build a Flow</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="training" className="mt-4">
          <Card>
            <CardContent className="py-16 text-center">
              <Zap className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-700">AI Training</h3>
              <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">
                Train your AI agent with FAQs, product info, and business context. The more you train, the smarter it gets.
              </p>
              <Button className="mt-4" size="sm">Add Training Data</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
