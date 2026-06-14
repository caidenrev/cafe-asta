'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCart } from '../context/CartContext';
import { MENU_ITEMS, MenuItem } from '../data/menu';
import MobileFrame from '../components/MobileFrame';
import { Search, Plus, Minus, Coffee, Sparkles, ShoppingBag, QrCode } from 'lucide-react';
import Link from 'next/link';

function MenuContent() {
  const { cart, addToCart, updateQuantity, tableNumber, setTableNumber } = useCart();
  const searchParams = useSearchParams();
  const [activeCategory, setActiveCategory] = useState<'all' | 'coffee' | 'non-coffee' | 'main-course' | 'snack' | 'refresher'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItemForVariant, setSelectedItemForVariant] = useState<MenuItem | null>(null);
  const [selectedVariantOption, setSelectedVariantOption] = useState<number>(0);
  const [manualTable, setManualTable] = useState('');
  const [hostIp, setHostIp] = useState('');

  useEffect(() => {
    fetch('/api/ip')
      .then((res) => res.json())
      .then((data) => {
        if (data.ip && data.ip !== 'localhost') {
          setHostIp(data.ip);
        } else if (typeof window !== 'undefined') {
          setHostIp(window.location.hostname);
        }
      })
      .catch(() => {
        if (typeof window !== 'undefined') {
          setHostIp(window.location.hostname);
        }
      });
  }, []);

  const handleOpenVariantModal = (item: MenuItem) => {
    setSelectedItemForVariant(item);
    setSelectedVariantOption(0);
  };

  // Auto-detect nomor meja dari QR code URL (?table=XX)
  useEffect(() => {
    const tableParam = searchParams.get('table');
    if (tableParam) {
      setTableNumber(tableParam);
    }
  }, [searchParams, setTableNumber]);

  // Filter menu berdasarkan tab kategori aktif dan query pencarian
  const filteredItems = MENU_ITEMS.filter((item) => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCartQuantity = (itemId: string) => {
    return cart
      .filter((i) => i.menuItem.id === itemId)
      .reduce((sum, i) => sum + i.quantity, 0);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Helper untuk rendering icon kategori
  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'coffee': return <Coffee size={14} />;
      case 'non-coffee': return <Sparkles size={14} />;
      case 'main-course': return <Coffee size={14} className="rotate-90" />; // Custom indicator
      case 'snack': return <Sparkles size={14} />;
      case 'refresher': return <Sparkles size={14} />;
      default: return <Coffee size={14} />;
    }
  };

  // Label kategori dalam Bahasa Indonesia
  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'all': return 'Semua';
      case 'coffee': return 'Pilihan Kopi';
      case 'non-coffee': return 'Non-Kopi';
      case 'main-course': return 'Makanan Utama';
      case 'snack': return 'Camilan & Roti';
      case 'refresher': return 'Mocktails';
      default: return cat;
    }
  };

  const getQrTargetUrl = () => {
    if (typeof window !== 'undefined') {
      const port = window.location.port ? `:${window.location.port}` : '';
      return `${window.location.protocol}//${hostIp || 'localhost'}${port}/?table=04`;
    }
    return '';
  };

  const welcomeQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(getQrTargetUrl())}`;

  if (!tableNumber) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[550px] px-6 text-center py-10 bg-[#0f0804] text-white">
        <div className="w-16 h-16 rounded-full bg-amber-700/20 text-amber-500 flex items-center justify-center mb-4 border border-amber-500/20">
          <Coffee size={28} className="stroke-[2]" />
        </div>
        
        <h2 className="text-3xl font-black bg-gradient-to-r from-amber-200 via-amber-300 to-yellow-100 bg-clip-text text-transparent">
          Warkop Astha
        </h2>
        <p className="text-[11px] text-stone-300 mt-2 font-medium max-w-[280px] leading-relaxed">
          Selamat datang! Silakan scan kode QR di bawah menggunakan HP Anda untuk membuka menu dan memesan dari meja.
        </p>

        {/* Real Dynamic QR Code Display */}
        <div className="my-6 p-4 bg-white rounded-3xl shadow-2xl relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={welcomeQrUrl}
            alt="Pindai QR untuk Memesan"
            className="w-40 h-40 object-cover"
          />
        </div>

        {/* IP Config Field for Mobile Connection */}
        <div className="w-full max-w-[260px] space-y-2 mb-6 text-left">
          <label className="block text-[9px] text-stone-400 font-black uppercase tracking-wider text-center">
            Ubah IP/Host (Bila scan pakai HP di jaringan Wi-Fi lokal)
          </label>
          <input
            type="text"
            placeholder="Contoh: 192.168.1.5"
            value={hostIp}
            onChange={(e) => setHostIp(e.target.value)}
            className="w-full text-center bg-white/10 hover:bg-white/15 focus:bg-white/20 rounded-xl border border-white/10 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 px-3 py-2 text-xs font-bold text-white placeholder-stone-600 focus:outline-none transition-all duration-300"
          />
        </div>

        <div className="bg-amber-950/25 border border-amber-500/10 px-4 py-3 rounded-2xl text-[9px] text-amber-200/80 font-bold max-w-[260px] leading-relaxed">
          Target Link: <code className="text-[8px] text-amber-300 break-all select-all block mt-0.5">{getQrTargetUrl()}</code>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full">
      {/* Banner Selamat Datang */}
      <div className="bg-gradient-to-br from-[#2b170c] via-[#1a0f08] to-[#0f0804] text-white p-6 rounded-b-[2.5rem] shadow-xl relative overflow-hidden border-b border-amber-950/20">
        {/* Dekorasi estetis */}
        <div className="absolute -right-6 -bottom-6 w-36 h-36 bg-amber-700/15 rounded-full blur-2xl"></div>
        <div className="absolute -left-6 -top-6 w-28 h-28 bg-yellow-600/10 rounded-full blur-xl"></div>

        <div className="relative z-10">
          <p className="text-[10px] uppercase tracking-widest text-amber-400 font-extrabold">Selamat Datang di</p>
          <h2 className="text-4xl font-extrabold tracking-tight mt-1 bg-gradient-to-r from-amber-200 via-amber-300 to-yellow-100 bg-clip-text text-transparent">
            Warkop Asta
          </h2>
          <p className="text-xs text-stone-300 mt-2 font-medium max-w-[90%] leading-relaxed">
            Pindai QR. Pesan Menu. Santai Sejenak. Pesanan Anda akan diantar langsung ke meja.
          </p>

          <div className="mt-5 inline-flex items-center gap-2 bg-white/5 backdrop-blur-lg border border-white/10 px-4 py-2 rounded-2xl text-xs font-bold text-amber-200 shadow-inner">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>Memesan di Meja {tableNumber || '04'}</span>
          </div>
        </div>
      </div>

      {/* Kolom Pencarian */}
      <div className="px-4 mt-6">
        <div className="relative flex items-center bg-stone-100/60 hover:bg-stone-100 focus-within:bg-white rounded-2xl shadow-sm border border-stone-200/80 overflow-hidden focus-within:ring-4 focus-within:ring-amber-700/5 focus-within:border-amber-700 transition-all duration-300">
          <Search size={18} className="text-stone-400 ml-4 pointer-events-none" />
          <input
            type="text"
            placeholder="Cari kopi, non-kopi, camilan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full py-4 pl-3 pr-4 text-xs font-semibold text-stone-800 bg-transparent focus:outline-none placeholder-stone-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-[10px] font-bold text-stone-400 hover:text-amber-800 pr-4 scale-active"
            >
              Hapus
            </button>
          )}
        </div>
      </div>

      {/* Filter Kategori Menu */}
      <div className="px-4 mt-6">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {(['all', 'coffee', 'non-coffee', 'main-course', 'snack', 'refresher'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-300 scale-active border ${activeCategory === cat
                ? 'bg-amber-700 text-white border-amber-750 shadow-md shadow-amber-900/10'
                : 'bg-white text-cafe-700 border-cafe-100 hover:border-cafe-200 shadow-sm'
                }`}
            >
              <span className="flex items-center gap-1.5">
                {cat !== 'all' && getCategoryIcon(cat)}
                {getCategoryLabel(cat)}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Bagian Daftar Menu */}
      <div className="px-4 mt-4 flex-1">
        <div className="flex justify-between items-center mb-3.5">
          <h3 className="text-base sm:text-lg font-black text-cafe-850 tracking-tight">
            {activeCategory === 'all' ? 'Semua Menu' : getCategoryLabel(activeCategory)}
          </h3>
          <span className="text-xs text-cafe-500 font-black">{filteredItems.length} menu</span>
        </div>

        {filteredItems.length === 0 ? (
          <div className="text-center py-12 px-6 bg-white rounded-3xl border border-dashed border-cafe-200/80">
            <p className="text-xs font-bold text-cafe-500">Menu tidak ditemukan</p>
            <p className="text-[10px] text-cafe-400 mt-1">Silakan atur ulang filter atau cari dengan kata kunci lain.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-32">
            {filteredItems.map((item) => {
              const qty = getCartQuantity(item.id);
              const hasVariants = !!item.variants && item.variants.length > 0;
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-3xl p-5 border border-cafe-100 hover:border-cafe-200/80 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between min-h-[160px] relative group"
                >
                  <div className="space-y-1.5">
                    <h4 className="font-black text-cafe-900 text-sm sm:text-base tracking-tight truncate leading-tight">
                      {item.name}
                    </h4>
                    <p className="text-xs text-cafe-500 line-clamp-3 leading-relaxed font-bold">
                      {item.description}
                    </p>
                  </div>

                  <div className="flex justify-between items-center mt-4">
                    <span className="font-black text-amber-900 text-sm sm:text-base tracking-tight">
                      {hasVariants
                        ? `${formatPrice(item.variants?.[0].price || item.price)} - ${formatPrice(item.variants?.[1].price || item.price)}`
                        : formatPrice(item.price)}
                    </span>

                    {/* Tombol Kuantitas / Pilih */}
                    {hasVariants ? (
                      qty > 0 ? (
                        <button
                          onClick={() => handleOpenVariantModal(item)}
                          className="bg-amber-700 hover:bg-amber-750 text-white rounded-full px-3.5 py-1.5 flex items-center gap-1.5 shadow-md shadow-amber-900/10 transition-all duration-300 scale-active text-xs font-black"
                        >
                          <span>Pilih</span>
                          <span className="bg-white text-amber-900 text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-black">
                            {qty}
                          </span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleOpenVariantModal(item)}
                          className="bg-amber-700 hover:bg-amber-750 text-white rounded-full px-3.5 py-1.5 flex items-center gap-1 shadow-md shadow-amber-900/10 transition-all duration-300 scale-active text-xs font-black"
                        >
                          <span>Pilih</span>
                        </button>
                      )
                    ) : qty > 0 ? (
                      <div className="flex items-center gap-2 bg-cafe-100 rounded-full p-1 border border-cafe-200">
                        <button
                          onClick={() => updateQuantity(item.id, undefined, qty - 1)}
                          className="w-6 h-6 rounded-full bg-white hover:bg-cafe-50 text-cafe-700 flex items-center justify-center transition-colors scale-active"
                        >
                          <Minus size={12} className="stroke-[2.5]" />
                        </button>
                        <span className="text-[11px] font-black text-cafe-800 w-4 text-center">
                          {qty}
                        </span>
                        <button
                          onClick={() => addToCart(item)}
                          className="w-6 h-6 rounded-full bg-white hover:bg-cafe-50 text-cafe-700 flex items-center justify-center transition-colors scale-active"
                        >
                          <Plus size={12} className="stroke-[2.5]" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => addToCart(item)}
                        className="bg-amber-700 hover:bg-amber-750 text-white rounded-full p-2 flex items-center justify-center shadow-md shadow-amber-900/10 transition-all duration-300 scale-active"
                      >
                        <Plus size={14} className="stroke-[2.5]" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Floating Bottom Cart Bar */}
      {cart.length > 0 && (
        <div className="fixed bottom-6 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:right-auto md:w-full md:max-w-md z-40">
          <Link
            href="/cart"
            className="flex items-center justify-between bg-cafe-900 hover:bg-cafe-800 text-white px-5 py-4 rounded-2xl shadow-xl shadow-cafe-950/20 transition-all duration-300 scale-active group"
          >
            <div className="flex items-center gap-3">
              <div className="relative p-2 rounded-xl bg-white/10 text-white">
                <ShoppingBag size={18} className="stroke-[2]" />
                <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              </div>
              <div>
                <p className="text-[10px] text-cafe-300 font-black uppercase tracking-wider">Subtotal</p>
                <p className="text-sm font-black tracking-tight">
                  {formatPrice(cart.reduce((sum, item) => sum + (item.selectedVariant ? item.selectedVariant.price : item.menuItem.price) * item.quantity, 0))}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-sm font-black text-amber-300 group-hover:text-white transition-colors">
              <span>Lihat Keranjang</span>
              <span className="text-base font-semibold">→</span>
            </div>
          </Link>
        </div>
      )}

      {/* Variant Selection Modal */}
      {selectedItemForVariant && (
        <div 
          onClick={() => setSelectedItemForVariant(null)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-sm w-full p-6 border border-cafe-100 shadow-2xl animate-fade-in"
          >
            <h3 className="text-lg font-black text-cafe-900 mb-1">{selectedItemForVariant.name}</h3>
            <p className="text-xs text-cafe-500 font-bold mb-4">{selectedItemForVariant.description}</p>

            <p className="text-xs font-black text-cafe-400 uppercase tracking-wider mb-2.5">Pilih Varian Suhu & Harga</p>

            <div className="space-y-2">
              {selectedItemForVariant.variants?.map((v, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedVariantOption(index)}
                  className={`w-full p-3.5 rounded-2xl border text-left flex justify-between items-center transition-all duration-300 scale-active ${selectedVariantOption === index
                    ? 'border-amber-700 bg-amber-50/50 text-amber-900 ring-2 ring-amber-700/10'
                    : 'border-cafe-100 bg-white text-cafe-850 hover:border-cafe-200'
                    }`}
                >
                  <span className="text-sm font-black">{v.name}</span>
                  <span className="text-sm font-black text-amber-900">{formatPrice(v.price)}</span>
                </button>
              ))}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setSelectedItemForVariant(null)}
                className="flex-1 py-3 text-xs font-bold text-cafe-50 hover:text-cafe-700 bg-cafe-50 hover:bg-cafe-100 rounded-xl transition-all scale-active"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  if (selectedItemForVariant.variants) {
                    addToCart(selectedItemForVariant, selectedItemForVariant.variants[selectedVariantOption]);
                  }
                  setSelectedItemForVariant(null);
                }}
                className="flex-1 py-3 text-xs font-black text-white bg-amber-700 hover:bg-amber-750 rounded-xl shadow-md shadow-amber-900/10 transition-all scale-active"
              >
                Tambah (+ {formatPrice(selectedItemForVariant.variants?.[selectedVariantOption].price || 0)})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function MenuPage() {
  return (
    <MobileFrame>
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-[500px]">
          <div className="w-8 h-8 rounded-full border-4 border-amber-700 border-t-transparent animate-spin"></div>
        </div>
      }>
        <MenuContent />
      </Suspense>
    </MobileFrame>
  );
}
