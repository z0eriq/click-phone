import { Suspense } from "react";
import ShopPage from "./shop-content";

export default function Shop() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-600 border-t-transparent" />
      </div>
    }>
      <ShopPage />
    </Suspense>
  );
}
