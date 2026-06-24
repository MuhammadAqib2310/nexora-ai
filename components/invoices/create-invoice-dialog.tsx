"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import type { InvoiceFormData } from "@/lib/hooks/use-invoices";

const itemSchema = z.object({
  description: z.string().min(1, "Description required"),
  quantity: z.coerce.number().min(0.01, "Must be > 0"),
  unit_price: z.coerce.number().min(0, "Must be ≥ 0"),
});

const schema = z.object({
  client: z.string().min(1, "Client name is required"),
  client_email: z.string().email("Invalid email").optional().or(z.literal("")),
  issue_date: z.string().min(1, "Issue date required"),
  due_date: z.string().min(1, "Due date required"),
  currency: z.string().default("USD"),
  tax_rate: z.coerce.number().min(0).max(100).default(0),
  notes: z.string().optional().default(""),
  items: z.array(itemSchema).min(1, "At least one line item required"),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: InvoiceFormData) => Promise<unknown>;
}

export function CreateInvoiceDialog({ open, onOpenChange, onSubmit }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const today = new Date().toISOString().split("T")[0]!;
  const dueDefault = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0]!;

  const { register, handleSubmit, control, reset, watch, formState: { errors } } =
    useForm<FormValues>({
      resolver: zodResolver(schema),
      defaultValues: {
        client: "", client_email: "", issue_date: today, due_date: dueDefault,
        currency: "USD", tax_rate: 0, notes: "",
        items: [{ description: "", quantity: 1, unit_price: 0 }],
      },
    });

  const { fields, append, remove } = useFieldArray({ control, name: "items" });
  const watchedItems = watch("items");
  const taxRate = watch("tax_rate") || 0;

  const subtotal = (watchedItems || []).reduce(
    (sum, item) => sum + (Number(item.quantity) || 0) * (Number(item.unit_price) || 0),
    0
  );
  const taxAmount = (subtotal * taxRate) / 100;
  const total = subtotal + taxAmount;

  const handleFormSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data as InvoiceFormData);
      toast.success("Invoice created successfully");
      reset();
      onOpenChange(false);
    } catch {
      toast.error("Failed to create invoice. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[640px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Invoice</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5" noValidate>
          {/* Client info */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="client">Client Name <span className="text-red-500">*</span></Label>
              <Input
                id="client" placeholder="TechCorp"
                {...register("client")}
                className={errors.client ? "border-red-400" : ""}
              />
              {errors.client && <p className="text-xs text-red-500">{errors.client.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="client_email">Client Email</Label>
              <Input id="client_email" type="email" placeholder="billing@techcorp.com" {...register("client_email")} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="issue_date">Issue Date <span className="text-red-500">*</span></Label>
              <Input id="issue_date" type="date" {...register("issue_date")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="due_date">Due Date <span className="text-red-500">*</span></Label>
              <Input id="due_date" type="date" {...register("due_date")} />
            </div>
          </div>

          <Separator />

          {/* Line items */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <Label className="text-sm font-semibold">Line Items</Label>
              <Button
                type="button" variant="outline" size="sm"
                onClick={() => append({ description: "", quantity: 1, unit_price: 0 })}
                className="gap-1.5 h-8 text-xs"
              >
                <Plus className="h-3.5 w-3.5" /> Add Item
              </Button>
            </div>

            {errors.items && !Array.isArray(errors.items) && (
              <p className="text-xs text-red-500 mb-2">{errors.items.message}</p>
            )}

            <div className="space-y-2">
              {/* Header row */}
              <div className="grid grid-cols-[1fr_80px_100px_32px] gap-2 px-1">
                <p className="text-xs font-medium text-gray-500 uppercase">Description</p>
                <p className="text-xs font-medium text-gray-500 uppercase">Qty</p>
                <p className="text-xs font-medium text-gray-500 uppercase">Unit Price</p>
                <span />
              </div>

              {fields.map((field, index) => {
                const qty = Number(watchedItems?.[index]?.quantity) || 0;
                const price = Number(watchedItems?.[index]?.unit_price) || 0;
                const lineTotal = qty * price;
                return (
                  <div key={field.id} className="grid grid-cols-[1fr_80px_100px_32px] gap-2 items-start">
                    <div>
                      <Input
                        placeholder="Service description"
                        {...register(`items.${index}.description`)}
                        className={`h-9 text-sm ${errors.items?.[index]?.description ? "border-red-400" : ""}`}
                      />
                    </div>
                    <Input
                      type="number" min="0.01" step="0.01" placeholder="1"
                      {...register(`items.${index}.quantity`)}
                      className="h-9 text-sm"
                    />
                    <div>
                      <Input
                        type="number" min="0" step="0.01" placeholder="0.00"
                        {...register(`items.${index}.unit_price`)}
                        className="h-9 text-sm"
                      />
                      {lineTotal > 0 && (
                        <p className="text-[11px] text-gray-400 mt-0.5 text-right">
                          = {formatCurrency(lineTotal)}
                        </p>
                      )}
                    </div>
                    <Button
                      type="button" variant="ghost" size="icon"
                      className="h-9 w-8 text-gray-400 hover:text-red-500"
                      onClick={() => fields.length > 1 && remove(index)}
                      disabled={fields.length <= 1}
                      aria-label="Remove line item"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>

          <Separator />

          {/* Totals */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="notes">Notes (optional)</Label>
              <Textarea
                id="notes" placeholder="Payment terms, bank details..."
                {...register("notes")} className="h-20 text-sm"
              />
            </div>
            <div className="space-y-2">
              <div className="space-y-1.5">
                <Label htmlFor="tax_rate">Tax Rate (%)</Label>
                <Input id="tax_rate" type="number" min={0} max={100} step={0.5} placeholder="0" {...register("tax_rate")} className="h-9" />
              </div>
              <div className="rounded-lg bg-gray-50 p-3 space-y-1.5 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                {taxRate > 0 && (
                  <div className="flex justify-between text-gray-600">
                    <span>Tax ({taxRate}%)</span>
                    <span>{formatCurrency(taxAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-gray-900 border-t border-gray-200 pt-1.5">
                  <span>Total</span>
                  <span className="text-violet-700">{formatCurrency(total)}</span>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={() => { reset(); onOpenChange(false); }}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <><Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />Creating...</>
              ) : "Create Invoice"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
