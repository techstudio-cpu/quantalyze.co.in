import HeroDynamic from "@/components/HeroDynamic";
import Services from "@/components/Services";
import WhyUs from "@/components/WhyUs";
import Process from "@/components/Process";
import Brands from "@/components/Brands";
import Testimonials from "@/components/Testimonials";
import Stats from "@/components/Stats";
import Contact from "@/components/Contact";
import Newsletter from "@/components/Newsletter";
import FloatingContact from "@/components/FloatingContact";

export default function Home() {
  return (
    <>
      <HeroDynamic />
      <Services />
      <WhyUs />
      <Process />
      <Stats />
      <Brands />
      <Testimonials />
      <Newsletter />
      <Contact />
      <FloatingContact />
    </>
  );
}
