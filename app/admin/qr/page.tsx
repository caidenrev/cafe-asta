'use client';

import React, { useState, useEffect } from 'react';
import { QrCode, Printer, Globe, Laptop, ArrowLeft, Coffee } from 'lucide-react';
import Link from 'next/link';

export default function QRGeneratorPage() {
  const [tableNumber, setTableNumber] = useState('04');
  const [hostType, setHostType] = useState<'local' | 'custom'>('local');
  const [customHost, setCustomHost] = useState('');
  const [origin, setOrigin] = useState('http://localhost:3000');

  useEffect(() => {
    fetch('/api/ip')
      .then((res) => res.json())
      .then((data) => {
        if (data.ip && data.ip !== 'localhost' && typeof window !== 'undefined') {
          const port = window.location.port ? `:${window.location.port}` : '';
          const localUrl = `${window.location.protocol}//${data.ip}${port}`;
          setOrigin(localUrl);
          setCustomHost(localUrl);
        } else if (typeof window !== 'undefined') {
          setOrigin(window.location.origin);
          setCustomHost(window.location.origin);
        }
      })
      .catch(() => {
        if (typeof window !== 'undefined') {
          setOrigin(window.location.origin);
          setCustomHost(window.location.origin);
        }
      });
  }, []);

  const getTargetUrl = () => {
    const host = hostType === 'local' ? origin : customHost;
    return `${host}/menu`;
  };

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(getTargetUrl())}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans print:bg-white print:text-black">
      {/* Header (Hidden on Print) */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-30 shadow-sm px-6 py-4 flex justify-between items-center print:hidden">
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="p-2 hover:bg-stone-100 rounded-full text-stone-600 transition-colors scale-active"
          >
            <ArrowLeft size={20} />
          </Link>
          <div className="w-10 h-10 rounded-2xl bg-amber-700 flex items-center justify-center text-white shadow-md shadow-amber-800/20">
            <Coffee size={22} className="stroke-[2.2]" />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight text-stone-850">Warkop Asta</h1>
            <p className="text-xs text-amber-800 font-black uppercase tracking-wider">Generator QR Code Meja</p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6 space-y-8 print:p-0">
        {/* Controls Container (Hidden on Print) */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-6 print:hidden">
          <h2 className="text-base font-black text-stone-800 flex items-center gap-2">
            <QrCode className="text-amber-700" />
            <span>Konfigurasi QR Code</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Input Nomor Meja */}
            <div className="space-y-2">
              <label className="block text-xs font-black text-stone-500 uppercase tracking-wider">
                Nomor Meja
              </label>
              <input
                type="number"
                min="1"
                max="99"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 focus:border-amber-750 focus:ring-2 focus:ring-amber-750/20 rounded-2xl px-4 py-3 text-sm font-bold placeholder-stone-400 focus:outline-none"
                placeholder="Contoh: 4"
              />
            </div>

            {/* Pilihan Host Server */}
            <div className="space-y-2">
              <label className="block text-xs font-black text-stone-500 uppercase tracking-wider">
                Target URL Server
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setHostType('local')}
                  className={`flex-1 py-3 px-4 rounded-2xl text-xs font-black border flex items-center justify-center gap-1.5 transition-all ${
                    hostType === 'local'
                      ? 'border-amber-700 bg-amber-50/50 text-amber-900 ring-2 ring-amber-750/10'
                      : 'border-stone-200 bg-white text-stone-700 hover:border-stone-300'
                  }`}
                >
                  <Laptop size={14} />
                  <span>Localhost</span>
                </button>
                <button
                  onClick={() => setHostType('custom')}
                  className={`flex-1 py-3 px-4 rounded-2xl text-xs font-black border flex items-center justify-center gap-1.5 transition-all ${
                    hostType === 'custom'
                      ? 'border-amber-700 bg-amber-50/50 text-amber-900 ring-2 ring-amber-750/10'
                      : 'border-stone-200 bg-white text-stone-700 hover:border-stone-300'
                  }`}
                >
                  <Globe size={14} />
                  <span>Production URL</span>
                </button>
              </div>
            </div>
          </div>

          {/* Custom Host Input */}
          {hostType === 'custom' && (
            <div className="space-y-2 animate-fade-in">
              <label className="block text-xs font-black text-stone-500 uppercase tracking-wider">
                Alamat URL Production
              </label>
              <input
                type="url"
                value={customHost}
                onChange={(e) => setCustomHost(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 focus:border-amber-750 focus:ring-2 focus:ring-amber-750/20 rounded-2xl px-4 py-3 text-sm font-bold placeholder-stone-400 focus:outline-none"
                placeholder="https://warkop-asta.vercel.app"
              />
            </div>
          )}

          {/* URL Preview */}
          <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 text-xs">
            <span className="font-bold text-stone-400 block mb-1">Target URL yang di-scan:</span>
            <code className="text-amber-800 font-extrabold select-all break-all">{getTargetUrl()}</code>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={handlePrint}
              className="px-5 py-3 rounded-2xl bg-amber-700 hover:bg-amber-750 text-white text-xs font-black flex items-center gap-2 shadow-md transition-all scale-active"
            >
              <Printer size={15} />
              <span>Cetak / Simpan PDF</span>
            </button>
          </div>
        </div>

        {/* Printable QR Card Display */}
        <div className="flex flex-col items-center justify-center py-12 px-6 bg-white border border-stone-200 shadow-lg rounded-[2.5rem] max-w-md mx-auto text-center relative print:border-0 print:shadow-none print:my-0 print:py-8">
          {/* Card Border frame */}
          <div className="w-full border-4 border-double border-amber-900/30 rounded-[2rem] p-8 flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-amber-900/10 flex items-center justify-center text-amber-900 mb-2">
              <Coffee size={24} className="stroke-[2.5]" />
            </div>
            
            <h3 className="text-2xl font-black tracking-tight text-amber-950">Warkop Astha</h3>
            <p className="text-[10px] font-black uppercase tracking-widest text-amber-800 mt-0.5">Pindai & Pesan Menu</p>
            
            {/* QR Box Container */}
            <div className="my-6 p-4 border-2 border-stone-100 bg-white rounded-2xl shadow-sm relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qrImageUrl}
                alt={`QR Code Meja ${tableNumber}`}
                className="w-48 h-48 object-cover"
              />
            </div>

            <span className="text-stone-400 text-[10px] font-bold">MEJA MAKAN</span>
            <div className="text-5xl font-black text-amber-950 tracking-tight mt-1">
              {tableNumber.padStart(2, '0')}
            </div>

            <p className="text-[9px] text-stone-500 max-w-[200px] mt-4 leading-relaxed font-medium">
              Silakan pindai kode QR di atas dengan kamera smartphone Anda untuk melihat daftar menu dan memesan hidangan.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
