import { Metadata } from "next";
import { StaticPage } from "@/components/pages/static-page";
import { CONTACT } from "@/lib/utils";

export const metadata: Metadata = {
  title: "الصيانة",
  description: "خدمة صيانة احترافية للهواتف بقطع غيار أصلية - كليك فون",
};

const content = {
  ar: {
    title: "خدمة الصيانة",
    body: `
      <p>نقدم خدمة صيانة احترافية لجميع أنواع الهواتف الذكية بقطع غيار أصلية 100%.</p>
      <h3>خدماتنا</h3>
      <ul>
        <li>استبدال الشاشة</li>
        <li>استبدال البطارية</li>
        <li>إصلاح منافذ الشحن</li>
        <li>إصلاح الكاميرا والسماعة</li>
        <li>استعادة البيانات</li>
        <li>فك الحماية والسوفت وير</li>
      </ul>
      <h3>تواصل معنا</h3>
      <p>هاتف: <a href="tel:${CONTACT.phone}">${CONTACT.phone}</a></p>
      <p>واتساب: <a href="https://wa.me/${CONTACT.whatsapp}">تواصل عبر واتساب</a></p>
    `,
  },
  en: {
    title: "Repair Service",
    body: `
      <p>We offer professional repair services for all smartphone types with 100% original spare parts.</p>
      <h3>Our Services</h3>
      <ul>
        <li>Screen replacement</li>
        <li>Battery replacement</li>
        <li>Charging port repair</li>
        <li>Camera & speaker repair</li>
        <li>Data recovery</li>
        <li>Software unlock & flashing</li>
      </ul>
      <h3>Contact Us</h3>
      <p>Phone: <a href="tel:${CONTACT.phone}">${CONTACT.phone}</a></p>
      <p>WhatsApp: <a href="https://wa.me/${CONTACT.whatsapp}">Contact via WhatsApp</a></p>
    `,
  },
};

export default function MaintenancePage() {
  return <StaticPage content={content} />;
}
