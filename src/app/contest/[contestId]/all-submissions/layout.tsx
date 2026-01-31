import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';

export default function AllSubmissionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <div className="bg-[#0f172a] min-h-screen">
        {children}
      </div>
      <Footer />
    </>
  );
}
