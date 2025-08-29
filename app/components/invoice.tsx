/* eslint-disable @typescript-eslint/no-explicit-any */
import { useInvoiceStore } from "@/stores/invoiceStore";
import React from "react";

export default function Invoice() {
  const invoices = useInvoiceStore((state: any) => state.invoices);
  const lastInvoice = invoices[invoices.length - 1];

  const {
    items,
    subtotal,
    taxAmount,
    grandTotal,
    discountAmount,
    shippingCharges,
    taxRate,
    paymentMethods,
  } = lastInvoice;

  const downloadPDF = () => {
    const printContent = document.getElementById("invoice-preview");
    const originalContent = document.body.innerHTML;

    if (printContent) {
      document.body.innerHTML = printContent.innerHTML;
      window.print();
      document.body.innerHTML = originalContent;
      window.location.reload();
    }
  };
  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto p-8">
        <div className="flex justify-between items-center mb-8 no-print">
          <Button
            onClick={() => setShowPreview(false)}
            variant="outline"
            className="cursor-pointer"
          >
            ← Back to Edit
          </Button>
          <Button
            onClick={downloadPDF}
            className="bg-[#315052] hover:bg-[#315052] text-white cursor-pointer"
          >
            Download PDF
          </Button>
        </div>

        <div
          id="invoice-preview"
          className="bg-white p-8 border border-gray-300"
        >
          {/* Invoice Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">INVOICE</h1>
            <div className="text-lg text-gray-600">
              <div>Invoice #{lastInvoice.invoiceId}</div>
              <div>Date: {lastInvoice.invoiceDate}</div>
            </div>
          </div>

          {/* Company and Client Details */}
          <div className="grid grid-cols-2 gap-12 mb-12">
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4 border-b-2 border-black pb-2">
                From (Company Details)
              </h2>
              <div className="space-y-2 text-gray-700">
                <div>
                  <span className="font-semibold">Name:</span>{" "}
                  {lastInvoice.companyName}
                </div>
                <div>
                  <span className="font-semibold">Address:</span>{" "}
                  {lastInvoice.companyAddress}
                </div>
                {lastInvoice.companyPhone && (
                  <div>
                    <span className="font-semibold">Phone:</span>{" "}
                    {lastInvoice.companyPhone}
                  </div>
                )}
                {lastInvoice.companyTaxId && (
                  <div>
                    <span className="font-semibold">Tax ID:</span>{" "}
                    {lastInvoice.companyTaxId}
                  </div>
                )}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4 border-b-2 border-black pb-2">
                To (Client Details)
              </h2>
              <div className="space-y-2 text-gray-700">
                <div>
                  <span className="font-semibold">Name:</span>{" "}
                  {lastInvoice.clientName}
                </div>
                <div>
                  <span className="font-semibold">Address:</span>{" "}
                  {lastInvoice.clientAddress}
                </div>
                {lastInvoice.clientPhone && (
                  <div>
                    <span className="font-semibold">Phone:</span>{" "}
                    {lastInvoice.clientPhone}
                  </div>
                )}
                {lastInvoice.clientTaxId && (
                  <div>
                    <span className="font-semibold">Tax ID:</span>{" "}
                    {lastInvoice.clientTaxId}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-8">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold">
                    Description
                  </th>
                  <th className="border border-gray-300 px-4 py-3 text-center font-semibold">
                    Quantity
                  </th>
                  <th className="border border-gray-300 px-4 py-3 text-right font-semibold">
                    Unit Price
                  </th>
                  <th className="border border-gray-300 px-4 py-3 text-right font-semibold">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.map((item: any, index: number) => (
                  <tr key={index}>
                    <td className="border border-gray-300 px-4 py-3">
                      {item.description}
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-center">
                      {item.quantity}
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-right">
                      ${item.unitPrice.toFixed(2)}
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-right">
                      ${(item.quantity * item.unitPrice).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-end mb-8">
              <div className="w-80 space-y-2">
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="font-medium">Subtotal:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>

                {taxRate > 0 && (
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="font-medium">Tax ({taxRate}%):</span>
                    <span>${taxAmount.toFixed(2)}</span>
                  </div>
                )}

                {discountAmount > 0 && (
                  <div className="flex justify-between py-2 border-b border-gray-200 text-green-600">
                    <span className="font-medium">Discount:</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}

                {shippingCharges > 0 && (
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="font-medium">Shipping/Extra Charges:</span>
                    <span>${shippingCharges.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between py-4 border-t-2 border-black font-bold text-lg">
                  <span>Grand Total:</span>
                  <span>${grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="border-t-2 border-gray-300 pt-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Payment Information
              </h2>
              <div className="space-y-2 text-gray-700">
                <div>
                  <span className="font-semibold">Payment Methods:</span>{" "}
                  {paymentMethods}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          .no-print {
            display: none !important;
          }
          body {
            margin: 0;
          }
          #invoice-preview {
            border: none;
            box-shadow: none;
          }
        }
      `}</style>
    </div>
  );
}
