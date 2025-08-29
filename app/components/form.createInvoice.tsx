import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useInvoiceStore } from "@/stores/invoiceStore";

const invoiceSchema = z.object({
  invoiceId: z.string().min(1, "Invoice id is required"),
  invoiceDate: z.string().min(1, "Invoice Date is required"),
  companyName: z.string().min(1, "Company name is required"),
  companyAddress: z.string().min(1, "Company Address is required"),
  companyPhone: z.string().min(1, "Company phone is required"),
  companyTaxId: z.string().min(1, "Company Tax Id is required"),
  clientName: z.string().min(1, "Client name is required"),
  clientAddress: z.string().min(1, "Client address is required"),
  clientPhone: z.string().min(1, "Client phone is required"),
  clientTaxId: z.string().min(1, "Client Tax Id is required"),
  taxRate: z.number().min(0, "Tax Rate is required"),
  discountAmount: z.number().min(0, "Discount Amount is required"),
  shippingCharges: z.number().min(0, "Shipping Charges is required"),
  paymentMethods: z.string().min(1, "Payment Method is required"),
  items: z
    .array(
      z.object({
        description: z.string().min(1, "Description is required"),
        quantity: z.number().min(1, "Quantity must be at least 1"),
        unitPrice: z.number().min(0, "Unit Price must be >= 0"),
      })
    )
    .min(1, "At least one item is required"),
});

export type InvoiceFormType = z.infer<typeof invoiceSchema>;

export default function CreateInvoiceForm({
  generatePDF,
}: {
  generatePDF: () => void;
}) {
  const {invoices :InvoiceData} = useInvoiceStore();

const {
  register,
  control,
  handleSubmit,
  formState: { errors },
  watch,
} = useForm<InvoiceFormType>({
  resolver: zodResolver(invoiceSchema),
  defaultValues: InvoiceData && InvoiceData.length > 0
    ? InvoiceData[InvoiceData.length - 1] // last saved invoice
    : {
        invoiceId: "",
        invoiceDate: "",
        companyName: "",
        companyAddress: "",
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
        items: [{ description: "", quantity: 1, unitPrice: 0 }],
      },
});


  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const addInvoice = useInvoiceStore((state) => state.addInvoice);

  const onSubmit = (data: InvoiceFormType) => {
    console.log(data);
    const subtotal = data.items.reduce(
      (acc, item) => acc + item.quantity * item.unitPrice,
      0
    );
    const taxAmount = subtotal * (data.taxRate / 100);
    const grandTotal =
      subtotal + taxAmount - data.discountAmount + data.shippingCharges;

    const invoiceWithTotals = {
      ...data,
      subtotal,
      taxAmount,
      grandTotal,
    };

    // Add to Zustand
    addInvoice(invoiceWithTotals);
    generatePDF();
  };

  const items = watch("items");
  const subtotal = items.reduce(
    (acc, item) => acc + item.quantity * item.unitPrice,
    0
  );
  const taxAmount = subtotal * (watch("taxRate") / 100);
  const grandTotal =
    subtotal + taxAmount - watch("discountAmount") + watch("shippingCharges");

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="min-h-screen bg-gray-50 p-6"
    >
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Create Your Invoice</h1>
          <p className="text-gray-600 text-sm">Generate Invoice</p>
        </div>

        {/* Invoice Info */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium">Invoice ID</label>
            <Input {...register("invoiceId")} />
            {errors.invoiceId && (
              <p className="text-red-500 text-sm">{errors.invoiceId.message}</p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium">Invoice Date</label>
            <Input type="date" {...register("invoiceDate")} />
            {errors.invoiceDate && (
              <p className="text-red-500 text-sm">
                {errors.invoiceDate.message}
              </p>
            )}
          </div>
        </div>

        <hr className="border-gray-300" />

        {/* Company & Client */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Company/Seller Details</h2>
            <div>
              <label className="text-sm font-medium">Company Name</label>
              <Input {...register("companyName")} />
              {errors.companyName && (
                <p className="text-red-500 text-sm">
                  {errors.companyName.message}
                </p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium">Address</label>
              <Input {...register("companyAddress")} />
            </div>
            <div>
              <label className="text-sm font-medium">Phone</label>
              <Input {...register("companyPhone")} />
            </div>
            <div>
              <label className="text-sm font-medium">Tax ID</label>
              <Input {...register("companyTaxId")} />
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold">Client Details</h2>
            <div>
              <label className="text-sm font-medium">Client Name</label>
              <Input {...register("clientName")} />
              {errors.clientName && (
                <p className="text-red-500 text-sm">
                  {errors.clientName.message}
                </p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium">Address</label>
              <Input {...register("clientAddress")} />
            </div>
            <div>
              <label className="text-sm font-medium">Phone</label>
              <Input {...register("clientPhone")} />
            </div>
            <div>
              <label className="text-sm font-medium">Tax ID</label>
              <Input {...register("clientTaxId")} />
            </div>
          </div>
        </div>

        <hr className="border-gray-300" />

        {/* Items */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Products / Services</h2>
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="bg-white p-4 rounded border grid md:grid-cols-4 gap-4 items-end"
            >
              <div>
                <label className="text-sm font-medium">Description</label>
                <Input {...register(`items.${index}.description` as const)} />
                {errors.items?.[index]?.description && (
                  <p className="text-red-500 text-xs">
                    {errors.items[index].description?.message}
                  </p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium">Quantity</label>
                <Input
                  type="number"
                  {...register(`items.${index}.quantity` as const, {
                    valueAsNumber: true,
                  })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Unit Price</label>
                <Input
                  type="number"
                  step="0.01"
                  {...register(`items.${index}.unitPrice` as const, {
                    valueAsNumber: true,
                  })}
                />
              </div>
              <div>
                <span className="block mb-2">
                  Subtotal: $
                  {(items[index].quantity * items[index].unitPrice).toFixed(2)}
                </span>
                {fields.length > 1 && (
                  <Button
                    className="cursor-pointer"
                    type="button"
                    variant="destructive"
                    onClick={() => remove(index)}
                  >
                    Remove
                  </Button>
                )}
              </div>
            </div>
          ))}
          <Button
            className="cursor-pointer"
            type="button"
            onClick={() =>
              append({ description: "", quantity: 1, unitPrice: 0 })
            }
          >
            + Add Another Item
          </Button>
        </div>

        <hr className="border-gray-300" />

        {/* Totals */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Totals</h2>
          <div className="bg-white p-4 rounded border grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <label className="text-sm font-medium">Tax Rate (%)</label>
              <Input
                type="number"
                step="0.01"
                {...register("taxRate", { valueAsNumber: true })}
              />
              <label className="text-sm font-medium">Discount ($)</label>
              <Input
                type="number"
                step="0.01"
                {...register("discountAmount", { valueAsNumber: true })}
              />
              <label className="text-sm font-medium">
                Shipping/Extra Charges ($)
              </label>
              <Input
                type="number"
                step="0.01"
                {...register("shippingCharges", { valueAsNumber: true })}
              />
            </div>
            <div className="space-y-2 text-right">
              <p>Subtotal: ${subtotal.toFixed(2)}</p>
              <p>Taxes: ${taxAmount.toFixed(2)}</p>
              <p>Grand Total: ${grandTotal.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Payment */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Payment Methods</label>
          <Input {...register("paymentMethods")} />
        </div>

        <div className="flex justify-center">
          <Button
            type="submit"
            className="bg-black cursor-pointer text-white px-8 py-3 rounded-md hover:bg-gray-800"
          >
            Generate Invoice →
          </Button>
        </div>
      </div>
    </form>
  );
}
