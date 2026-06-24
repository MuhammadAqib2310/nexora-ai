"use client";

import { useState, useCallback } from "react";

export type Deal = {
  id: string;
  title: string;
  contact: string;
  company: string;
  value: number;
  currency: string;
  probability: number;
  close_date: string;
  stage: string;
  status: "open" | "won" | "lost";
  created_at: string;
};

export type DealFormData = {
  title: string;
  contact: string;
  company: string;
  value: number;
  currency: string;
  probability: number;
  close_date: string;
  stage: string;
};

export function useDeals() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addDeal = useCallback(async (data: DealFormData): Promise<Deal> => {
    setIsLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 400));
      const newDeal: Deal = {
        ...data,
        id: crypto.randomUUID(),
        status: "open",
        created_at: new Date().toISOString(),
      };
      setDeals((prev) => [newDeal, ...prev]);
      return newDeal;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const moveDeal = useCallback(async (id: string, newStage: string): Promise<void> => {
    setDeals((prev) =>
      prev.map((d) => d.id === id ? { ...d, stage: newStage } : d)
    );
  }, []);

  const updateDeal = useCallback(async (id: string, data: Partial<Deal>): Promise<void> => {
    setDeals((prev) => prev.map((d) => d.id === id ? { ...d, ...data } : d));
  }, []);

  const deleteDeal = useCallback(async (id: string): Promise<void> => {
    setDeals((prev) => prev.filter((d) => d.id !== id));
  }, []);

  return { deals, isLoading, addDeal, moveDeal, updateDeal, deleteDeal };
}
