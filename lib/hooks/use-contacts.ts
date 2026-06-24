"use client";

import { useState, useCallback } from "react";

export type ContactFormData = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  company: string;
  job_title: string;
  source: string;
  tags: string[];
};

export type Contact = ContactFormData & {
  id: string;
  ai_score: number;
  created_at: string;
  updated_at: string;
};

export function useContacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addContact = useCallback(async (data: ContactFormData): Promise<Contact> => {
    setIsLoading(true);
    setError(null);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const newContact: Contact = {
        ...data,
        id: crypto.randomUUID(),
        ai_score: Math.floor(Math.random() * 40) + 50,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setContacts((prev) => [newContact, ...prev]);
      return newContact;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to create contact";
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateContact = useCallback(async (id: string, data: Partial<ContactFormData>): Promise<void> => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      setContacts((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, ...data, updated_at: new Date().toISOString() } : c
        )
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteContact = useCallback(async (id: string): Promise<void> => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 200));
      setContacts((prev) => prev.filter((c) => c.id !== id));
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { contacts, isLoading, error, addContact, updateContact, deleteContact };
}
