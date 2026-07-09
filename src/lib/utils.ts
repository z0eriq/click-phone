import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const LOCALE_AR = "ar-JO";
export const LOCALE_EN = "en-JO";
export const CURRENCY = "JOD";

export function formatPrice(
  price: number | string,
  locale: string = LOCALE_AR,
  currency: string = CURRENCY
): string {
  const num = typeof price === "string" ? parseFloat(price) : price;
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
}

export function calculateDiscount(price: number, comparePrice: number): number {
  if (!comparePrice || comparePrice <= price) return 0;
  return Math.round(((comparePrice - price) / comparePrice) * 100);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function generateOrderNumber(): string {
  const date = new Date();
  const y = date.getFullYear().toString().slice(-2);
  const m = (date.getMonth() + 1).toString().padStart(2, "0");
  const d = date.getDate().toString().padStart(2, "0");
  const rand = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `CP${y}${m}${d}${rand}`;
}

export function getAverageRating(ratings: number[]): number {
  if (ratings.length === 0) return 0;
  return ratings.reduce((a, b) => a + b, 0) / ratings.length;
}

export const CONTACT = {
  phone: process.env.NEXT_PUBLIC_PHONE || "0785954444",
  // Jordan country code +962 — remove leading 0 from local number
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP || "962785954444",
  whatsappUrl: `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP || "962785954444"}`,
  facebook: process.env.NEXT_PUBLIC_FACEBOOK || "https://web.facebook.com/profile.php?id=61567285796866",
  maps: process.env.NEXT_PUBLIC_MAPS_URL || "https://maps.app.goo.gl/7W7ncszchVNWCJhE7",
  email: process.env.NEXT_PUBLIC_EMAIL || "click@aloush.online",
  address: "إربد، الأردن",
  country: "الأردن",
  countryCode: "+962",
};

export const TAX_RATE = parseFloat(process.env.TAX_RATE || "0.16");
export const SHIPPING_COST = parseFloat(process.env.SHIPPING_COST || "5");
export const FREE_SHIPPING_THRESHOLD = parseFloat(process.env.FREE_SHIPPING_THRESHOLD || "100");
