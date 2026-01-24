import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import ReduxProvider from "@/providers/ReduxProvider";
import GoogleAuthProvider from "@/providers/GoogleOAuthProvider";
import CookieConsent from '@/components/common/CookieConsent';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Code Arena",
  description: "Competitive Programming Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <GoogleAuthProvider>
          <ReduxProvider>
            {children}
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#1f2937',
                  color: '#fff',
                  border: '1px solid #374151',
                },
              }}
            />
            <CookieConsent />
          </ReduxProvider>
        </GoogleAuthProvider>
      </body>
    </html>
  );
}
