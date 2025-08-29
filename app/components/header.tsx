import Image from "next/image";
import React from "react";

export default function Header() {
  return (
    <div className="flex items-center justify-center p-6 bg-[#315052]">
      <div className="text-2xl md:text-4xl font-bold">
        <Image src={"/goinvoice.png"} width={200} height={0} alt="goinvoice" />
      </div>
    </div>
  );
}
