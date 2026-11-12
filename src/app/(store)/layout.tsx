import Header, { AnnouncementBar } from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/store/CartDrawer";
import { WelcomeTrigger } from "@/components/store/Overlays";

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AnnouncementBar />
      <Header />
      <CartDrawer />
      <main id="main" tabIndex={-1}>{children}</main>
      <Footer />
      <WelcomeTrigger />
    </>
  );
}
