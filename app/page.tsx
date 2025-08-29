/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import CreateInvoiceForm from "./components/form.createInvoice";
import Invoice from "./components/invoice";

export default function Page() {
  const [showPreview, setShowPreview] = useState(false);

  const generatePDF = () => {
    setShowPreview(true);
  };

  return showPreview ? (
    <Invoice showPreview={showPreview} setShowPreview={setShowPreview} />
  ) : (
    <CreateInvoiceForm generatePDF={generatePDF} />
  );
}
