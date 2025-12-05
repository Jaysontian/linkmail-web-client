import type { Metadata } from "next";

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
    url: "https://linkmail.dev/students",
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

export default function StudentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

