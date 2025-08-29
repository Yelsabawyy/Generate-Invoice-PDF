// store/invoiceStore.ts
import { InvoiceFormType } from "@/app/components/form.createInvoice";
import { create } from "zustand";

interface InvoiceStore {
  invoices: InvoiceFormType;
  addInvoice: (invoice: InvoiceFormType) => void;
}

export const useInvoiceStore = create<InvoiceStore>((set) => ({
  invoices: {
    companyPhone: "",
    companyTaxId: "",
    clientName: "",
    clientAddress: "",
    clientPhone: "",
    clientTaxId: "",
    taxRate: 0,
    discountAmount: 0,
    shippingCharges: 0,
    paymentMethods: "",
    companyAddress: "",
    companyName: "",
    invoiceDate: "",
    invoiceId: "",
    items: [{ description: "", quantity: 1, unitPrice: 0 }],
  },
  addInvoice: (invoice) => set((state) => ({ invoices: invoice })),
}));
