import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "EmbedPrep — Embedded Systems Interview Prep",
  description:
    "Practice questions, chip comparison, company research, checklists, and progress tracking for embedded systems & hardware interviews.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="h-full antialiased">
        <body className="min-h-full">
          <AppProvider>
            <div className="tech-shell min-h-full">
              <div className="relative z-10 flex min-h-screen flex-col">
                <Navbar />
                <main className="mx-auto flex w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
                  <div className="tech-panel w-full p-4 sm:p-6 lg:p-8">
                    {children}
                  </div>
                </main>
              </div>
            </div>
          </AppProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
