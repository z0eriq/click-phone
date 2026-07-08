import { Metadata } from "next";
import { StaticPage } from "@/components/pages/static-page";

export const metadata: Metadata = {
  title: "سياسة الخصوصية",
};

const content = {
  ar: {
    title: "سياسة الخصوصية",
    body: `
      <p>نحن في كليك فون نلتزم بحماية خصوصيتك. توضح هذه السياسة كيفية جمع واستخدام وحماية معلوماتك الشخصية.</p>
      <h3>المعلومات التي نجمعها</h3>
      <ul>
        <li>الاسم والبريد الإلكتروني ورقم الهاتف عند التسجيل</li>
        <li>عنوان التوصيل عند إتمام الطلب</li>
        <li>بيانات التصفح لتحسين تجربتك</li>
      </ul>
      <h3>كيف نستخدم معلوماتك</h3>
      <ul>
        <li>معالجة الطلبات والتوصيل</li>
        <li>التواصل بخصوص طلباتك</li>
        <li>تحسين خدماتنا</li>
        <li>إرسال عروض (بموافقتك)</li>
      </ul>
      <h3>حماية البيانات</h3>
      <p>نستخدم تشفير SSL وتدابير أمنية متقدمة لحماية بياناتك.</p>
    `,
  },
  en: {
    title: "Privacy Policy",
    body: `
      <p>At CLICK PHONE, we are committed to protecting your privacy. This policy explains how we collect, use, and protect your personal information.</p>
      <h3>Information We Collect</h3>
      <ul>
        <li>Name, email, and phone number upon registration</li>
        <li>Delivery address when placing orders</li>
        <li>Browsing data to improve your experience</li>
      </ul>
      <h3>How We Use Your Information</h3>
      <ul>
        <li>Processing orders and delivery</li>
        <li>Communicating about your orders</li>
        <li>Improving our services</li>
        <li>Sending offers (with your consent)</li>
      </ul>
      <h3>Data Protection</h3>
      <p>We use SSL encryption and advanced security measures to protect your data.</p>
    `,
  },
};

export default function PrivacyPage() {
  return <StaticPage content={content} />;
}
