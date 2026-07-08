"use client";

import { Phone, MessageCircle, MapPin, Facebook } from "lucide-react";
import { CONTACT } from "@/lib/utils";
import { usePathname } from "next/navigation";

export function FloatingContact() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  const buttons = [
    {
      href: `tel:${CONTACT.phone}`,
      icon: Phone,
      label: "Call",
      color: "bg-brand-600 hover:bg-brand-700",
    },
    {
      href: `https://wa.me/${CONTACT.whatsapp}`,
      icon: MessageCircle,
      label: "WhatsApp",
      color: "bg-green-500 hover:bg-green-600",
      external: true,
    },
    {
      href: CONTACT.maps,
      icon: MapPin,
      label: "Maps",
      color: "bg-red-500 hover:bg-red-600",
      external: true,
    },
    {
      href: CONTACT.facebook,
      icon: Facebook,
      label: "Facebook",
      color: "bg-blue-600 hover:bg-blue-700",
      external: true,
    },
  ];

  return (
    <div className="fixed bottom-6 end-6 z-40 flex flex-col gap-3">
      {buttons.map((btn) => (
        <a
          key={btn.label}
          href={btn.href}
          target={btn.external ? "_blank" : undefined}
          rel={btn.external ? "noopener noreferrer" : undefined}
          className={`group flex h-12 w-12 items-center justify-center rounded-full text-white shadow-lg transition-all hover:scale-110 hover:shadow-xl ${btn.color}`}
          title={btn.label}
        >
          <btn.icon className="h-5 w-5" />
        </a>
      ))}
    </div>
  );
}
