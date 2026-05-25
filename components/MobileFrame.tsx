'use client';

import React, { useState } from 'react';
import { ChevronLeft, ShoppingBag, ClipboardList, X } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { useCart } from '../context/CartContext';
import Link from 'next/link';

interface MobileFrameProps {
  children: React.ReactNode;
}

export default function MobileFrame({ children }: MobileFrameProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { cartCount } = useCart();

  const [isTrackModalOpen, setIsTrackModalOpen] = useState(false);
  const [trackOrderId, setTrackOrderId] = useState('');
  const [trackError, setTrackError] = useState('');

  const isHome = pathname === '/';
  const isSuccess = pathname === '/success';

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTrackError('');

    let formattedId = trackOrderId.trim().toUpperCase();
    if (!formattedId) {
      setTrackError('ID Pesanan tidak boleh kosong.');
      return;
    }

    // Auto prefix "ORD-" if they only typed 4 digits
    if (/^\d{4}$/.test(formattedId)) {
      formattedId = `ORD-${formattedId}`;
    }

    if (!/^ORD-\d{4}$/.test(formattedId)) {
      setTrackError('Format ID salah. Contoh: ORD-1234 atau 1234');
      return;
    }

    setIsTrackModalOpen(false);
    setTrackOrderId('');
    router.push(`/success?id=${formattedId}`);
  };

  return (
    // Full screen layout
    <div className="min-h-screen bg-cafe-50 flex flex-col font-sans antialiased text-cafe-900">

      {/* Navigation Header - Full width with centered max-width content */}
      <header className="w-full bg-white border-b border-cafe-100 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">

          <div className="flex items-center gap-3">
            {!isHome && !isSuccess && (
              <button
                onClick={() => router.back()}
                className="p-2 rounded-full hover:bg-cafe-100 text-cafe-700 transition-colors scale-active mr-1"
                aria-label="Kembali"
              >
                <ChevronLeft size={20} className="stroke-[2.5]" />
              </button>
            )}
            <div>
              <h1 className="font-black text-cafe-850 tracking-tight text-base sm:text-lg">
                {pathname === '/cart' ? 'Keranjang Saya' : pathname === '/checkout' ? 'Pembayaran' : pathname === '/success' ? 'Pembayaran Berhasil' : 'Warkop Asta'}
              </h1>
              {isHome && (
                <p className="text-xs text-amber-800 font-black uppercase tracking-wider">Pemesanan Meja Pintar</p>
              )}
            </div>
          </div>

          {/* Action Links */}
          <div className="flex items-center gap-3">
            {/* Lacak Pesanan Button */}
            {pathname !== '/admin' && (
              <button
                onClick={() => {
                  setIsTrackModalOpen(true);
                  setTrackError('');
                  setTrackOrderId('');
                }}
                className="p-2.5 rounded-full bg-cafe-100 hover:bg-cafe-200 text-cafe-700 transition-colors scale-active flex items-center justify-center"
                title="Lacak Pesanan"
              >
                <ClipboardList size={18} className="stroke-[2]" />
              </button>
            )}

            {pathname !== '/cart' && pathname !== '/checkout' && !isSuccess && (
              <Link
                href="/cart"
                className="relative p-2.5 rounded-full bg-cafe-100 hover:bg-cafe-200 text-cafe-700 transition-colors scale-active"
              >
                <ShoppingBag size={18} className="stroke-[2]" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-amber-700 text-white text-[9px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-bounce">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main Responsive Screen Viewport Content */}
      <main className="flex-1 w-full bg-cafe-50 focus:outline-none pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </div>
      </main>

      {/* Footer for Client Pages */}
      <footer className="w-full py-6 border-t border-cafe-200/60 bg-white text-center text-[10px] sm:text-xs text-cafe-400 font-medium select-none mt-auto">
        Kopi Senja Smart System • Didukung oleh Next.js 14 App Router
      </footer>

      {/* Modal Lacak Pesanan */}
      {isTrackModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 border border-cafe-100 shadow-2xl animate-fade-in text-left">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-base font-black text-cafe-850">Lacak Status Pesanan</h3>
              <button
                onClick={() => setIsTrackModalOpen(false)}
                className="p-1 hover:bg-cafe-100 rounded-full text-cafe-400 hover:text-cafe-750 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <p className="text-xs text-cafe-500 font-bold mb-4">
              Masukkan 4 digit nomor pesanan Anda atau ID lengkap (Contoh: ORD-1234 atau 1234) untuk memantau status pengerjaan hidangan.
            </p>

            <form onSubmit={handleTrackSubmit} className="space-y-3">
              <input
                type="text"
                placeholder="Contoh: ORD-1234 atau 1234"
                value={trackOrderId}
                onChange={(e) => setTrackOrderId(e.target.value)}
                className="w-full bg-cafe-50 hover:bg-cafe-100/60 focus:bg-white rounded-2xl border border-cafe-150 focus:border-amber-700 focus:ring-2 focus:ring-amber-700/20 px-4 py-3 text-xs font-black text-cafe-850 placeholder-cafe-400 focus:outline-none transition-all duration-300 uppercase"
              />

              {trackError && (
                <p className="text-[10px] font-black text-red-500 select-none">
                  ⚠️ {trackError}
                </p>
              )}

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsTrackModalOpen(false)}
                  className="flex-1 py-3 text-xs font-bold text-cafe-500 hover:text-cafe-700 bg-cafe-50 hover:bg-cafe-100 rounded-xl transition-all scale-active"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 text-xs font-black text-white bg-amber-700 hover:bg-amber-750 rounded-xl shadow-md shadow-amber-900/10 transition-all scale-active"
                >
                  Lacak Pesanan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
