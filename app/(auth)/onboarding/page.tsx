"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Sparkles, Building2, Users, Rocket, CheckCircle2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const INDUSTRIES = [
  "Digital Marketing Agency", "E-commerce", "Real Estate", "Healthcare",
  "Legal", "Education", "SaaS / Technology", "Consulting", "Finance", "Other",
];

const TEAM_SIZES = [
  { value: "solo", label: "Just me" },
  { value: "2-10", label: "2–10 people" },
  { value: "11-50", label: "11–50 people" },
  { value: "51-200", label: "51–200 people" },
  { value: "200+", label: "200+ people" },
];

const GOALS = [
  { id: "crm", label: "Manage leads & sales CRM", icon: "👥" },
  { id: "marketing", label: "Run marketing campaigns", icon: "📢" },
  { id: "ai_ceo", label: "Use AI to grow my business", icon: "🧠" },
  { id: "invoicing", label: "Send invoices & get paid", icon: "💰" },
  { id: "website", label: "Build a website", icon: "🌐" },
  { id: "team", label: "Manage my team", icon: "🏢" },
];

const schema = z.object({
  workspace_name: z.string().min(2, "Workspace name must be at least 2 characters"),
  industry: z.string().min(1, "Please select your industry"),
  size: z.string().min(1, "Please select team size"),
  goals: z.array(z.string()).min(1, "Select at least one goal"),
});

type FormValues = z.infer<typeof schema>;

const STEPS = [
  { id: 1, title: "Your workspace", icon: Building2 },
  { id: 2, title: "Your goals", icon: Rocket },
  { id: 3, title: "You're all set!", icon: CheckCircle2 },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

  const { register, handleSubmit, setValue, watch, formState: { errors } } =
    useForm<FormValues>({
      resolver: zodResolver(schema),
      defaultValues: { workspace_name: "", industry: "", size: "", goals: [] },
    });

  const toggleGoal = (id: string) => {
    const next = selectedGoals.includes(id)
      ? selectedGoals.filter((g) => g !== id)
      : [...selectedGoals, id];
    setSelectedGoals(next);
    setValue("goals", next);
  };

  const handleFinalSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    // Simulate workspace creation
    await new Promise((r) => setTimeout(r, 1200));
    setIsSubmitting(false);
    setStep(3);
  };

  const progress = ((step - 1) / (STEPS.length - 1)) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-950 via-gray-950 to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">NEXORA AI</span>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            {STEPS.map((s) => (
              <div key={s.id} className="flex items-center gap-1.5">
                <div
                  className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all",
                    step >= s.id
                      ? "bg-violet-600 text-white"
                      : "bg-white/10 text-gray-400"
                  )}
                >
                  {step > s.id ? <CheckCircle2 className="h-4 w-4" /> : s.id}
                </div>
                <span className={cn("text-xs hidden sm:block", step >= s.id ? "text-white" : "text-gray-500")}>
                  {s.title}
                </span>
              </div>
            ))}
          </div>
          <Progress value={progress} className="h-1.5 bg-white/10" />
        </div>

        {/* Step 1 — Workspace setup */}
        {step === 1 && (
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600/30">
                  <Building2 className="h-5 w-5 text-violet-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Set up your workspace</h2>
                  <p className="text-sm text-gray-400">Tell us about your business</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-gray-300">
                    Workspace Name <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    placeholder="e.g. Acme Digital Agency"
                    {...register("workspace_name")}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-500 focus-visible:ring-violet-500"
                  />
                  {errors.workspace_name && (
                    <p className="text-xs text-red-400">{errors.workspace_name.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label className="text-gray-300">Industry</Label>
                  <Select onValueChange={(v) => setValue("industry", v)}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white focus:ring-violet-500">
                      <SelectValue placeholder="Select your industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {INDUSTRIES.map((ind) => (
                        <SelectItem key={ind} value={ind}>{ind}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.industry && (
                    <p className="text-xs text-red-400">{errors.industry.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label className="text-gray-300">Team Size</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {TEAM_SIZES.map((size) => {
                      const watched = watch("size");
                      return (
                        <button
                          key={size.value}
                          type="button"
                          onClick={() => setValue("size", size.value)}
                          className={cn(
                            "rounded-lg border py-2 px-3 text-xs font-medium transition-all",
                            watched === size.value
                              ? "border-violet-500 bg-violet-600/30 text-violet-300"
                              : "border-white/20 text-gray-400 hover:border-white/40 hover:text-gray-200"
                          )}
                        >
                          {size.label}
                        </button>
                      );
                    })}
                  </div>
                  {errors.size && (
                    <p className="text-xs text-red-400">{errors.size.message}</p>
                  )}
                </div>
              </div>

              <Button
                className="w-full mt-6"
                onClick={() => {
                  const name = watch("workspace_name");
                  const industry = watch("industry");
                  const size = watch("size");
                  if (name.length >= 2 && industry && size) setStep(2);
                }}
              >
                Continue →
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 2 — Goals */}
        {step === 2 && (
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600/30">
                  <Rocket className="h-5 w-5 text-violet-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">What are your main goals?</h2>
                  <p className="text-sm text-gray-400">Select everything that applies</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5 mb-4">
                {GOALS.map((goal) => (
                  <button
                    key={goal.id}
                    type="button"
                    onClick={() => toggleGoal(goal.id)}
                    className={cn(
                      "flex items-center gap-2.5 rounded-xl border p-3 text-left transition-all",
                      selectedGoals.includes(goal.id)
                        ? "border-violet-500 bg-violet-600/20 text-white"
                        : "border-white/20 text-gray-400 hover:border-white/40 hover:text-gray-200"
                    )}
                  >
                    <span className="text-lg">{goal.icon}</span>
                    <span className="text-xs font-medium leading-snug">{goal.label}</span>
                    {selectedGoals.includes(goal.id) && (
                      <CheckCircle2 className="h-4 w-4 text-violet-400 ml-auto shrink-0" />
                    )}
                  </button>
                ))}
              </div>

              {selectedGoals.length === 0 && (
                <p className="text-xs text-red-400 mb-3">Please select at least one goal</p>
              )}

              <div className="flex gap-3">
                <Button variant="outline" className="border-white/20 text-gray-300 hover:bg-white/10 bg-transparent" onClick={() => setStep(1)}>
                  ← Back
                </Button>
                <Button
                  className="flex-1"
                  disabled={selectedGoals.length === 0 || isSubmitting}
                  onClick={handleSubmit(handleFinalSubmit)}
                >
                  {isSubmitting ? (
                    <><Loader2 className="h-4 w-4 animate-spin mr-2" />Setting up...</>
                  ) : "Launch my workspace →"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3 — Done */}
        {step === 3 && (
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-500/20 mx-auto mb-4">
                <CheckCircle2 className="h-8 w-8 text-green-400" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">
                Your workspace is ready! 🎉
              </h2>
              <p className="text-gray-400 text-sm mb-6">
                Welcome to NEXORA AI. Your AI-powered business operating system is set up and ready to go.
              </p>
              <div className="space-y-2 text-left mb-6">
                {[
                  "✅ Workspace created",
                  "✅ CRM pipeline configured",
                  "✅ AI CEO activated",
                  "✅ 14-day trial started",
                ].map((item) => (
                  <p key={item} className="text-sm text-gray-300">{item}</p>
                ))}
              </div>
              <Button className="w-full" onClick={() => router.push("/dashboard")}>
                <Sparkles className="h-4 w-4 mr-2" />
                Go to Dashboard
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
