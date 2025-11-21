import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  title: "IAForge Insights",
  description: "Dashboard de uso de IA para equipes de desenvolvimento",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={spaceGrotesk.variable}>
      <body className="bg-transparent text-slate-900">
        <div className="min-h-screen bg-[var(--background)] px-6 py-8 md:px-10 lg:px-12">
          <div className="mx-auto max-w-6xl space-y-10">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
