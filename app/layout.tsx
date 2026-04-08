import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import LayoutWrapper from "@/components/LayoutWrapper";

export const metadata: Metadata = {
  title: "DevTracker — 3-Month Roadmap",
  description: "Personal dev learning tracker",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-ink-950 text-ink-100 min-h-screen">
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
      </body>
    </html>
  );
}
