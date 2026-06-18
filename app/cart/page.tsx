'use client';

import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import MobileFrame from '../../components/MobileFrame';
import { Trash2, Plus, Minus, ArrowRight, MessageSquareCode, ReceiptText } from 'lucide-react';
import Link from 'next/link';

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, cartTotal, tableNumber } = useCart();
  const [kitchenNotes, setKitchenNotes] = useState('');

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Perhitungan
  const taxAmount = 0;
  const serviceCharge = 0;
  const grandTotal = cartTotal;

  if (cart.length === 0) {
    return (
      <MobileFrame>
        <div className="flex flex-col items-center justify-center min-h-[550px] px-6 text-center">
          <div className="w-20 h-20 rounded-full bg-amber-50 flex items-center justify-center mb-6 border border-amber-100">
            <Trash2 size={32} className="text-amber-700/60" />
          </div>
          <h2 className="text-lg font-extrabold text-cafe-850 tracking-tight">Keranjang Anda kosong</h2>
          <p className="text-xs text-cafe-400 max-w-[80%] mt-2 leading-relaxed font-medium">
            Sepertinya Anda belum memilih menu makanan atau minuman. Silakan kembali untuk memesan hidangan favorit Anda.
          </p>
          <Link
            href="/menu"
            className="mt-8 bg-amber-700 hover:bg-amber-750 text-white font-bold text-xs px-6 py-3.5 rounded-full shadow-lg shadow-amber-900/10 transition-all duration-300 scale-active"
          >
            Jelajahi Menu
          </Link>
        </div>
      </MobileFrame>
    );
  }

  return (
    <MobileFrame>
      <div className="flex flex-col lg:flex-row gap-8 pb-32">
        
        {/* Kolom Kiri: Rincian Menu & Catatan (Lebar 2/3 di Desktop) */}
        <div className="flex-1 space-y-6">


          <div>
            {/* Header Review Item */}
            <h3 className="text-sm font-black text-cafe-500 uppercase tracking-wider mb-3">Tinjau Menu Pilihan</h3>
            
            {/* Daftar Item di Keranjang */}
            <div className="space-y-3.5">
              {cart.map((item) => (
                <div 
                  key={`${item.menuItem.id}-${item.selectedVariant?.name || ''}`}
                  className="bg-white rounded-3xl p-4 border border-cafe-100 shadow-sm flex flex-col justify-between gap-3.5 transition-all duration-300 hover:shadow-md"
                >
                  {/* Detail Item & Tombol Hapus */}
                  <div className="flex justify-between items-start gap-4">
                    <div className="min-w-0">
                      <h4 className="font-black text-cafe-900 text-sm sm:text-base tracking-tight truncate leading-tight flex items-center flex-wrap gap-1.5">
                        <span>{item.menuItem.name}</span>
                        {item.selectedVariant && (
                          <span className="text-[10px] text-amber-800 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full font-bold">
                            {item.selectedVariant.name}
                          </span>
                        )}
                      </h4>
                      <p className="text-xs text-cafe-500 font-bold mt-1">
                        {formatPrice(item.selectedVariant ? item.selectedVariant.price : item.menuItem.price)} / porsi
                      </p>
                    </div>
 
                    {/* Tombol Hapus */}
                    <button
                      onClick={() => removeFromCart(item.menuItem.id, item.selectedVariant?.name)}
                      className="p-1.5 hover:bg-red-50 text-cafe-400 hover:text-red-500 rounded-lg transition-colors scale-active flex-shrink-0"
                      title="Hapus menu"
                    >
                      <Trash2 size={14} className="stroke-[2.2]" />
                    </button>
                  </div>
 
                  {/* Kuantitas di bawah */}
                  <div className="flex justify-between items-center pt-2.5 border-t border-cafe-100/60">
                    <span className="text-[10px] text-cafe-400 font-black uppercase tracking-wider">Jumlah Pesanan</span>
                    
                    {/* Pengubah Kuantitas */}
                    <div className="flex items-center gap-2 bg-cafe-100 rounded-full p-1 border border-cafe-150">
                      <button
                        onClick={() => updateQuantity(item.menuItem.id, item.selectedVariant?.name, item.quantity - 1)}
                        className="w-5.5 h-5.5 rounded-full bg-white hover:bg-cafe-50 text-cafe-700 flex items-center justify-center shadow-sm transition-colors scale-active"
                      >
                        <Minus size={10} className="stroke-[3]" />
                      </button>
                      <span className="text-[10px] font-black text-cafe-800 w-4 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.menuItem.id, item.selectedVariant?.name, item.quantity + 1)}
                        className="w-5.5 h-5.5 rounded-full bg-white hover:bg-cafe-50 text-cafe-700 flex items-center justify-center shadow-sm transition-colors scale-active"
                      >
                        <Plus size={10} className="stroke-[3]" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Input Catatan untuk Dapur */}
          <div>
            <label className="flex items-center gap-1.5 text-sm font-black text-cafe-500 uppercase tracking-wider mb-2">
              <MessageSquareCode size={15} />
              <span>Catatan Tambahan (Opsional)</span>
            </label>
            <textarea
              placeholder="Contoh: Kurangi gula, ekstra es batu, potong croissant jadi dua..."
              value={kitchenNotes}
              onChange={(e) => setKitchenNotes(e.target.value)}
              className="w-full bg-white rounded-2xl border border-cafe-100 focus:border-amber-700 focus:ring-2 focus:ring-amber-700/20 p-3.5 text-sm font-bold text-cafe-850 placeholder-cafe-400 focus:outline-none min-h-[85px] resize-none shadow-sm transition-all duration-300"
            ></textarea>
          </div>
        </div>

        {/* Kolom Kanan: Ringkasan Tagihan & Tombol Bayar (Lebar 1/3 di Desktop) */}
        <div className="w-full lg:w-[360px] lg:sticky lg:top-24 h-fit">
          <div className="bg-white rounded-3xl p-5 border border-cafe-100 shadow-sm space-y-3.5">
            <div className="flex items-center gap-1.5 pb-2 border-b border-cafe-100 text-cafe-800 font-black text-sm">
              <ReceiptText size={16} />
              <span>Ringkasan Pembayaran</span>
            </div>

            <div className="flex justify-between text-sm font-bold text-cafe-500">
              <span>Subtotal</span>
              <span>{formatPrice(cartTotal)}</span>
            </div>
            
            <div className="pt-2.5 border-t border-cafe-100 flex justify-between items-center">
              <span className="text-sm font-black text-cafe-850">Total Pembayaran</span>
              <span className="text-lg font-black text-amber-900">{formatPrice(grandTotal)}</span>
            </div>

            {/* Desktop-only Checkout button (Hidden on Mobile) */}
            <Link
              href="/checkout"
              className="hidden lg:flex items-center justify-between w-full bg-amber-700 hover:bg-amber-750 text-white px-5 py-4 rounded-2xl shadow-lg transition-all duration-300 scale-active group mt-4"
            >
              <span className="text-sm font-black uppercase tracking-wider">Konfirmasi Pemesanan</span>
              <div className="flex items-center gap-1 text-sm font-black text-amber-250 group-hover:text-white transition-colors">
                <span>{formatPrice(grandTotal)}</span>
                <ArrowRight size={14} className="stroke-[3] ml-1" />
              </div>
            </Link>
          </div>
        </div>

        {/* Mobile/Tablet Floating Bottom Checkout Button (Hidden on Desktop) */}
        <div className="lg:hidden fixed bottom-6 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:right-auto md:w-full md:max-w-md z-40">
          <Link
            href="/checkout"
            className="flex items-center justify-between bg-amber-700 hover:bg-amber-750 text-white px-5 py-4 rounded-2xl shadow-xl shadow-amber-900/10 transition-all duration-300 scale-active group"
          >
            <span className="text-sm font-black uppercase tracking-wider">Konfirmasi Pemesanan</span>
            <div className="flex items-center gap-1.5 text-sm font-black text-amber-200 group-hover:text-white transition-colors">
              <span>{formatPrice(grandTotal)}</span>
              <ArrowRight size={14} className="stroke-[3]" />
            </div>
          </Link>
        </div>

      </div>
    </MobileFrame>
  );
}
