'use client';

import React, { useState, useEffect } from 'react';
import StatusBadge, { OrderStatus } from '../../components/StatusBadge';
import {
  DollarSign,
  ClipboardList,
  CheckCircle,
  Coffee,
  RefreshCw,
  Clock,
  ChevronRight,
  UtensilsCrossed,
  Inbox,
  QrCode,
  X,
  LogOut
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface OrderItem {
  menuItem: {
    id: string;
    name: string;
    price: number;
    category: string;
    image: string;
  };
  quantity: number;
}

interface Order {
  id: string;
  customerName: string;
  tableNumber: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  createdAt: string;
}

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filter, setFilter] = useState<'All' | 'Pending' | 'Processing' | 'Completed'>('All');
  const [showMenuQrModal, setShowMenuQrModal] = useState(false);
  const [menuUrl, setMenuUrl] = useState('');
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch (e) {
      console.error('Logout failed', e);
    }
  };

  // Gunakan URL production untuk QR Pelanggan
  useEffect(() => {
    setMenuUrl('https://cafe-asta.vercel.app/menu');
  }, []);

  // Mengambil data pesanan dari API
  const fetchOrders = async (silent = false) => {
    if (!silent) setIsRefreshing(true);
    try {
      const response = await fetch('/api/orders');
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (e) {
      console.error('Gagal memuat data pesanan:', e);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Mengaktifkan real-time polling (setiap 4 detik)
  useEffect(() => {
    fetchOrders();
    const interval = setInterval(() => {
      fetchOrders(true);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Update status pesanan
  const handleUpdateStatus = async (orderId: string, nextStatus: OrderStatus) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (response.ok) {
        // Refresh data pesanan segera setelah update berhasil
        fetchOrders(true);
      }
    } catch (e) {
      console.error('Gagal memperbarui status pesanan:', e);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getRelativeTime = (isoString: string) => {
    const now = new Date();
    const past = new Date(isoString);
    const diffMs = now.getTime() - past.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Baru saja';
    if (diffMins === 1) return '1 menit lalu';
    if (diffMins < 60) return `${diffMins} menit lalu`;

    // Tampilkan jam lokal jika sudah lebih dari satu jam
    return past.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  };

  // Kalkulasi Statistik Admin
  const totalRevenue = orders
    .filter((o) => o.status === 'Completed')
    .reduce((sum, o) => sum + o.total, 0);

  const pendingCount = orders.filter((o) => o.status === 'Pending').length;
  const processingCount = orders.filter((o) => o.status === 'Processing').length;
  const completedCount = orders.filter((o) => o.status === 'Completed').length;

  // Filter daftar pesanan
  const filteredOrders = orders.filter(
    (order) => filter === 'All' || order.status === filter
  );

  return (
    <div className="min-h-screen bg-cafe-50 text-cafe-900 font-sans flex flex-col">

      {/* Header Panel Admin */}
      <header className="bg-white border-b border-cafe-200/80 sticky top-0 z-30 shadow-sm px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-700 flex items-center justify-center text-white shadow-md shadow-amber-800/20">
            <Coffee size={22} className="stroke-[2.2]" />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight text-cafe-850">Warkop Asta</h1>
            <p className="text-xs text-amber-800 font-black uppercase tracking-wider">Dashboard Dapur & Staf</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/qr"
            className="text-xs bg-amber-750 hover:bg-amber-800 text-white px-4 py-2.5 rounded-full font-bold transition-all scale-active flex items-center gap-1.5"
          >
            <QrCode size={13} />
            <span>Cetak QR Meja</span>
          </Link>
          <button
            onClick={() => setShowMenuQrModal(true)}
            className="text-xs bg-cafe-100 hover:bg-cafe-200 text-cafe-700 px-4 py-2.5 rounded-full font-bold transition-all scale-active flex items-center gap-1.5"
          >
            <QrCode size={13} />
            <span>QR App Pelanggan</span>
          </button>
          <button
            onClick={() => fetchOrders()}
            disabled={isRefreshing}
            className={`p-2.5 rounded-full bg-white hover:bg-cafe-100 border border-cafe-200 text-cafe-700 transition-all scale-active flex items-center justify-center ${isRefreshing && 'opacity-60 cursor-not-allowed'
              }`}
            title="Segarkan data pesanan"
          >
            <RefreshCw size={16} className={`stroke-[2.2] ${isRefreshing && 'animate-spin'}`} />
          </button>
          <div className="w-px h-6 bg-cafe-200 mx-1"></div>
          <button
            onClick={handleLogout}
            className="p-2.5 rounded-full bg-white hover:bg-red-50 border border-cafe-200 hover:border-red-200 text-cafe-500 hover:text-red-600 transition-all scale-active flex items-center justify-center"
            title="Keluar dari sistem"
          >
            <LogOut size={16} className="stroke-[2.2]" />
          </button>
        </div>
      </header>

      {/* Konten Dashboard Utama */}
      <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6">

        {/* Kolom Kartu Statistik */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Kartu 1: Total Pendapatan */}
          <div className="bg-white rounded-3xl p-6 border border-cafe-150 shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-cafe-400 uppercase tracking-widest">Total Pendapatan Bersih</p>
              <h3 className="text-xl font-black text-cafe-850 tracking-tight">{formatPrice(totalRevenue)}</h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
              <DollarSign size={20} className="stroke-[2.2]" />
            </div>
          </div>

          {/* Kartu 2: Antrean Pesanan Aktif */}
          <div className="bg-white rounded-3xl p-6 border border-cafe-150 shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-cafe-400 uppercase tracking-widest">Antrean Pesanan Aktif</p>
              <h3 className="text-xl font-black text-cafe-850 tracking-tight">
                {pendingCount + processingCount} <span className="text-xs text-cafe-400 font-semibold">pesanan</span>
              </h3>
              <p className="text-[9px] text-cafe-400 font-bold">
                {pendingCount} Menunggu • {processingCount} Disiapkan
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-100">
              <ClipboardList size={20} className="stroke-[2.2] animate-pulse" />
            </div>
          </div>

          {/* Kartu 3: Pesanan yang Sudah Disajikan */}
          <div className="bg-white rounded-3xl p-6 border border-cafe-150 shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-cafe-400 uppercase tracking-widest">Pesanan Selesai Disajikan</p>
              <h3 className="text-xl font-black text-cafe-850 tracking-tight">
                {completedCount} <span className="text-xs text-cafe-400 font-semibold">pesanan</span>
              </h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-100">
              <CheckCircle size={20} className="stroke-[2.2]" />
            </div>
          </div>
        </div>

        {/* Tabel Data Pesanan */}
        <div className="bg-white rounded-3xl border border-cafe-155 shadow-sm overflow-hidden flex flex-col">

          {/* Header Tabel dan Filter Kategori */}
          <div className="px-6 py-5 border-b border-cafe-150 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white">
            <div>
              <h2 className="text-sm font-black text-cafe-850 tracking-tight">Daftar Pesanan Masuk</h2>
              <p className="text-[10px] text-cafe-400 mt-0.5 font-bold">Pantau alur persiapan menu pelanggan di sini.</p>
            </div>

            {/* Filter status */}
            <div className="flex gap-1.5 bg-cafe-100 rounded-xl p-1 border border-cafe-150">
              {([
                { key: 'All', label: 'Semua' },
                { key: 'Pending', label: 'Menunggu' },
                { key: 'Processing', label: 'Disiapkan' },
                { key: 'Completed', label: 'Selesai' }
              ] as const).map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-extrabold tracking-wide transition-all scale-active ${filter === tab.key
                    ? 'bg-white text-cafe-850 shadow-sm border border-cafe-200/50'
                    : 'text-cafe-500 hover:text-cafe-850'
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Body Tabel */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <div className="w-8 h-8 rounded-full border-4 border-amber-700 border-t-transparent animate-spin"></div>
              <p className="text-xs font-bold text-cafe-400">Memuat database pesanan...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center px-6">
              <div className="w-16 h-16 rounded-full bg-cafe-100 flex items-center justify-center mb-4 text-cafe-400">
                <Inbox size={26} className="stroke-[1.8]" />
              </div>
              <h3 className="text-xs font-black text-cafe-850">Tidak ada pesanan</h3>
              <p className="text-[10px] text-cafe-400 mt-1 max-w-[280px]">
                Belum ada pesanan yang sesuai dengan filter ini. Checkout transaksi dari aplikasi pelanggan akan otomatis masuk ke sini secara real-time.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-cafe-100/50 border-b border-cafe-150 text-[10px] font-black uppercase tracking-widest text-cafe-400">
                    <th className="px-6 py-4">ID</th>
                    <th className="px-6 py-4">Pelanggan</th>
                    <th className="px-6 py-4">Meja</th>
                    <th className="px-6 py-4">Waktu Pesan</th>
                    <th className="px-6 py-4">Daftar Menu Pesanan</th>
                    <th className="px-6 py-4 text-right">Total Tagihan</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-center">Tindakan Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cafe-150">
                  {filteredOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="hover:bg-cafe-100/20 transition-colors text-xs font-bold text-cafe-800"
                    >
                      {/* ID Pesanan */}
                      <td className="px-6 py-4 font-black text-cafe-850">
                        {order.id}
                      </td>

                      {/* Nama Pelanggan */}
                      <td className="px-6 py-4 font-black text-cafe-800 capitalize">
                        {order.customerName || '-'}
                      </td>

                      {/* Nomor Meja */}
                      <td className="px-6 py-4">
                        <span className="bg-cafe-150 text-cafe-800 px-2.5 py-1 rounded-lg border border-cafe-200">
                          Meja {order.tableNumber}
                        </span>
                      </td>

                      {/* Waktu Pesan */}
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 text-cafe-500 font-medium">
                          <Clock size={12} className="opacity-70" />
                          <span>{getRelativeTime(order.createdAt)}</span>
                        </span>
                      </td>

                      {/* Rangkuman Item */}
                      <td className="px-6 py-4 max-w-xs md:max-w-md">
                        <div className="flex flex-wrap gap-1.5">
                          {order.items.map((item, idx) => (
                            <span
                              key={idx}
                              className="inline-block bg-white border border-cafe-200 rounded-lg px-2 py-1 text-[10px] shadow-sm"
                            >
                              <span className="text-amber-800 font-black">{item.quantity}x</span> {item.menuItem.name}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Total Tagihan */}
                      <td className="px-6 py-4 text-right font-black text-amber-800">
                        {formatPrice(order.total)}
                      </td>

                      {/* Badge Status */}
                      <td className="px-6 py-4">
                        <StatusBadge status={order.status} />
                      </td>

                      {/* Pengubah Status / Aksi */}
                      <td className="px-6 py-4 text-center">
                        {order.status === 'Pending' ? (
                          <button
                            onClick={() => handleUpdateStatus(order.id, 'Processing')}
                            className="bg-amber-700 hover:bg-amber-750 text-white px-3 py-1.5 rounded-xl shadow-sm text-[10px] font-black uppercase tracking-wider flex items-center gap-1 mx-auto transition-all scale-active"
                          >
                            <span>Proses Pesanan</span>
                            <ChevronRight size={12} className="stroke-[2.5]" />
                          </button>
                        ) : order.status === 'Processing' ? (
                          <button
                            onClick={() => handleUpdateStatus(order.id, 'Completed')}
                            className="bg-emerald-600 hover:bg-emerald-650 text-white px-3 py-1.5 rounded-xl shadow-sm text-[10px] font-black uppercase tracking-wider flex items-center gap-1 mx-auto transition-all scale-active"
                          >
                            <UtensilsCrossed size={12} className="stroke-[2.5]" />
                            <span>Antar / Selesai</span>
                          </button>
                        ) : (
                          <span className="text-[10px] text-emerald-600 font-black flex items-center justify-center gap-1 select-none">
                            <CheckCircle size={13} className="stroke-[2.5]" />
                            <span>Selesai Disajikan</span>
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-cafe-200 bg-white text-center text-xs text-cafe-400 font-bold select-none">
        Sistem Pintar Warkop Asta • Didukung oleh Next.js 14 App Router
      </footer>

      {/* Modal QR Code Menu Pelanggan */}
      {showMenuQrModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 border border-cafe-100 shadow-2xl animate-fade-in text-center flex flex-col items-center">
            <div className="flex justify-between items-center w-full mb-3">
              <h3 className="text-base font-black text-cafe-850">QR Code Menu Pelanggan</h3>
              <button
                onClick={() => setShowMenuQrModal(false)}
                className="p-1 hover:bg-cafe-100 rounded-full text-cafe-400 hover:text-cafe-750 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            
            <p className="text-xs text-cafe-500 font-bold mb-4">
              Pindai QR di bawah untuk membuka daftar menu pelanggan langsung dari smartphone Anda.
            </p>

            {/* QR Code Container */}
            <div className="p-4 bg-white border border-stone-150 rounded-2xl shadow-sm mb-4">
              {menuUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(menuUrl)}`}
                  alt="Menu QR"
                  className="w-44 h-44 object-cover"
                />
              ) : (
                <div className="w-44 h-44 flex items-center justify-center bg-stone-50 rounded-2xl">
                  <div className="w-5 h-5 border-2 border-amber-700 border-t-transparent animate-spin"></div>
                </div>
              )}
            </div>

            <div className="w-full bg-stone-50 border border-stone-150 rounded-2xl p-3 mb-4 text-left">
              <span className="text-[10px] text-stone-400 font-bold block mb-0.5">Target URL:</span>
              <code className="text-[9.5px] font-bold text-amber-800 break-all select-all block leading-tight">
                {menuUrl || 'Loading...'}
              </code>
            </div>

            <div className="flex gap-2.5 w-full">
              <button
                onClick={() => setShowMenuQrModal(false)}
                className="flex-1 py-3 text-xs font-bold text-cafe-500 hover:text-cafe-700 bg-cafe-50 hover:bg-cafe-100 rounded-xl transition-all scale-active"
              >
                Tutup
              </button>
              <Link
                href="/menu"
                target="_blank"
                className="flex-1 py-3 text-xs font-black text-center text-white bg-amber-750 hover:bg-amber-800 rounded-xl shadow-md shadow-amber-900/10 transition-all scale-active"
              >
                Buka di Browser
              </Link>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
