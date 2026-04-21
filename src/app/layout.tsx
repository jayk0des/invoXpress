import type { Metadata } from "next";
import { League_Spartan } from "next/font/google";

import { Providers } from "@/app/providers";
import { AppSidebar } from "@/components/AppSidebar";
import "./globals.css";

const leagueSpartan = League_Spartan({
  variable: "--font-league-spartan",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "InvoXpress",
  description: "Responsive invoice management application",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${leagueSpartan.variable} h-full antialiased`}>
      <body className="min-h-full bg-[var(--color-background)] font-sans text-[var(--color-text)]">
        <Providers>
          <AppSidebar />
          <div className="pt-20 lg:pl-28 lg:pt-0">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
