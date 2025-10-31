import type { Metadata } from "next";
import { Geist, Geist_Mono, Poppins, Outfit, Noto_Sans_HK } from "next/font/google";
import "./globals.css";
import {NextIntlClientProvider} from 'next-intl';
import {getLocale} from 'next-intl/server';

import Script  from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const poppins = Poppins({
  weight: ['400', '600', '700'],
  subsets: ['latin'],
});

const outfit = Outfit({

});

export const metadata: Metadata = {
  title: 'FPS2.me — 轉數快，快到我',
  description: 'Just FPS2.me 啦。香港轉數快（HKFPS）QR Code 生成工具，無需登入，立即生成專屬收款碼。',
  openGraph: {
    title: 'FPS2.me — 轉數快，快到我',
    description: 'Generate your HKFPS QR instantly — no app, no login.',
    url: 'https://fps2.me',
    siteName: 'FPS2.me',
    locale: 'zh-HK',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FPS2.me — 轉數快，快到我',
    description: '香港轉數快 QR Code 生成工具，無需登入。',
  },
}

type Props = {
  children: React.ReactNode;
};

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en">
//       <body
//         className={`${geistSans.variable} ${geistMono.variable} antialiased`}
//       >
//         {children}
//       </body>
//     </html>
//   );
// }

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'zh-HK' }];
}


export default async function RootLayout({children}: Props) {
  const locale = String(getLocale());
  return (
    <html lang={locale}>
      <head>
        {/* Plausible analytics script */}
        <Script
          defer
          data-domain="fps2.me"
          src="https://plaus.ous50.moe/js/script.file-downloads.hash.outbound-links.pageview-props.revenue.tagged-events.js"
          strategy="afterInteractive"
        />

        <Script id="plausible-init" strategy="afterInteractive">
          {`
            window.plausible = window.plausible || function() { 
              (window.plausible.q = window.plausible.q || []).push(arguments)
            }
          `}
        </Script>
      </head>
      <body className="halloween">  
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}