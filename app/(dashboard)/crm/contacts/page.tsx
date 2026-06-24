"use client";

import { useState } from "react";
import { ContactsTable } from "@/components/crm/contacts-table";
import { AddContactDialog } from "@/components/crm/add-contact-dialog";
import { useContacts } from "@/lib/hooks/use-contacts";
import { Button } from "@/components/ui/button";
import { UserPlus, Upload, Download } from "lucide-react";
import { toast } from "sonner";

export default function ContactsPage() {
  const [addOpen, setAddOpen] = useState(false);
  const { addContact } = useContacts();

  const handleExport = () => {
    toast.info("Export feature coming soon — will download as CSV");
  };

  const handleImport = () => {
    toast.info("Import feature coming soon — will accept CSV/Excel");
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contacts</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage your leads and contacts
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5" onClick={handleImport}>
            <Upload className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Import</span>
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5" onClick={handleExport}>
            <Download className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Export</span>
          </Button>
          <Button size="sm" className="gap-1.5" onClick={() => setAddOpen(true)}>
            <UserPlus className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Add Contact</span>
          </Button>
        </div>
      </div>

      <ContactsTable onAddClick={() => setAddOpen(true)} />

      <AddContactDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        onSubmit={addContact}
      />
    </div>
  );
}
