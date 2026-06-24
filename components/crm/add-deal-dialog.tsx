"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import type { DealFormData } from "@/lib/hooks/use-deals";

const STAGES = [
  { id: "lead", name: "Lead" },
  { id: "qualified", name: "Qualified" },
  { id: "proposal", name: "Proposal" },
  { id: "negotiation", name: "Negotiation" },
  { id: "won", name: "Closed Won" },
];

const schema = z.object({
  title: z.string().min(1, "Deal title is required"),
  contact: z.string().optional().default(""),
  company: z.string().optional().default(""),
  value: z.coerce.number().min(0, "Value must be positive").default(0),
  currency: z.string().default("USD"),
  probability: z.coerce.number().min(0).max(100).default(50),
  close_date: z.string().min(1, "Close date is required"),
  stage: z.string().default("lead"),
});

type FormValues = z.infer<typeof schema>;

interface AddDealDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: DealFormData) => Promise<unknown>;
  defaultStage?: string;
}

export function AddDealDialog({
  open,
  onOpenChange,
  onSubmit,
  defaultStage = "lead",
}: AddDealDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const today = new Date();
  const defaultCloseDate = new Date(today.setMonth(today.getMonth() + 1))
    .toISOString()
    .split("T")[0]!;

  const {
    register, handleSubmit, reset, setValue, formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "", contact: "", company: "", value: 0,
      currency: "USD", probability: 50,
      close_date: defaultCloseDate, stage: defaultStage,
    },
  });

  const handleFormSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data as DealFormData);
      toast.success(`Deal "${data.title}" created`);
      reset();
      onOpenChange(false);
    } catch {
      toast.error("Failed to create deal. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Deal</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="title">
              Deal Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              placeholder="e.g. TechCorp Annual Contract"
              {...register("title")}
              className={errors.title ? "border-red-400" : ""}
            />
            {errors.title && (
              <p className="text-xs text-red-500">{errors.title.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="contact">Contact Name</Label>
              <Input id="contact" placeholder="Sarah Johnson" {...register("contact")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="company">Company</Label>
              <Input id="company" placeholder="TechCorp" {...register("company")} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="value">Deal Value ($)</Label>
              <Input
                id="value"
                type="number"
                min={0}
                placeholder="10000"
                {...register("value")}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="probability">Win Probability (%)</Label>
              <Input
                id="probability"
                type="number"
                min={0}
                max={100}
                placeholder="50"
                {...register("probability")}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Pipeline Stage</Label>
              <Select
                defaultValue={defaultStage}
                onValueChange={(v) => setValue("stage", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STAGES.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="close_date">
                Expected Close <span className="text-red-500">*</span>
              </Label>
              <Input
                id="close_date"
                type="date"
                {...register("close_date")}
                className={errors.close_date ? "border-red-400" : ""}
              />
              {errors.close_date && (
                <p className="text-xs text-red-500">{errors.close_date.message}</p>
              )}
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => { reset(); onOpenChange(false); }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <><Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />Saving...</>
              ) : "Add Deal"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
