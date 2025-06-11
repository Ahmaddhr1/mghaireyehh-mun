import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/lib/providers";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "بلديه المغيرية",
  description: "بلديه المغيرية",
};

export default async function RootLayout({ children }) {

  return (
    <html lang="en" className={geistSans.className}>
      <body
        className="antialiased"
      >
        <Providers>
          <Toaster />
          {children}
        </Providers>
      </body>
    </html>
  );
}