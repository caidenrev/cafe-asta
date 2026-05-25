import React from 'react';
import type { Metadata, Viewport } from 'next';
import { Outfit } from 'next/font/google';
import { CartProvider } from '../context/CartContext';
import './globals.css';

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Warkop Asta - Pemesanan QR Pintar',
  description: 'Pesan kopi, mie, dan camilan favorit Anda langsung dari meja via QRIS.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className={`${outfit.className} antialiased bg-cafe-50 text-cafe-900 selection:bg-amber-200 selection:text-amber-900`}>
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
