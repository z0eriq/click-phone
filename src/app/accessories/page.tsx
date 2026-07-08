import { Metadata } from "next";
import { Suspense } from "react";
import ShopPage from "../shop/shop-content";

export const metadata: Metadata = {
  title: "الإكسسوارات",
  description: "إكسسوارات أصلية - كليك فون",
};

export default function AccessoriesPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-600 border-t-transparent" /></div>}>
      <ShopPage />
    </Suspense>
  );
}
