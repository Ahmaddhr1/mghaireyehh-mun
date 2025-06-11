import { MySideBar } from "@/components/MySideBar";
import { Geist, Geist_Mono } from "next/font/google";

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

export default function RootLayout({ children }) {
  return (
    <div className={"flex min-h-screen antialiased"}>
      <main className="flex-1 p-4 overflow-auto">{children}</main>
      <div className="w-fit">
        <MySideBar />
      </div>
    </div>
  );
}
