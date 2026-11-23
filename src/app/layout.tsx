import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://mmdigitalstudio.com.mx"),
  title: {
    default: "M&M Digital Studio | Diseño, desarrollo y SEO",
    template: "%s | M&M Digital Studio",
  },
  description: "Diseño web, desarrollo, SEO y sistemas digitales creados para impulsar negocios con soluciones modernas, funcionales y medibles.",
  applicationName: "M&M Digital Studio",
  openGraph: {
    siteName: "M&M Digital Studio",
    title: "M&M Digital Studio | Diseño, desarrollo y SEO",
    description: "Diseño web, desarrollo, SEO y sistemas digitales para potenciar la presencia y el crecimiento de tu negocio.",
    type: "website",
    locale: "es_AR",
  },
  twitter: {
    card: "summary_large_image",
    title: "M&M Digital Studio | Diseño, desarrollo y SEO",
    description: "Soluciones profesionales de diseño web, desarrollo, SEO y sistemas digitales.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body>{children}</body>
    </html>
  );
}
