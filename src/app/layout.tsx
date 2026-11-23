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
  metadataBase: new URL("https://digitalstudio.example"),
  title: "Digital Studio | Proximamente",
  description: "Algo bueno se esta cocinando. Nuestro nuevo estudio digital esta en construccion.",
  openGraph: {
    title: "Digital Studio | Proximamente",
    description: "Codigo, descanso, y otra vez codigo. El nuevo sitio esta llegando.",
    type: "website",
    locale: "es_AR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Digital Studio | Proximamente",
    description: "Codigo, descanso, y otra vez codigo.",
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
