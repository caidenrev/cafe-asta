'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../../context/CartContext';
import MobileFrame from '../../components/MobileFrame';
import { QrCode, Lock, CreditCard, Sparkles, CheckCircle, Clock, Download, RefreshCw } from 'lucide-react';
import { STATIC_QRIS, generateDynamicQRIS } from '../../lib/qris';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, tableNumber, setTableNumber, customerName, setCustomerName, cartTotal, clearCart } = useCart();
  const [inputTable, setInputTable] = useState(tableNumber);
  const [inputName, setInputName] = useState(customerName);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Sinkronisasi input lokal dengan context nomor meja & nama
  useEffect(() => {
    setInputTable(tableNumber);
  }, [tableNumber]);

  useEffect(() => {
    setInputName(customerName);
  }, [customerName]);

  const [orderId, setOrderId] = useState<string | null>(null);
  const [paymentUrl, setPaymentUrl] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isCheckingPayment, setIsCheckingPayment] = useState(false);
  const [timeLeft, setTimeLeft] = useState(3600); // 1 hour
  const [isExpired, setIsExpired] = useState(false);
  const [paymentDeadline, setPaymentDeadline] = useState('');

  // Perhitungan
  const taxAmount = 0;
  const serviceCharge = 0;
  const grandTotal = cartTotal;

  const isValid = inputName.trim() !== '' && inputTable.trim() !== '' && !isNaN(Number(inputTable)) && Number(inputTable) > 0;

  // Membuat order di database setelah menekan tombol checkout
  const handleCheckout = async () => {
    if (!isValid || orderId || isSubmitting) return;

    setIsSubmitting(true);
    setError('');
    try {
      // Set batas waktu bayar (1 jam dari sekarang)
      const deadline = new Date(Date.now() + 3600000);
      setPaymentDeadline(deadline.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB');

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tableNumber: inputTable,
          customerName: inputName,
          items: cart,
          total: grandTotal,
        }),
      });

      if (!response.ok) {
        throw new Error('Gagal membuat pesanan');
      }

      const orderData = await response.json();
      setOrderId(orderData.id);
      
      // Simpan nomor meja & nama ke context
      setTableNumber(inputTable);
      setCustomerName(inputName);

      // Buat tautan pembayaran QRIS dinamis untuk scan HP
      const protocol = window.location.protocol;
      const host = window.location.host;
      const payUrl = `${protocol}//${host}/pay?id=${orderData.id}&amount=${grandTotal}&table=${inputTable}`;
      setPaymentUrl(payUrl);
      setIsVerifying(true);
    } catch (err) {
      console.error(err);
      setError('Gagal membuat transaksi pembayaran. Silakan coba kembali.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Polling status pesanan secara real-time dari database
  useEffect(() => {
    if (!orderId || !isVerifying) return;

    let isMounted = true;
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/orders/${orderId}`);
        if (response.ok) {
          const data = await response.json();
          // Jika status berubah menjadi 'Processing' atau 'Completed' (berarti sudah dibayar)
          if (data.status === 'Processing' || data.status === 'Completed') {
            clearInterval(interval);
            if (isMounted) {
              clearCart();
              router.push(`/success?id=${orderId}&table=${inputTable}`);
            }
          }
        }
      } catch (err) {
        console.error('Error polling order status:', err);
      }
    }, 2000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [orderId, isVerifying, router, inputTable, clearCart]);

  // Countdown timer effect
  useEffect(() => {
    if (!orderId || isExpired) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [orderId, isExpired]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  // Fungsi untuk mengecek status pembayaran (manual refresh)
  const handleVerifyPayment = async () => {
    if (!orderId || isCheckingPayment) return;
    setIsCheckingPayment(true);
    try {
      const response = await fetch(`/api/orders/${orderId}`);
      if (!response.ok) {
        throw new Error('Gagal mengecek pembayaran');
      }
      const data = await response.json();
      if (data.status === 'Pending') {
        alert('Pembayaran belum diterima oleh sistem. Pastikan Anda sudah menyelesaikan transfer melalui QRIS.');
      } else {
        // Jika sudah diproses, clear cart dan arahkan ke halaman sukses
        clearCart();
        router.push(`/success?id=${orderId}&table=${inputTable}`);
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan saat mengecek status pembayaran.');
    } finally {
      setIsCheckingPayment(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };



  // QR code dinamis ke URL pembayaran aktual QRIS
  const dynamicQrisPayload = orderId ? generateDynamicQRIS(STATIC_QRIS, grandTotal) : '';
  const paymentQrUrl = dynamicQrisPayload 
    ? `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(dynamicQrisPayload)}`
    : '/qris-dummy.png';

  if (cart.length === 0 && !isSubmitting && !orderId) {
    return null; // Membiarkan redirect berjalan
  }

  return (
    <MobileFrame>
      <div className="max-w-2xl mx-auto space-y-6 pb-24">
        {/* Info Keamanan Pembayaran */}
        <div className="text-center mt-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200/80 rounded-full text-xs font-black uppercase tracking-wider mb-2">
            <Lock size={12} />
            <span>Pembayaran QRIS Aman</span>
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-cafe-850 tracking-tight">Pindai QRIS untuk Bayar</h2>
          <p className="text-sm text-cafe-550 mt-1.5 font-bold leading-relaxed">
            Buka aplikasi perbankan atau e-wallet (GoPay, OVO, DANA, ShopeePay, LinkAja) Anda untuk memindai.
          </p>
        </div>

        {/* Form Identitas & Nomor Meja */}
        <div className="bg-white rounded-3xl p-5 border border-cafe-100 shadow-sm space-y-4">
          <div>
            <label htmlFor="name-input" className="block text-xs font-black text-cafe-500 uppercase tracking-wider mb-2">
              Nama Lengkap Pelanggan (Wajib)
            </label>
            <input
              id="name-input"
              type="text"
              placeholder="Contoh: Budi, Sarah, Ahmad"
              value={inputName}
              onChange={(e) => setInputName(e.target.value)}
              disabled={isSubmitting || !!orderId}
              className="w-full text-center bg-cafe-50 hover:bg-cafe-100/60 focus:bg-white rounded-2xl border border-cafe-150 focus:border-amber-700 focus:ring-2 focus:ring-amber-700/20 px-4 py-3 text-sm font-black text-cafe-850 placeholder-cafe-400 focus:outline-none transition-all duration-300 disabled:opacity-65"
            />
          </div>

          <div>
            <label htmlFor="table-input" className="block text-xs font-black text-cafe-500 uppercase tracking-wider mb-2">
              Nomor Meja Makan (Wajib)
            </label>
            <input
              id="table-input"
              type="text"
              pattern="[0-9]*"
              inputMode="numeric"
              placeholder="Contoh: 04, 12, 25"
              value={inputTable}
              onChange={(e) => setInputTable(e.target.value)}
              disabled={isSubmitting || !!orderId}
              className="w-full text-center bg-cafe-50 hover:bg-cafe-100/60 focus:bg-white rounded-2xl border border-cafe-150 focus:border-amber-700 focus:ring-2 focus:ring-amber-700/20 px-4 py-3 text-sm font-black text-cafe-850 placeholder-cafe-400 focus:outline-none transition-all duration-300 disabled:opacity-65"
            />
          </div>

          {error && (
            <p className="text-xs font-black text-red-500 mt-2 text-center select-none">
              ⚠️ {error}
            </p>
          )}
        </div>

        {/* Loader saat menyiapkan QR */}
        {isSubmitting && (
          <div className="bg-white rounded-[2.5rem] border border-cafe-100 p-8 shadow-sm flex flex-col items-center justify-center gap-3 animate-pulse">
            <div className="w-8 h-8 border-4 border-amber-800 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs text-cafe-500 font-black uppercase tracking-wider">Menyiapkan QRIS Pembayaran...</p>
          </div>
        )}

        {/* Tombol Checkout Pembayaran */}
        {!orderId && !isSubmitting && (
          <button
            onClick={handleCheckout}
            disabled={!isValid}
            className={`w-full py-4 px-6 rounded-2xl text-xs font-black uppercase tracking-wider text-white shadow-md transition-all duration-300 scale-active ${
              isValid
                ? 'bg-[#2b170c] hover:bg-[#1a0f08] active:bg-[#0f0804] cursor-pointer'
                : 'bg-stone-300 cursor-not-allowed opacity-60'
            }`}
          >
            {isValid ? 'Lanjut ke Pembayaran QRIS' : 'Masukkan Nama & Nomor Meja'}
          </button>
        )}

        {/* Tampilan QRIS Scanner & Total tagihan */}
        {orderId && !isSubmitting && (
          <div className="space-y-6 animate-fade-in">
            {/* Header Total Pembayaran (Cafe Theme) */}
            <div className="bg-[#2b170c] rounded-3xl p-6 text-center text-white shadow-md relative overflow-hidden border border-amber-950/20">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-700/20 rounded-full blur-2xl -mr-10 -mt-10"></div>
              <p className="text-xs font-black uppercase tracking-widest text-amber-300/80 mb-2">Total Pembayaran</p>
              <h2 className="text-4xl font-black tracking-tight mb-2 text-amber-50">{formatPrice(grandTotal)}</h2>
              <p className="text-[10px] sm:text-xs text-stone-300 font-medium px-4">
                Pastikan nominal pembayaran sesuai agar pesanan Anda dapat diproses.
              </p>
            </div>

            {/* Rincian Pembayaran */}
            <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-5 space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-stone-100">
                <span className="text-xs font-bold text-stone-500">Metode Pembayaran</span>
                <span className="text-xs font-black text-stone-800">QRIS</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-stone-100">
                <span className="text-xs font-bold text-stone-500">Total Harga</span>
                <span className="text-xs font-black text-amber-900">{formatPrice(grandTotal)}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-stone-100">
                <span className="text-xs font-bold text-stone-500">Status Pembayaran</span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200/60 rounded-full text-[10px] font-black uppercase tracking-wider">
                  <Clock size={12} className="animate-pulse" />
                  Menunggu Pembayaran
                </span>
              </div>
              <div className="flex justify-between items-center pt-1">
                <span className="text-xs font-bold text-stone-500">Batas Waktu Pembayaran</span>
                <span className="text-xs font-black text-stone-800">{paymentDeadline}</span>
              </div>
            </div>

            {/* Scan QRIS Card */}
            <div className="bg-white rounded-[2.5rem] border border-stone-200 p-6 shadow-sm flex flex-col items-center justify-center relative">
              <div className="text-center mb-5">
                <h3 className="text-lg font-black text-cafe-850">Scan QRIS untuk Pembayaran</h3>
                <p className="text-[10px] text-stone-500 mt-1 max-w-[280px] mx-auto font-medium">
                  Gunakan mobile banking atau e-wallet yang mendukung QRIS. Jangan lupa cek nominal sebelum konfirmasi pembayaran.
                </p>
              </div>

              {/* Gambar QR */}
              <div className="w-56 h-56 relative rounded-2xl overflow-hidden bg-white shadow-sm border border-stone-100 flex items-center justify-center p-3 mb-5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={paymentQrUrl}
                  alt="Kode QRIS Warkop Asta"
                  className={`w-full h-full object-cover transition-opacity duration-300 ${isExpired ? 'opacity-20 grayscale' : ''}`}
                />
                {isExpired && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/60 backdrop-blur-[2px]">
                    <Lock size={32} className="text-red-500 mb-2" />
                    <p className="text-xs font-black text-red-600 uppercase">Waktu Habis</p>
                  </div>
                )}
              </div>

              {/* Sisa Waktu */}
              <div className="mb-6 flex justify-center">
                <div className="inline-flex items-center gap-2 px-5 py-2 bg-stone-50 border border-stone-200 rounded-full">
                  <span className="text-xs font-bold text-stone-600">Sisa waktu:</span>
                  <span className="text-sm font-black text-amber-700 tracking-wider">
                    {formatTime(timeLeft)} WIB
                  </span>
                </div>
              </div>

              {/* Kendala info */}
              <div className="w-full bg-amber-50 border border-amber-200/60 rounded-2xl p-4 mb-6 text-center">
                <h4 className="text-xs font-black text-amber-900 mb-1.5">
                  Kendala scan QRIS?
                </h4>
                <p className="text-[10px] text-amber-800/80 font-medium leading-relaxed">
                  Jika pembayaran belum masuk otomatis, silakan klik tombol <strong>Cek Status Pembayaran</strong> di bawah ini atau minta Kasir untuk memverifikasi.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <a
                  href={paymentQrUrl}
                  download="QRIS_Payment.png"
                  className="flex-1 py-3.5 px-4 rounded-2xl text-[11px] font-black uppercase tracking-wider text-white bg-amber-700 hover:bg-amber-800 active:bg-amber-900 shadow-md transition-all duration-300 scale-active flex items-center justify-center gap-2"
                >
                  <Download size={16} className="stroke-[2.5]" />
                  Download QR Code
                </a>
                
                <button
                  onClick={handleVerifyPayment}
                  disabled={isCheckingPayment || isExpired}
                  className={`flex-1 py-3.5 px-4 rounded-2xl text-[11px] font-black uppercase tracking-wider transition-all duration-300 scale-active flex items-center justify-center gap-2 border ${
                    isCheckingPayment || isExpired
                      ? 'bg-stone-100 text-stone-400 border-stone-200 cursor-not-allowed'
                      : 'bg-white text-stone-800 border-stone-200 hover:border-amber-700 hover:text-amber-800 hover:bg-amber-50 shadow-sm cursor-pointer'
                  }`}
                >
                  {isCheckingPayment ? (
                    <>
                      <div className="w-4 h-4 border-2 border-stone-400 border-t-transparent rounded-full animate-spin"></div>
                      Mengecek...
                    </>
                  ) : (
                    <>
                      <RefreshCw size={14} className="stroke-[2.5]" />
                      Cek Status Pembayaran
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Subtle helper link for testing at the bottom */}
        {orderId && (
          <div className="text-center mt-2">
            <a 
              href={paymentUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-amber-800/60 hover:text-amber-800 text-[11px] font-semibold transition-colors"
            >
              ⚡ Buka Link Simulasi Pembayaran (Testing)
            </a>
          </div>
        )}
      </div>
    </MobileFrame>
  );
}
