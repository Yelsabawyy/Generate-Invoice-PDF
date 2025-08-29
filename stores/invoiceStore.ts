// store/invoiceStore.ts
import { InvoiceFormType } from "@/app/components/form.createInvoice";
import { create } from "zustand";

interface InvoiceStore {
  invoices: InvoiceFormType[];
  addInvoice: (invoice: InvoiceFormType) => void;
}

export const useInvoiceStore = create<InvoiceStore>((set) => ({
  invoices: [],
  addInvoice: (invoice) =>
    set((state) => ({ invoices: [...state.invoices, invoice] })),
}));
