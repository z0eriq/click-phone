import { Metadata } from "next";
import { StaticPage } from "@/components/pages/static-page";

export const metadata: Metadata = {
  title: "من نحن",
  description: "تعرف على متجر كليك فون - وجهتك الموثوقة للهواتف الذكية والإلكترونيات في إربد، الأردن",
};

const content = {
  ar: {
    title: "من نحن",
    body: `
      <h2>كليك فون - CLICK PHONE</h2>
      <p>نحن متجر متخصص في بيع الهواتف الذكية والأجهزة الإلكترونية في إربد، الأردن. نقدم أحدث المنتجات من أشهر العلامات التجارية العالمية بأفضل الأسعار.</p>
      <h3>رؤيتنا</h3>
      <p>أن نكون الوجهة الأولى والأكثر موثوقية لشراء الهواتف الذكية والإلكترونيات في إربد والأردن.</p>
      <h3>مهمتنا</h3>
      <p>تقديم منتجات أصلية 100% مع ضمان شامل وخدمة عملاء متميزة وأسعار تنافسية.</p>
      <h3>ما نقدمه</h3>
      <ul>
        <li>هواتف ذكية من Apple, Samsung, Xiaomi, Nothing وأكثر</li>
        <li>أجهزة لوحية وساعات ذكية</li>
        <li>إكسسوارات أصلية وكفرات حماية</li>
        <li>صيانة احترافية بقطع غيار أصلية</li>
        <li>ضمان أصلي على جميع المنتجات</li>
      </ul>
    `,
  },
  en: {
    title: "About Us",
    body: `
      <h2>CLICK PHONE</h2>
      <p>We are a specialized store for smartphones and electronics in Irbid, Jordan. We offer the latest products from the world's most famous brands at the best prices.</p>
      <h3>Our Vision</h3>
      <p>To be the first and most trusted destination for buying smartphones and electronics in Irbid and Jordan.</p>
      <h3>Our Mission</h3>
      <p>Providing 100% original products with comprehensive warranty, excellent customer service, and competitive prices.</p>
    `,
  },
};

export default function AboutPage() {
  return <StaticPage content={content} />;
}
