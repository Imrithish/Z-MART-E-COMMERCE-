import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { CartProvider } from '@/context/CartContext';
import { HeaderShell } from "@/components/storefront/HeaderShell";
import { SupportFloatShell } from "@/components/storefront/SupportFloatShell";

export const metadata: Metadata = {
  title: 'Z-MART Merchant | Premium E-Commerce',
  description: 'Robust e-commerce management and premium storefront.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2701535152311310"
     crossorigin="anonymous"></script>
        <meta name="google-adsense-account" content="ca-pub-2701535152311310">
      </head>
      <body className="font-body antialiased" suppressHydrationWarning>
        <FirebaseClientProvider>
          <CartProvider>
            <HeaderShell />
            {children}
            <SupportFloatShell />
            <Toaster />
          </CartProvider>
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
