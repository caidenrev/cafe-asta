'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import MobileFrame from '../../components/MobileFrame';
import { CheckCircle2, ChevronRight, CookingPot, GlassWater, Landmark, ListOrdered } from 'lucide-react';
import Link from 'next/link';

interface OrderItem {
  menuItem: {
    id: string;
    name: string;
    price: number;
    image: string;
  };
  quantity: number;
}

interface Order {
  id: string;
  customerName: string;
  tableNumber: string;
  total: number;
  status: 'Pending' | 'Processing' | 'Completed';
  createdAt: string;
  items: OrderItem[];
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('id');
  const tableNumberParam = searchParams.get('table') || '';

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(!!orderId);
  const [error, setError] = useState('');

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  useEffect(() => {
    if (!orderId) return;

    const fetchOrderStatus = async (silent = false) => {
      try {
        const response = await fetch(`/api/orders/${orderId}`);
        if (response.ok) {
          const data = await response.json();
          setOrder(data);
          setError('');
        } else {
          if (response.status === 404) {
            setError('Pesanan tidak ditemukan di database.');
          } else {
            setError('Gagal memuat status pesanan.');
          }
        }
      } catch (err) {
        console.error('Error fetching order status:', err);
        if (!silent) setError('Terjadi gangguan jaringan saat memuat data.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderStatus();

    // Poll every 5 seconds
    const interval = setInterval(() => {
      fetchOrderStatus(true);
    }, 5000);

    return () => clearInterval(interval);
  }, [orderId]);

  if (!orderId) {
    return (
      <div className="max-w-xl mx-auto p-5 flex flex-col items-center justify-center min-h-[500px] text-center">
        <div className="w-16 h-16 rounded-full bg-red-50 text-red-500 flex items-center justify-center mb-4 border border-red-100">
          <CheckCircle2 size={28} className="stroke-[2] text-red-500/70" />
        </div>
        <h2 className="text-lg font-black text-cafe-850">ID Pesanan Tidak Ditemukan</h2>
        <p className="text-xs text-cafe-400 mt-2 font-bold max-w-[280px]">
          Silakan gunakan fitur "Lacak Pesanan" di menu utama atau periksa kembali link Anda.
        </p>
        <Link
          href="/menu"
          className="mt-6 bg-cafe-900 text-white text-xs font-black px-6 py-3.5 rounded-full scale-active hover:bg-cafe-800 transition-colors"
        >
          Kembali ke Menu
        </Link>
      </div>
    );
  }

  const currentStatus = order?.status || 'Pending';

  return (
    <div className="max-w-xl mx-auto p-5 flex flex-col items-center justify-center min-h-[600px] text-center pb-24">
      {/* Tanda Centang Sukses */}
      <div className="relative mb-6">
        <div className="w-20 h-20 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center relative z-10 shadow-sm">
          {currentStatus === 'Completed' ? (
            <CheckCircle2 size={36} className="text-emerald-600 stroke-[2.2]" />
          ) : (
            <CookingPot size={34} className="text-amber-700 stroke-[2] animate-bounce" />
          )}
        </div>
        <div className="absolute -inset-2 bg-emerald-500/10 rounded-full blur-md animate-ping opacity-60"></div>
      </div>

      {/* Judul Utama */}
      <h2 className="text-2xl font-black text-cafe-850 tracking-tight">
        {currentStatus === 'Completed' ? 'Pesanan Selesai Disajikan!' : 'Pesanan Sedang Diproses'}
      </h2>
      <p className="text-xs text-cafe-500 mt-2 max-w-[85%] mx-auto font-bold leading-relaxed">
        {currentStatus === 'Completed'
          ? 'Terima kasih! Pesanan Anda telah diantarkan ke meja. Selamat menikmati hidangan Anda.'
          : 'Pembayaran terverifikasi. Koki dan Barista kami sedang menyiapkan pesanan terbaik untuk Anda.'}
      </p>

      {/* Info Karcis Ref */}
      <div className="bg-white rounded-3xl p-5 border border-cafe-100 shadow-sm mt-6 w-full space-y-3 relative overflow-hidden">
        {/* Garis dekoratif samping */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-700"></div>

        <div className="grid grid-cols-3 gap-2 text-left">
          <div>
            <p className="text-[10px] text-cafe-500 font-black uppercase tracking-wider">Pelanggan</p>
            <p className="text-xs font-black text-cafe-850 mt-1 truncate capitalize">{order?.customerName || '-'}</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] text-cafe-500 font-black uppercase tracking-wider">Referensi</p>
            <p className="text-xs font-black text-cafe-800 mt-1">{orderId}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-cafe-500 font-black uppercase tracking-wider">Nomor Meja</p>
            <p className="text-xs font-black text-amber-850 mt-1">Meja {order?.tableNumber || tableNumberParam || '-'}</p>
          </div>
        </div>
      </div>

      {/* Pelacak Proses Pesanan (Timeline) */}
      <div className="w-full mt-8 text-left">
        <h3 className="text-sm font-black text-cafe-500 uppercase tracking-wider mb-4 px-1">Status Pesanan</h3>
        
        {isLoading ? (
          <div className="bg-white rounded-3xl p-6 border border-cafe-100 shadow-sm flex flex-col items-center justify-center gap-3">
            <div className="w-6 h-6 rounded-full border-2 border-amber-750 border-t-transparent animate-spin"></div>
            <p className="text-[10px] text-cafe-400 font-bold">Menghubungkan ke server...</p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-3xl p-6 border border-cafe-100 shadow-sm text-center">
            <p className="text-xs font-black text-red-500">⚠️ {error}</p>
            <p className="text-[10px] text-cafe-400 mt-1">Sistem sedang mencoba memuat ulang secara otomatis...</p>
          </div>
        ) : (
          <div className="space-y-4 bg-white rounded-3xl p-5 border border-cafe-100 shadow-sm">
            
            {/* Langkah 1: Pembayaran & Pesanan Diterima */}
            <div className="flex gap-3 items-start">
              <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 size={12} className="stroke-[2.5]" />
              </div>
              <div className="min-w-0">
                <h4 className="text-sm font-black text-cafe-800 leading-tight">Pesanan Diterima</h4>
                <p className="text-xs text-cafe-500 font-bold mt-1">Pembayaran QRIS berhasil dikonfirmasi dan pesanan masuk dapur.</p>
              </div>
            </div>

            {/* Garis Penghubung */}
            <div className={`w-[1px] h-4 ml-3 -my-2.5 ${currentStatus !== 'Pending' ? 'bg-emerald-300' : 'bg-cafe-200'}`}></div>

            {/* Langkah 2: Pembuatan di Dapur */}
            <div className={`flex gap-3 items-start ${currentStatus === 'Pending' ? 'opacity-50' : ''}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 border ${
                currentStatus === 'Completed'
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                  : currentStatus === 'Processing'
                    ? 'bg-amber-50 text-amber-800 border-amber-200 animate-pulse'
                    : 'bg-cafe-100 text-cafe-400 border-cafe-150'
              }`}>
                {currentStatus === 'Completed' ? (
                  <CheckCircle2 size={12} className="stroke-[2.5]" />
                ) : (
                  <CookingPot size={11} className={`stroke-[2.5] ${currentStatus === 'Processing' ? 'animate-bounce' : ''}`} />
                )}
              </div>
              <div className="min-w-0">
                <h4 className="text-sm font-black text-cafe-800 leading-tight flex items-center gap-1.5">
                  <span>Sedang Disiapkan</span>
                  {currentStatus === 'Processing' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                  )}
                </h4>
                <p className="text-xs text-cafe-500 font-bold mt-1">Chef & Barista sedang mengolah pesanan Anda di dapur.</p>
              </div>
            </div>

            {/* Garis Penghubung */}
            <div className={`w-[1px] h-4 ml-3 -my-2.5 ${currentStatus === 'Completed' ? 'bg-emerald-300' : 'bg-cafe-200'}`}></div>

            {/* Langkah 3: Pengantaran */}
            <div className={`flex gap-3 items-start ${currentStatus !== 'Completed' ? 'opacity-50' : ''}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 border ${
                currentStatus === 'Completed'
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                  : 'bg-cafe-100 text-cafe-400 border-cafe-150'
              }`}>
                {currentStatus === 'Completed' ? (
                  <CheckCircle2 size={12} className="stroke-[2.5]" />
                ) : (
                  <GlassWater size={11} className="stroke-[2.5]" />
                )}
              </div>
              <div className="min-w-0">
                <h4 className="text-sm font-black text-cafe-800 leading-tight">Diantar ke Meja</h4>
                <p className="text-xs text-cafe-500 font-bold mt-1">Hidangan disajikan hangat langsung ke Meja Anda.</p>
              </div>
            </div>

          </div>
        )}
      </div>

      {/* Rincian Menu Pesanan (Real Data) */}
      {order && order.items && order.items.length > 0 && (
        <div className="w-full mt-6 text-left animate-fade-in">
          <h3 className="text-sm font-black text-cafe-500 uppercase tracking-wider mb-3 px-1 flex items-center gap-1.5">
            <ListOrdered size={15} />
            <span>Rincian Hidangan Anda</span>
          </h3>
          <div className="bg-white rounded-3xl p-5 border border-cafe-100 shadow-sm space-y-3">
            <div className="divide-y divide-cafe-100/60 max-h-56 overflow-y-auto pr-1 scrollbar-none">
              {order.items.map((item, idx) => (
                <div key={idx} className="py-2.5 flex justify-between items-center text-xs font-bold text-cafe-800">
                  <div className="min-w-0 flex-1">
                    <p className="font-black text-cafe-900 truncate">{item.menuItem.name}</p>
                    <p className="text-[10px] text-cafe-400 font-bold mt-0.5">{formatPrice(item.menuItem.price)} / porsi</p>
                  </div>
                  <span className="bg-cafe-100 text-cafe-850 px-2.5 py-1 rounded-lg text-[11px] font-black border border-cafe-150 ml-4 flex-shrink-0">
                    x{item.quantity}
                  </span>
                </div>
              ))}
            </div>
            
            <div className="pt-3 border-t border-cafe-100 flex justify-between items-center">
              <span className="text-xs font-black text-cafe-800">Total Pembayaran</span>
              <span className="text-sm font-black text-amber-900">{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Tombol Kembali ke Menu */}
      <div className="fixed bottom-6 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:right-auto md:w-full md:max-w-md z-40">
        <Link
          href="/menu"
          className="w-full flex items-center justify-center gap-1.5 bg-cafe-900 hover:bg-cafe-800 text-white py-4 rounded-2xl shadow-xl shadow-cafe-950/20 text-sm font-black uppercase tracking-wider transition-all duration-300 scale-active group"
        >
          <span>Pesan Menu Lainnya</span>
          <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform stroke-[3]" />
        </Link>
      </div>

    </div>
  );
}

export default function SuccessPage() {
  return (
    <MobileFrame>
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-[500px]">
          <div className="w-8 h-8 rounded-full border-4 border-amber-700 border-t-transparent animate-spin"></div>
        </div>
      }>
        <SuccessContent />
      </Suspense>
    </MobileFrame>
  );
}
