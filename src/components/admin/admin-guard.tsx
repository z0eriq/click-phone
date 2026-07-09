"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (pathname === "/admin/login") {
      setChecking(false);
      setAuthorized(true);
      return;
    }

    fetch("/api/auth")
      .then((r) => {
        if (!r.ok) throw new Error("Not auth");
        return r.json();
      })
      .then((data) => {
        if (data.user?.role === "CUSTOMER") {
          router.replace("/admin/login");
          return;
        }
        setAuthorized(true);
      })
      .catch(() => router.replace("/admin/login"))
      .finally(() => setChecking(false));
  }, [pathname, router]);

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
      </div>
    );
  }

  if (!authorized && pathname !== "/admin/login") return null;

  return <>{children}</>;
}
