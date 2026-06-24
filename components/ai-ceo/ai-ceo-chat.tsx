"use client";

import { useState, useRef, useTransition } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Brain,
  Send,
  Loader2,
  TrendingUp,
  Lightbulb,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Strategy = {
  title: string;
  description: string;
  expected_roi: string;
  effort: "low" | "medium" | "high";
  actions: string[];
};

type Gap = {
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
};

type Analysis = {
  summary: string;
  gaps: Gap[];
  strategies: Strategy[];
  next_steps: string[];
};

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  analysis?: Analysis;
  timestamp: Date;
};

const SUGGESTED_COMMANDS = [
  "Increase revenue by 25% this quarter",
  "Improve my lead conversion rate",
  "Launch a new marketing campaign targeting agencies",
  "Reduce customer churn",
  "Identify my biggest growth opportunities",
];

const EFFORT_COLORS = {
  low: "success",
  medium: "warning",
  high: "destructive",
} as const;

const IMPACT_COLORS = {
  high: "destructive",
  medium: "warning",
  low: "secondary",
} as const;

function StrategyCard({ strategy, index }: { strategy: Strategy; index: number }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-100 text-xs font-bold text-violet-700 mt-0.5">
            {index + 1}
          </div>
          <div>
            <p className="font-medium text-gray-900">{strategy.title}</p>
            <p className="text-sm text-gray-500 mt-0.5">{strategy.description}</p>
          </div>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1.5">
          <Badge variant="success" className="text-xs whitespace-nowrap">
            {strategy.expected_roi}
          </Badge>
          <Badge variant={EFFORT_COLORS[strategy.effort]} className="text-xs">
            {strategy.effort} effort
          </Badge>
        </div>
      </div>

      {strategy.actions.length > 0 && (
        <button
          className="mt-3 flex items-center gap-1 text-xs text-violet-600 hover:text-violet-700"
          onClick={() => setExpanded((v) => !v)}
        >
          {expanded ? (
            <>
              <ChevronUp className="h-3.5 w-3.5" />
              Hide action steps
            </>
          ) : (
            <>
              <ChevronDown className="h-3.5 w-3.5" />
              Show {strategy.actions.length} action steps
            </>
          )}
        </button>
      )}

      {expanded && (
        <ul className="mt-2 space-y-1.5">
          {strategy.actions.map((action, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
              <ArrowRight className="h-3 w-3 mt-0.5 text-violet-400 shrink-0" />
              {action}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function AnalysisResult({ analysis }: { analysis: Analysis }) {
  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="rounded-lg bg-violet-50 border border-violet-100 p-4">
        <p className="text-sm font-medium text-violet-900 flex items-center gap-2">
          <Brain className="h-4 w-4 text-violet-600" />
          Executive Summary
        </p>
        <p className="mt-1.5 text-sm text-gray-700">{analysis.summary}</p>
      </div>

      {/* Performance Gaps */}
      {analysis.gaps.length > 0 && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
            Performance Gaps Identified
          </p>
          <div className="space-y-2">
            {analysis.gaps.map((gap, i) => (
              <div
                key={i}
                className="flex items-start gap-2.5 rounded-lg border border-gray-200 bg-white p-3"
              >
                <Badge
                  variant={IMPACT_COLORS[gap.impact]}
                  className="mt-0.5 shrink-0 text-xs"
                >
                  {gap.impact}
                </Badge>
                <div>
                  <p className="text-sm font-medium text-gray-800">{gap.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{gap.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Strategies */}
      {analysis.strategies.length > 0 && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2 flex items-center gap-1.5">
            <TrendingUp className="h-3.5 w-3.5" />
            Ranked Strategies
          </p>
          <div className="space-y-2.5">
            {analysis.strategies.map((s, i) => (
              <StrategyCard key={i} strategy={s} index={i} />
            ))}
          </div>
        </div>
      )}

      {/* Next Steps */}
      {analysis.next_steps.length > 0 && (
        <div className="rounded-lg bg-green-50 border border-green-100 p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-green-700 mb-2 flex items-center gap-1.5">
            <Lightbulb className="h-3.5 w-3.5" />
            Immediate Next Steps
          </p>
          <ol className="space-y-1.5">
            {analysis.next_steps.map((step, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="font-semibold text-green-600 shrink-0">{i + 1}.</span>
                {step}
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}

export function AiCeoChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isPending, startTransition] = useTransition();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const sendCommand = (command: string) => {
    if (!command.trim() || isPending) return;

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: command,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    startTransition(async () => {
      try {
        const res = await fetch("/api/ai/ceo", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ command }),
        });

        if (!res.ok) throw new Error("AI CEO request failed");

        const data = (await res.json()) as { analysis: Analysis };

        const assistantMsg: Message = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: data.analysis.summary,
          analysis: data.analysis,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, assistantMsg]);
      } catch {
        const errorMsg: Message = {
          id: crypto.randomUUID(),
          role: "assistant",
          content:
            "I couldn't complete that analysis right now. Please check your API key and try again.",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMsg]);
      }
    });
  };

  const handleSubmit = () => sendCommand(input);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
      {/* Chat area */}
      <div className="lg:col-span-2 space-y-4">
        {/* Messages */}
        <div className="min-h-[400px] space-y-4">
          {messages.length === 0 && (
            <Card className="border-dashed">
              <CardContent className="py-16 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-100">
                  <Brain className="h-8 w-8 text-violet-600" />
                </div>
                <h3 className="mt-4 font-semibold text-gray-900">
                  Your AI CEO is ready
                </h3>
                <p className="mt-1.5 text-sm text-gray-500 max-w-sm mx-auto">
                  Type a business goal below, or choose one of the suggested
                  commands to get started.
                </p>
              </CardContent>
            </Card>
          )}

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "flex",
                msg.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              {msg.role === "user" ? (
                <div className="max-w-md rounded-2xl rounded-tr-sm bg-violet-600 px-4 py-3 text-sm text-white">
                  {msg.content}
                </div>
              ) : (
                <div className="w-full space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-violet-100">
                      <Sparkles className="h-3.5 w-3.5 text-violet-600" />
                    </div>
                    <span className="text-xs font-medium text-gray-500">
                      AI CEO Analysis
                    </span>
                  </div>
                  {msg.analysis ? (
                    <AnalysisResult analysis={msg.analysis} />
                  ) : (
                    <Card>
                      <CardContent className="py-4">
                        <p className="text-sm text-gray-700">{msg.content}</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </div>
          ))}

          {isPending && (
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Loader2 className="h-4 w-4 animate-spin text-violet-500" />
              AI CEO is analyzing your business data...
            </div>
          )}
        </div>

        {/* Input */}
        <Card>
          <CardContent className="p-3">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder='Give a business goal, e.g. "Increase revenue by 20% in Q3"'
              className="min-h-[80px] border-0 focus-visible:ring-0 p-0 resize-none text-sm"
              disabled={isPending}
            />
            <div className="mt-2 flex items-center justify-between">
              <p className="text-xs text-gray-400">
                Press Enter to submit, Shift+Enter for new line
              </p>
              <Button
                onClick={handleSubmit}
                disabled={!input.trim() || isPending}
                size="sm"
                className="gap-1.5"
              >
                {isPending ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Send className="h-3.5 w-3.5" />
                )}
                {isPending ? "Analyzing..." : "Send to AI CEO"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sidebar — suggestions */}
      <div className="space-y-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">
              Suggested Goals
            </p>
            <div className="space-y-2">
              {SUGGESTED_COMMANDS.map((cmd) => (
                <button
                  key={cmd}
                  onClick={() => sendCommand(cmd)}
                  disabled={isPending}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-left text-sm text-gray-700 hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700 transition-colors disabled:opacity-50"
                >
                  {cmd}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">
              How it works
            </p>
            <ol className="space-y-3">
              {[
                "Describe your business goal in plain English",
                "AI CEO analyzes your CRM, revenue, and campaign data",
                "Receive ranked strategies with expected ROI",
                "Approve and AI CEO executes automatically",
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs text-gray-600">
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-violet-100 text-[10px] font-bold text-violet-700">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
