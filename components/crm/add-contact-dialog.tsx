"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import type { ContactFormData } from "@/lib/hooks/use-contacts";

interface AddContactDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ContactFormData) => Promise<unknown>;
}

export function AddContactDialog({ open, onOpenChange, onSubmit }: AddContactDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, reset, setValue, formState: { errors } } =
    useForm<ContactFormData>({
      defaultValues: {
        first_name: "", last_name: "", email: "", phone: "",
        company: "", job_title: "", source: "manual", tags: [],
      },
    });

  const handleFormSubmit = async (data: ContactFormData) => {
    if (!data.first_name.trim()) return;
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      toast.success(`Contact ${data.first_name} ${data.last_name} added`);
      reset();
      onOpenChange(false);
    } catch {
      toast.error("Failed to add contact. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Add New Contact</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4" noValidate>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="first_name">First Name <span className="text-red-500">*</span></Label>
              <Input id="first_name" placeholder="Sarah" {...register("first_name", { required: true })}
                className={errors.first_name ? "border-red-400" : ""} />
              {errors.first_name && <p className="text-xs text-red-500">First name is required</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="last_name">Last Name <span className="text-red-500">*</span></Label>
              <Input id="last_name" placeholder="Johnson" {...register("last_name", { required: true })}
                className={errors.last_name ? "border-red-400" : ""} />
              {errors.last_name && <p className="text-xs text-red-500">Last name is required</p>}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" type="email" placeholder="sarah@company.com" {...register("email")} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" placeholder="+1-555-0100" {...register("phone")} />
            </div>
            <div className="space-y-1.5">
              <Label>Lead Source</Label>
              <Select defaultValue="manual" onValueChange={(v) => setValue("source", v)}>
                <SelectTrigger aria-label="Lead source">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manual">Manual</SelectItem>
                  <SelectItem value="web_form">Web Form</SelectItem>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                  <SelectItem value="facebook">Facebook</SelectItem>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  <SelectItem value="api">API</SelectItem>
                  <SelectItem value="import">Import</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="company">Company</Label>
              <Input id="company" placeholder="Acme Corp" {...register("company")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="job_title">Job Title</Label>
              <Input id="job_title" placeholder="CEO" {...register("job_title")} />
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={() => { reset(); onOpenChange(false); }}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <><Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />Saving...</> : "Add Contact"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
