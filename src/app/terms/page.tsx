import { Metadata } from "next";
import { StaticPage } from "@/components/pages/static-page";

export const metadata: Metadata = {
  title: "الشروط والأحكام",
};

const content = {
  ar: {
    title: "الشروط والأحكام",
    body: `
      <p>باستخدامك لموقع كليك فون، فإنك توافق على الشروط والأحكام التالية.</p>
      <h3>المنتجات والأسعار</h3>
      <ul>
        <li>جميع المنتجات أصلية 100% مع ضمان الشركة المصنعة</li>
        <li>الأسعار قابلة للتغيير دون إشعار مسبق</li>
        <li>نحتفظ بحق رفض أي طلب</li>
      </ul>
      <h3>الطلبات والتوصيل</h3>
      <ul>
        <li>يتم تأكيد الطلب عبر الهاتف أو الواتساب</li>
        <li>التوصيل داخل بغداد 1-2 يوم عمل</li>
        <li>التوصيل للمحافظات 2-5 أيام عمل</li>
      </ul>
      <h3>الإرجاع والاستبدال</h3>
      <ul>
        <li>يمكن الإرجاع خلال 7 أيام من الاستلام</li>
        <li>يجب أن يكون المنتج بحالته الأصلية</li>
        <li>لا يمكن إرجاع المنتجات المفتوحة</li>
      </ul>
    `,
  },
  en: {
    title: "Terms & Conditions",
    body: `
      <p>By using the CLICK PHONE website, you agree to the following terms and conditions.</p>
      <h3>Products & Prices</h3>
      <ul>
        <li>All products are 100% original with manufacturer warranty</li>
        <li>Prices are subject to change without notice</li>
        <li>We reserve the right to refuse any order</li>
      </ul>
      <h3>Orders & Delivery</h3>
      <ul>
        <li>Orders are confirmed via phone or WhatsApp</li>
        <li>Delivery within Baghdad: 1-2 business days</li>
        <li>Other cities: 2-5 business days</li>
      </ul>
      <h3>Returns & Exchanges</h3>
      <ul>
        <li>Returns accepted within 7 days of delivery</li>
        <li>Product must be in original condition</li>
        <li>Opened products cannot be returned</li>
      </ul>
    `,
  },
};

export default function TermsPage() {
  return <StaticPage content={content} />;
}
