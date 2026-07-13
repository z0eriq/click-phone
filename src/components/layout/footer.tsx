"use client";

import Link from "next/link";
import { Phone, MapPin, Facebook, MessageCircle, Mail } from "lucide-react";
import { useLocaleStore } from "@/store";
import { t } from "@/lib/i18n";
import { CONTACT } from "@/lib/utils";
import { BrandLogo } from "@/components/ui/brand-logo";
import { usePathname } from "next/navigation";

const footerLinks = {
  shop: [
    { href: "/shop", key: "shop" as const },
    { href: "/offers", key: "offers" as const },
    { href: "/latest-phones", key: "latestPhones" as const },
    { href: "/accessories", key: "accessories" as const },
    { href: "/contact", key: "contactLines" as const },
  ],
  support: [
    { href: "/maintenance", key: "maintenance" as const },
    { href: "/faq", key: "faq" as const },
    { href: "/support", key: "contact" as const },
    { href: "/blog", key: "blog" as const },
  ],
  legal: [
    { href: "/privacy", key: "privacy" as const },
    { href: "/terms", key: "terms" as const },
    { href: "/about", key: "about" as const },
  ],
};

export function Footer() {
  const { locale } = useLocaleStore();
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) return null;

  return (
    <footer className="bg-gray-950 text-gray-300">
      {/* Contact CTA */}
      <div className="border-b border-gray-800">
        <div className="container mx-auto grid gap-4 px-4 py-8 sm:grid-cols-2 lg:grid-cols-5">
          <ContactButton
            href={`tel:${CONTACT.phone}`}
            icon={<Phone className="h-5 w-5" />}
            label={t(locale, "callUs")}
            value={CONTACT.phone}
          />
          <ContactButton
            href={`https://wa.me/${CONTACT.whatsapp}`}
            icon={<MessageCircle className="h-5 w-5" />}
            label={t(locale, "whatsapp")}
            value="WhatsApp"
            external
          />
          <ContactButton
            href={`mailto:${CONTACT.email}`}
            icon={<Mail className="h-5 w-5" />}
            label={locale === "ar" ? "البريد الإلكتروني" : "Email"}
            value={CONTACT.email}
          />
          <ContactButton
            href={CONTACT.maps}
            icon={<MapPin className="h-5 w-5" />}
            label={t(locale, "directions")}
            value="Google Maps"
            external
          />
          <ContactButton
            href={CONTACT.facebook}
            icon={<Facebook className="h-5 w-5" />}
            label={t(locale, "followUs")}
            value="Facebook"
            external
          />
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="mb-4">
              <BrandLogo height={52} className="rounded-xl" />
            </div>
            <p className="mb-4 max-w-sm text-sm leading-relaxed text-gray-400">
              {t(locale, "footerDesc")}
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              {t(locale, "quickLinks")}
            </h4>
            <ul className="space-y-2">
              {footerLinks.shop.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm hover:text-brand-400">
                    {t(locale, link.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              {t(locale, "customerService")}
            </h4>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm hover:text-brand-400">
                    {t(locale, link.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              {locale === "ar" ? "قانوني" : "Legal"}
            </h4>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm hover:text-brand-400">
                    {t(locale, link.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-gray-800 pt-8 sm:flex-row">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} CLICK PHONE. {t(locale, "allRightsReserved")}
          </p>
          <p className="text-xs text-gray-500">
            {locale === "ar" ? "صُنع بـ ❤️ في إربد، الأردن" : "Made with ❤️ in Irbid, Jordan"}
          </p>
        </div>
      </div>
    </footer>
  );
}

function ContactButton({
  href,
  icon,
  label,
  value,
  external,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  value: string;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="group flex items-center gap-3 rounded-xl border border-gray-800 bg-gray-900/50 p-4 transition-all hover:border-brand-600/50 hover:bg-brand-600/10"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-600/20 text-brand-400 transition-colors group-hover:bg-brand-600 group-hover:text-white">
        {icon}
      </div>
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-sm font-medium text-white">{value}</p>
      </div>
    </a>
  );
}
