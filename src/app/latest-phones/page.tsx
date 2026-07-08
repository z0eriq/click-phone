import { Metadata } from "next";
import { Suspense } from "react";
import ShopPage from "../shop/shop-content";

export const metadata: Metadata = {
  title: "أحدث الهواتف",
  description: "أحدث الهواتف الذكية - كليك فون",
};

export default function LatestPhonesPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-600 border-t-transparent" /></div>}>
      <ShopPage />
    </Suspense>
  );
}
