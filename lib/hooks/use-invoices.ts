"use client";

import { useState, useCallback } from "react";
import { generateInvoiceNumber } from "@/lib/utils";

export type InvoiceItem = {
  id: string;
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
};

export type Invoice = {
  id: string;
  invoice_number: string;
  client: string;
  client_email?: string;
  amount: number;
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  total: number;
  status: "draft" | "sent" | "viewed" | "paid" | "overdue" | "cancelled";
  issue_date: string;
  due_date: string;
  items: InvoiceItem[];
  notes?: string;
  currency: string;
};

export type InvoiceFormData = {
  client: string;
  client_email?: string;
  issue_date: string;
  due_date: string;
  currency: string;
  tax_rate: number;
  notes?: string;
  items: Array<{ description: string; quantity: number; unit_price: number }>;
};

export function useInvoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const createInvoice = useCallback(async (data: InvoiceFormData): Promise<Invoice> => {
    setIsLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 500));
      const items = data.items.map((item, i) => ({
        id: String(i + 1),
        ...item,
        total: item.quantity * item.unit_price,
      }));
      const subtotal = items.reduce((sum, item) => sum + item.total, 0);
      const tax_amount = (subtotal * data.tax_rate) / 100;
      const total = subtotal + tax_amount;

      const newInvoice: Invoice = {
        id: crypto.randomUUID(),
        invoice_number: generateInvoiceNumber(),
        client: data.client,
        client_email: data.client_email,
        amount: subtotal,
        subtotal,
        tax_rate: data.tax_rate,
        tax_amount,
        total,
        status: "draft",
        issue_date: data.issue_date,
        due_date: data.due_date,
        items,
        notes: data.notes,
        currency: data.currency,
      };
      setInvoices((prev) => [newInvoice, ...prev]);
      return newInvoice;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateStatus = useCallback(async (id: string, status: Invoice["status"]): Promise<void> => {
    setInvoices((prev) =>
      prev.map((inv) => inv.id === id ? { ...inv, status } : inv)
    );
  }, []);

  const deleteInvoice = useCallback(async (id: string): Promise<void> => {
    setInvoices((prev) => prev.filter((inv) => inv.id !== id));
  }, []);

  return { invoices, isLoading, createInvoice, updateStatus, deleteInvoice };
}
