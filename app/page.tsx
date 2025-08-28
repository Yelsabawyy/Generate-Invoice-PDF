"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function Page() {
  const [invoiceData, setInvoiceData] = useState({
    invoiceId: "",
    invoiceDate: "",
    companyName: "",
    companyAddress: "",
    companyPhone: "",
    companyTaxId: "",
    clientName: "",
    clientAddress: "",
    clientPhone: "",
    clientTaxId: ""
  });

  const [items, setItems] = useState([
    { description: "", quantity: 1, unitPrice: 0 },
  ]);

  const [totals, setTotals] = useState({
    taxRate: 0,
    discountAmount: 0,
    shippingCharges: 0
  });

  const [paymentInfo, setPaymentInfo] = useState({
    paymentMethods: "",
    bankDetails: "",
    paymentTerms: ""
  });

  const [errors, setErrors] = useState({});
  const [showPreview, setShowPreview] = useState(false);

  type ItemField = "description" | "quantity" | "unitPrice";
  
  const handleInvoiceDataChange = (field: keyof typeof invoiceData, value: string) => {
    setInvoiceData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when field is filled
    if (value.trim() !== "") {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleChange = (index: number, field: ItemField, value: string) => {
    const updatedItems = [...items];
    if (field === "quantity" || field === "unitPrice") {
      updatedItems[index][field] = Number(value) || 0;
    } else {
      updatedItems[index][field] = value;
    }
    setItems(updatedItems);
    
    // Clear item errors
    if (field === "description" && value.trim() !== "") {
      setErrors(prev => ({ ...prev, [`item_${index}_description`]: "" }));
    }
  };

  const addItem = () => {
    setItems([...items, { description: "", quantity: 1, unitPrice: 0 }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      const updatedItems = items.filter((_, i) => i !== index);
      setItems(updatedItems);
    }
  };

  const handleTotalsChange = (field: keyof typeof totals, value: string) => {
    setTotals(prev => ({
      ...prev,
      [field]: Number(value) || 0
    }));
  };

  const handlePaymentChange = (field: keyof typeof paymentInfo, value: string) => {
    setPaymentInfo(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when field is filled
    if (value.trim() !== "") {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  // Calculate totals
  const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  const taxAmount = (subtotal * totals.taxRate) / 100;
  const grandTotal = subtotal + taxAmount - totals.discountAmount + totals.shippingCharges;

  // Validation function
  const validateForm = () => {
    const newErrors = {};

    // Required invoice data
    if (!invoiceData.invoiceId.trim()) newErrors.invoiceId = "Invoice ID is required";
    if (!invoiceData.invoiceDate.trim()) newErrors.invoiceDate = "Invoice Date is required";
    if (!invoiceData.companyName.trim()) newErrors.companyName = "Company Name is required";
    if (!invoiceData.companyAddress.trim()) newErrors.companyAddress = "Company Address is required";
    if (!invoiceData.clientName.trim()) newErrors.clientName = "Client Name is required";
    if (!invoiceData.clientAddress.trim()) newErrors.clientAddress = "Client Address is required";

    // Required payment info
    if (!paymentInfo.paymentMethods.trim()) newErrors.paymentMethods = "Payment Methods are required";
    if (!paymentInfo.paymentTerms.trim()) newErrors.paymentTerms = "Payment Terms are required";

    // Required item descriptions
    items.forEach((item, index) => {
      if (!item.description.trim()) {
        newErrors[`item_${index}_description`] = "Item description is required";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // PDF Generation function
  const generatePDF = () => {
    if (!validateForm()) {
      alert("Please fill in all required fields before generating the invoice.");
      return;
    }

    // Show preview first
    setShowPreview(true);
  };

  const downloadPDF = () => {
    const printContent = document.getElementById('invoice-preview');
    const originalContent = document.body.innerHTML;
    
    document.body.innerHTML = printContent.innerHTML;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload();
  };

  if (showPreview) {
    return (
      <div className="min-h-screen bg-white">
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
              className="bg-green-600 hover:bg-green-700 text-white cursor-pointer"
            >
              Download PDF
            </Button>
          </div>

          <div id="invoice-preview" className="bg-white p-8 border border-gray-300">
            {/* Invoice Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-800 mb-4">INVOICE</h1>
              <div className="text-lg text-gray-600">
                <div>Invoice #{invoiceData.invoiceId}</div>
                <div>Date: {invoiceData.invoiceDate}</div>
              </div>
            </div>

            {/* Company and Client Details */}
            <div className="grid grid-cols-2 gap-12 mb-12">
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-4 border-b-2 border-black pb-2">
                  From (Company Details)
                </h2>
                <div className="space-y-2 text-gray-700">
                  <div><span className="font-semibold">Name:</span> {invoiceData.companyName}</div>
                  <div><span className="font-semibold">Address:</span> {invoiceData.companyAddress}</div>
                  {invoiceData.companyPhone && <div><span className="font-semibold">Phone:</span> {invoiceData.companyPhone}</div>}
                  {invoiceData.companyTaxId && <div><span className="font-semibold">Tax ID:</span> {invoiceData.companyTaxId}</div>}
                </div>
              </div>
              
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-4 border-b-2 border-black pb-2">
                  To (Client Details)
                </h2>
                <div className="space-y-2 text-gray-700">
                  <div><span className="font-semibold">Name:</span> {invoiceData.clientName}</div>
                  <div><span className="font-semibold">Address:</span> {invoiceData.clientAddress}</div>
                  {invoiceData.clientPhone && <div><span className="font-semibold">Phone:</span> {invoiceData.clientPhone}</div>}
                  {invoiceData.clientTaxId && <div><span className="font-semibold">Tax ID:</span> {invoiceData.clientTaxId}</div>}
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div className="mb-8">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Description</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Quantity</th>
                    <th className="border border-gray-300 px-4 py-3 text-right font-semibold">Unit Price</th>
                    <th className="border border-gray-300 px-4 py-3 text-right font-semibold">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <tr key={index}>
                      <td className="border border-gray-300 px-4 py-3">{item.description}</td>
                      <td className="border border-gray-300 px-4 py-3 text-center">{item.quantity}</td>
                      <td className="border border-gray-300 px-4 py-3 text-right">${item.unitPrice.toFixed(2)}</td>
                      <td className="border border-gray-300 px-4 py-3 text-right">${(item.quantity * item.unitPrice).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="flex justify-end mb-8">
              <div className="w-80">
                <div className="space-y-2">
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="font-medium">Subtotal:</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  
                  {totals.taxRate > 0 && (
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="font-medium">Tax ({totals.taxRate}%):</span>
                      <span>${taxAmount.toFixed(2)}</span>
                    </div>
                  )}
                  
                  {totals.discountAmount > 0 && (
                    <div className="flex justify-between py-2 border-b border-gray-200 text-green-600">
                      <span className="font-medium">Discount:</span>
                      <span>-${totals.discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  
                  {totals.shippingCharges > 0 && (
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="font-medium">Shipping/Extra Charges:</span>
                      <span>${totals.shippingCharges.toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between py-4 border-t-2 border-black font-bold text-lg">
                    <span>Grand Total:</span>
                    <span>${grandTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="border-t-2 border-gray-300 pt-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Payment Information</h2>
              <div className="space-y-4 text-gray-700">
                <div>
                  <span className="font-semibold">Payment Methods:</span> {paymentInfo.paymentMethods}
                </div>
                
                {paymentInfo.bankDetails && (
                  <div>
                    <span className="font-semibold">Bank Details:</span>
                    <div className="bg-gray-50 p-4 rounded mt-2 whitespace-pre-line text-sm">
                      {paymentInfo.bankDetails}
                    </div>
                  </div>
                )}
                
                <div>
                  <span className="font-semibold">Payment Terms:</span> {paymentInfo.paymentTerms}
                </div>
              </div>
            </div>
          </div>
        </div>

        <style jsx global>{`
          @media print {
            .no-print { display: none !important; }
            body { margin: 0; }
            #invoice-preview { border: none; box-shadow: none; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="w-full max-w-6xl mx-auto p-6 mt-8">
        <div className="text-sm text-gray-600 mb-2">Generate Invoice</div>
        <h1 className="text-3xl font-bold mb-8">Create Your Invoice</h1>

        <div className="space-y-8">
          {/* Invoice Basic Info */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Invoice ID <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="INV-001"
                className={`border rounded-md max-w-sm ${errors.invoiceId ? 'border-red-500' : ''}`}
                value={invoiceData.invoiceId}
                onChange={(e) => handleInvoiceDataChange("invoiceId", e.target.value)}
              />
              {errors.invoiceId && <p className="text-red-500 text-xs">{errors.invoiceId}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Invoice Date <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="Invoice Date"
                className={`border rounded-md max-w-sm ${errors.invoiceDate ? 'border-red-500' : ''}`}
                type="date"
                value={invoiceData.invoiceDate}
                onChange={(e) => handleInvoiceDataChange("invoiceDate", e.target.value)}
              />
              {errors.invoiceDate && <p className="text-red-500 text-xs">{errors.invoiceDate}</p>}
            </div>
          </div>

          <hr className="border-gray-300" />

          {/* Company and Client Details */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h2 className="text-xl font-bold">Company/Seller Details</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Company Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    placeholder="Company Name"
                    className={`border rounded-md ${errors.companyName ? 'border-red-500' : ''}`}
                    value={invoiceData.companyName}
                    onChange={(e) => handleInvoiceDataChange("companyName", e.target.value)}
                  />
                  {errors.companyName && <p className="text-red-500 text-xs">{errors.companyName}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Address <span className="text-red-500">*</span>
                  </label>
                  <Input
                    placeholder="Full Address"
                    className={`border rounded-md ${errors.companyAddress ? 'border-red-500' : ''}`}
                    value={invoiceData.companyAddress}
                    onChange={(e) => handleInvoiceDataChange("companyAddress", e.target.value)}
                  />
                  {errors.companyAddress && <p className="text-red-500 text-xs">{errors.companyAddress}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone Number</label>
                  <Input
                    placeholder="+1 (555) 123-4567"
                    className="border rounded-md"
                    value={invoiceData.companyPhone}
                    onChange={(e) => handleInvoiceDataChange("companyPhone", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tax ID / VAT Number</label>
                  <Input
                    placeholder="Tax ID / VAT Number"
                    className="border rounded-md"
                    value={invoiceData.companyTaxId}
                    onChange={(e) => handleInvoiceDataChange("companyTaxId", e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-xl font-bold">Client Details</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Client Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    placeholder="Client Name"
                    className={`border rounded-md ${errors.clientName ? 'border-red-500' : ''}`}
                    value={invoiceData.clientName}
                    onChange={(e) => handleInvoiceDataChange("clientName", e.target.value)}
                  />
                  {errors.clientName && <p className="text-red-500 text-xs">{errors.clientName}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Address <span className="text-red-500">*</span>
                  </label>
                  <Input
                    placeholder="Client Address"
                    className={`border rounded-md ${errors.clientAddress ? 'border-red-500' : ''}`}
                    value={invoiceData.clientAddress}
                    onChange={(e) => handleInvoiceDataChange("clientAddress", e.target.value)}
                  />
                  {errors.clientAddress && <p className="text-red-500 text-xs">{errors.clientAddress}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone Number</label>
                  <Input
                    placeholder="+1 (555) 987-6543"
                    className="border rounded-md"
                    value={invoiceData.clientPhone}
                    onChange={(e) => handleInvoiceDataChange("clientPhone", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tax ID / VAT Number</label>
                  <Input
                    placeholder="Client Tax ID"
                    className="border rounded-md"
                    value={invoiceData.clientTaxId}
                    onChange={(e) => handleInvoiceDataChange("clientTaxId", e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          <hr className="border-gray-300" />

          {/* Product/Service Details */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold">Product / Service Details</h2>
            
            {items.map((item, index) => (
              <div key={index} className="bg-white p-6 rounded-lg border border-gray-200 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">Item #{index + 1}</h3>
                  {items.length > 1 && (
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => removeItem(index)}
                      size="sm"
                      className="bg-red-600 hover:bg-red-700 cursor-pointer"
                    >
                      Remove
                    </Button>
                  )}
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <Input
                      placeholder="Product/Service description"
                      className={`border rounded-md ${errors[`item_${index}_description`] ? 'border-red-500' : ''}`}
                      value={item.description}
                      onChange={(e) => handleChange(index, "description", e.target.value)}
                    />
                    {errors[`item_${index}_description`] && (
                      <p className="text-red-500 text-xs">{errors[`item_${index}_description`]}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Quantity</label>
                    <Input
                      placeholder="1"
                      className="border rounded-md"
                      type="number"
                      min="1"
                      value={item.quantity || ""}
                      onChange={(e) => handleChange(index, "quantity", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Unit Price ($)</label>
                    <Input
                      placeholder="0.00"
                      className="border rounded-md"
                      type="number"
                      step="0.01"
                      min="0"
                      value={item.unitPrice || ""}
                      onChange={(e) => handleChange(index, "unitPrice", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Subtotal ($)</label>
                    <Input
                      className="border rounded-md bg-gray-50"
                      value={(item.quantity * item.unitPrice).toFixed(2)}
                      disabled
                    />
                  </div>
                </div>
              </div>
            ))}

            <Button 
              type="button" 
              onClick={addItem} 
              variant="outline" 
              className="border-dashed border-2 h-12 w-full cursor-pointer"
            >
              + Add Another Item
            </Button>
          </div>

          <hr className="border-gray-300" />

          {/* Totals Section */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold">Totals</h2>
            
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Tax Rate (%)</label>
                    <Input
                      placeholder="0"
                      className="border rounded-md"
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      value={totals.taxRate || ""}
                      onChange={(e) => handleTotalsChange("taxRate", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Discount Amount ($)</label>
                    <Input
                      placeholder="0.00"
                      className="border rounded-md"
                      type="number"
                      step="0.01"
                      min="0"
                      value={totals.discountAmount || ""}
                      onChange={(e) => handleTotalsChange("discountAmount", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Shipping/Extra Charges ($)</label>
                    <Input
                      placeholder="0.00"
                      className="border rounded-md"
                      type="number"
                      step="0.01"
                      min="0"
                      value={totals.shippingCharges || ""}
                      onChange={(e) => handleTotalsChange("shippingCharges", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium">Subtotal (before taxes/discounts):</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between py-2">
                    <span className="font-medium">Taxes ({totals.taxRate}%):</span>
                    <span>${taxAmount.toFixed(2)}</span>
                  </div>
                  
                  {totals.discountAmount > 0 && (
                    <div className="flex justify-between py-2 border-b text-green-600">
                      <span className="font-medium">Discount:</span>
                      <span>-${totals.discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  
                  {totals.shippingCharges > 0 && (
                    <div className="flex justify-between py-2 border-b">
                      <span className="font-medium">Shipping/Extra Charges:</span>
                      <span>${totals.shippingCharges.toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between py-3 border-t-2 border-black font-bold text-lg">
                    <span>Grand Total:</span>
                    <span>${grandTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <hr className="border-gray-300" />

          {/* Payment Information */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold">Payment Information</h2>
            
            <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Accepted Payment Methods <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="Bank transfer, PayPal, Stripe, Cash, Check, etc."
                  className={`border rounded-md ${errors.paymentMethods ? 'border-red-500' : ''}`}
                  value={paymentInfo.paymentMethods}
                  onChange={(e) => handlePaymentChange("paymentMethods", e.target.value)}
                />
                {errors.paymentMethods && <p className="text-red-500 text-xs">{errors.paymentMethods}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Bank Details (if applicable)</label>
                <textarea
                  placeholder="Bank Name: Example Bank&#10;Account Name: Company Name&#10;Account Number: 1234567890&#10;IBAN: GB29 NWBK 6016 1331 9268 19&#10;SWIFT/BIC: NWBKGB2L"
                  className="w-full p-3 border rounded-md resize-none h-32"
                  value={paymentInfo.bankDetails}
                  onChange={(e) => handlePaymentChange("bankDetails", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Payment Terms <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="Net 15, Net 30, Due upon receipt, etc."
                  className={`border rounded-md ${errors.paymentTerms ? 'border-red-500' : ''}`}
                  value={paymentInfo.paymentTerms}
                  onChange={(e) => handlePaymentChange("paymentTerms", e.target.value)}
                />
                {errors.paymentTerms && <p className="text-red-500 text-xs">{errors.paymentTerms}</p>}
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <div className="flex justify-center pt-6">
            <Button 
              type="button"
              onClick={generatePDF}
              className="bg-black cursor-pointer text-white hover:bg-gray-800 px-8 py-3 text-lg rounded-md"
            >
              Generate Invoice →
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}