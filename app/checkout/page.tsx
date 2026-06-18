'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../../context/CartContext';
import MobileFrame from '../../components/MobileFrame';
import { QrCode, Lock, CreditCard, Sparkles, CheckCircle } from 'lucide-react';
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
  const [isUpdatingPayment, setIsUpdatingPayment] = useState(false);

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

  // Fungsi untuk memverifikasi secara manual bahwa pelanggan sudah membayar
  const handleVerifyPayment = async () => {
    if (!orderId || isUpdatingPayment) return;
    setIsUpdatingPayment(true);
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'Processing' }),
      });
      if (!response.ok) {
        throw new Error('Gagal verifikasi pembayaran');
      }
      // Polling useEffect akan menangkap perubahan status ini dan redirect ke /success
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan saat memverifikasi pembayaran.');
      setIsUpdatingPayment(false);
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
          <div className="bg-white rounded-[2.5rem] border border-cafe-100 p-6 shadow-sm flex flex-col items-center justify-center relative overflow-hidden animate-fade-in">
            {/* Pojok dekoratif scanner */}
            <div className="absolute top-6 left-6 w-5 h-5 border-t-4 border-l-4 border-amber-700 rounded-tl-lg"></div>
            <div className="absolute top-6 right-6 w-5 h-5 border-t-4 border-r-4 border-amber-700 rounded-tr-lg"></div>
            <div className="absolute bottom-6 left-6 w-5 h-5 border-b-4 border-l-4 border-amber-700 rounded-bl-lg"></div>
            <div className="absolute bottom-6 right-6 w-5 h-5 border-b-4 border-r-4 border-amber-700 rounded-br-lg"></div>

            {/* Gambar QR */}
            <div className="w-56 h-56 relative rounded-2xl overflow-hidden bg-white shadow-sm flex items-center justify-center p-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={paymentQrUrl}
                alt="Kode QRIS Warkop Asta"
                className="w-full h-full object-cover transition-opacity duration-300"
              />
            </div>

            {/* Jumlah Pembayaran directly inside the QR card section as per Request 8 */}
            <div className="mt-4 text-center w-full">
              <p className="text-xs text-cafe-500 font-black uppercase tracking-wider">Total Pembayaran</p>
              <p className="text-2xl font-black text-amber-900 tracking-tight mt-1 mb-4">{formatPrice(grandTotal)}</p>
              
              <button
                onClick={handleVerifyPayment}
                disabled={isUpdatingPayment}
                className={`w-full py-3.5 px-6 rounded-2xl text-xs font-black uppercase tracking-wider text-white shadow-md transition-all duration-300 scale-active flex items-center justify-center gap-2 ${
                  isUpdatingPayment
                    ? 'bg-stone-300 cursor-not-allowed opacity-60'
                    : 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 cursor-pointer'
                }`}
              >
                {isUpdatingPayment ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Memverifikasi...
                  </>
                ) : (
                  <>
                    <CheckCircle size={16} className="stroke-[2.5]" />
                    Saya Sudah Bayar
                  </>
                )}
              </button>
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
