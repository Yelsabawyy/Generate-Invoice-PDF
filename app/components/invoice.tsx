/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { useInvoiceStore } from "@/stores/invoiceStore";
import React from "react";

export default function Invoice({
  showPreview,
  setShowPreview,
}: {
  showPreview: boolean;
  setShowPreview: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const invoices = useInvoiceStore((state: any) => state.invoices);
  const lastInvoice = invoices;

  const {
    items,
    subtotal,
    taxAmount,
    grandTotal,
    discountAmount,
    shippingCharges,
    taxRate,
    paymentMethods,
  } = invoices;

  const downloadPDF = () => {
    window.print();
  };

  return (
    <>
      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          /* Hide everything first */
          body * {
            visibility: hidden;
          }
          
          /* Show only the invoice preview and its children */
          #invoice-preview,
          #invoice-preview * {
            visibility: visible;
          }
          
          /* Position the invoice at the top of the page */
          #invoice-preview {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            border: none !important;
          }
          
          /* Hide elements you don't want to print */
          .no-print {
            display: none !important;
          }
          
          /* Make sure table fits properly */
          #invoice-preview table {
            page-break-inside: avoid;
          }
          
          /* Ensure colors print properly */
          #invoice-preview * {
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
        }
      `}</style>

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

          <div id="invoice-preview" className="bg-white border border-gray-300">
            {/* Invoice Header */}
            <div className="grid grid-cols-2 bg-[#315052] text-md md:text-lg">
              <div className="text-left ">
                <div className="  text-white p-5">
                  <div>Invoice #{lastInvoice.invoiceId}</div>
                  <div>Date: {lastInvoice.invoiceDate}</div>
                </div>
              </div>
              <div>
                <div className="  text-white p-5">
                  <div>
                    <div >Payment Methods:</div>{" "}
                    {paymentMethods}
                  </div>
                </div>
              </div>
            </div>

            {/* Company and Client Details */}
            <div className="grid grid-cols-2 gap-12  p-5">
              <div>
                <h2 className="text-lg font-bold text-gray-800 mb-2 border-black pb-2">
                  From
                </h2>
                <div className="space-y-2 text-gray-800 text-sm">
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
                <h2 className="text-lg font-bold text-gray-800 mb-2 border-black pb-2">
                  To
                </h2>
                <div className="space-y-2 text-gray-800 text-sm">
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
            <div className="p-5 mb-5">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-[#315052]">
                    <th className="border border-gray-300 px-4 py-3 text-white text-left font-semibold">
                      Description
                    </th>
                    <th className="border border-gray-300 px-4 py-3 text-white text-center font-semibold">
                      Quantity
                    </th>
                    <th className="border border-gray-300 px-4 py-3  text-white text-center font-semibold">
                      Unit Price
                    </th>
                    <th className="border border-gray-300 px-4 py-3 text-white text-center font-semibold">
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
                      <td className="border border-gray-300 px-4 py-3 text-center">
                        ${item.unitPrice.toFixed(2)}
                      </td>
                      <td className="border border-gray-300 px-4 py-3 text-center">
                        ${(item.quantity * item.unitPrice).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex justify-end  text-sm mt-5">
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

                  <div className="flex justify-between py-4 font-bold text-lg">
                    <span>Total:</span>
                    <span>${grandTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}