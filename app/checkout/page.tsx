'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../../context/CartContext';
import MobileFrame from '../../components/MobileFrame';
import { QrCode, Lock, CreditCard, Sparkles } from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, tableNumber, setTableNumber, cartTotal, clearCart } = useCart();
  const [inputTable, setInputTable] = useState(tableNumber);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(300); // 5 menit hitung mundur

  // Sinkronisasi input lokal dengan context nomor meja
  useEffect(() => {
    setInputTable(tableNumber);
  }, [tableNumber]);

  // Logika hitung mundur
  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Perhitungan
  const taxAmount = Math.round(cartTotal * 0.10);
  const serviceCharge = cartTotal > 0 ? 3000 : 0;
  const grandTotal = cartTotal + taxAmount + serviceCharge;

  // Jika keranjang kosong dan tidak sedang mengirim, arahkan kembali ke menu
  useEffect(() => {
    if (cart.length === 0 && !isSubmitting) {
      router.replace('/');
    }
  }, [cart, router, isSubmitting]);

  const handleConfirmPayment = async () => {
    setError('');

    // Validasi Nomor Meja
    if (!inputTable || inputTable.trim() === '') {
      setError('Silakan masukkan nomor meja Anda.');
      return;
    }

    if (isNaN(Number(inputTable)) || Number(inputTable) <= 0) {
      setError('Silakan masukkan nomor meja yang valid (Contoh: 05).');
      return;
    }

    // Simpan nomor meja ke context
    setTableNumber(inputTable);
    setIsSubmitting(true);

    try {
      // POST pesanan ke backend mock
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tableNumber: inputTable,
          items: cart,
          total: grandTotal,
        }),
      });

      if (!response.ok) {
        throw new Error('Gagal mengirim pesanan ke server');
      }

      const orderData = await response.json();

      // Kosongkan keranjang setelah pesanan berhasil dibuat
      clearCart();

      // Arahkan ke halaman sukses dengan menyertakan context parameter
      router.push(`/success?id=${orderData.id}&table=${inputTable}`);
    } catch (err) {
      console.error(err);
      setError('Terjadi gangguan jaringan. Gagal mengonfirmasi pembayaran. Silakan coba kembali.');
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0 && !isSubmitting) {
    return null; // Membiarkan redirect berjalan
  }

  return (
    <MobileFrame>
      <div className="flex flex-col lg:flex-row gap-8 pb-32">

        {/* Kolom Kiri: Form & Scanner QRIS (Lebar 2/3 di Desktop) */}
        <div className="flex-grow space-y-6">
          {/* Info Keamanan Pembayaran */}
          <div className="text-center lg:text-left mt-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200/80 rounded-full text-xs font-black uppercase tracking-wider mb-2">
              <Lock size={12} />
              <span>Pembayaran QRIS Aman</span>
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-cafe-850 tracking-tight">Pindai QRIS untuk Bayar</h2>
            <p className="text-sm text-cafe-550 mt-1.5 font-bold leading-relaxed">
              Buka aplikasi perbankan atau e-wallet (GoPay, OVO, Dana, ShopeePay, LinkAja) Anda untuk memindai.
            </p>
          </div>

          {/* Form Input Nomor Meja */}
          <div className="bg-white rounded-3xl p-5 border border-cafe-100 shadow-sm">
            <label htmlFor="table-input" className="block text-sm font-black text-cafe-500 uppercase tracking-wider mb-2">
              Masukkan Nomor Meja Makan
            </label>
            <input
              id="table-input"
              type="text"
              pattern="[0-9]*"
              inputMode="numeric"
              placeholder="Contoh: 04, 12, 25"
              value={inputTable}
              onChange={(e) => setInputTable(e.target.value)}
              disabled={isSubmitting}
              className="w-full text-center bg-cafe-50 hover:bg-cafe-100/60 focus:bg-white rounded-2xl border border-cafe-150 focus:border-amber-700 focus:ring-2 focus:ring-amber-700/20 px-4 py-3.5 text-base font-black text-cafe-850 placeholder-cafe-400 focus:outline-none transition-all duration-300"
            />
            {error && (
              <p className="text-xs font-black text-red-500 mt-2 text-center select-none">
                ⚠️ {error}
              </p>
            )}
          </div>

          {/* Tampilan QRIS Scanner */}
          <div className="bg-white rounded-[2.5rem] border border-cafe-100 p-6 shadow-sm flex flex-col items-center justify-center relative overflow-hidden">
            {/* Pojok dekoratif scanner */}
            <div className="absolute top-6 left-6 w-5 h-5 border-t-4 border-l-4 border-amber-700 rounded-tl-lg"></div>
            <div className="absolute top-6 right-6 w-5 h-5 border-t-4 border-r-4 border-amber-700 rounded-tr-lg"></div>
            <div className="absolute bottom-6 left-6 w-5 h-5 border-b-4 border-l-4 border-amber-700 rounded-bl-lg"></div>
            <div className="absolute bottom-6 right-6 w-5 h-5 border-b-4 border-r-4 border-amber-700 rounded-br-lg"></div>

            {/* Gambar QR */}
            <div className="w-56 h-56 relative rounded-2xl overflow-hidden bg-white shadow-sm flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/qris-dummy.png"
                alt="Kode QRIS Warkop Asta"
                className="w-full h-full object-cover transition-opacity duration-300"
              />
            </div>

            {/* Bar Kedaluwarsa Kode QR */}
            <div className="mt-4 text-center">
              <p className="text-xs text-cafe-500 font-black uppercase tracking-wider flex items-center justify-center gap-1">
                <QrCode size={13} />
                <span>Kode QRIS Kedaluwarsa dalam</span>
              </p>
              <p className={`text-sm font-black mt-0.5 tracking-tight ${timeLeft < 60 ? 'text-red-500 animate-pulse' : 'text-amber-800'}`}>
                {formatTime(timeLeft)}
              </p>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Detail Tagihan & Tombol Bayar (Lebar 1/3 di Desktop) */}
        <div className="w-full lg:w-[360px] lg:sticky lg:top-24 h-fit">
          <div className="bg-white rounded-3xl p-5 border border-cafe-100 shadow-sm space-y-4">

            <div className="flex items-center justify-between pb-3 border-b border-cafe-100">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-50 text-amber-800 border border-amber-100">
                  <CreditCard size={18} />
                </div>
                <div>
                  <p className="text-xs text-cafe-500 font-black uppercase tracking-wider">Jumlah Harus Dibayar</p>
                  <p className="text-base font-black text-cafe-850 tracking-tight">{formatPrice(grandTotal)}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center bg-emerald-50 border border-emerald-100 px-3 py-2.5 rounded-xl text-emerald-800 text-[10px] font-black uppercase tracking-wider">
              <span className="flex items-center gap-1">
                <Sparkles size={11} />
                Verifikasi Otomatis
              </span>
              <span className="bg-emerald-600 text-white px-2 py-0.5 rounded-full text-[9px]">Aktif</span>
            </div>

            {/* Desktop-only Confirm Button (Hidden on Mobile) */}
            <button
              onClick={handleConfirmPayment}
              disabled={isSubmitting || timeLeft <= 0}
              className={`hidden lg:flex w-full items-center justify-center gap-2 bg-cafe-900 hover:bg-cafe-800 text-white py-4 rounded-2xl shadow-md text-sm font-black uppercase tracking-wider transition-all duration-300 scale-active ${(isSubmitting || timeLeft <= 0) && 'opacity-60 cursor-not-allowed pointer-events-none'
                }`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Memverifikasi Pembayaran...</span>
                </>
              ) : timeLeft <= 0 ? (
                <span>QR Kedaluwarsa. Muat Ulang</span>
              ) : (
                <span>Konfirmasi Pembayaran Berhasil</span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile/Tablet Floating Bottom Checkout Button (Hidden on Desktop) */}
        <div className="lg:hidden fixed bottom-6 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:right-auto md:w-full md:max-w-md z-40">
          <button
            onClick={handleConfirmPayment}
            disabled={isSubmitting || timeLeft <= 0}
            className={`w-full flex items-center justify-center gap-2 bg-cafe-900 hover:bg-cafe-800 text-white py-4 rounded-2xl shadow-xl shadow-cafe-950/20 text-sm font-black uppercase tracking-wider transition-all duration-300 scale-active ${(isSubmitting || timeLeft <= 0) && 'opacity-60 cursor-not-allowed pointer-events-none'
              }`}
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Memverifikasi Pembayaran...</span>
              </>
            ) : timeLeft <= 0 ? (
              <span>QR Kedaluwarsa. Muat Ulang Halaman</span>
            ) : (
              <span>Konfirmasi Pembayaran Berhasil</span>
            )}
          </button>
        </div>

      </div>
    </MobileFrame>
  );
}
