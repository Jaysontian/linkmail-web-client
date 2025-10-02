import type { Metadata } from "next";
import { Newsreader } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Linkmail",
  description: "AI Outreach for Hardcore Networkers",
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
  openGraph: {
    title: "AI Outreach for Hardcore Networkers",
    url: "https://linkmail.dev",
    siteName: "Linkmail",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "AI Outreach for Hardcore Networkers",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Linkmail",
    description: "AI Outreach for Hardcore Networkers",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${newsreader.variable} antialiased`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
