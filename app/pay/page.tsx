'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Coffee, Wallet, CheckCircle, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import MobileFrame from '@/components/MobileFrame';

function PaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [table, setTable] = useState('');
  const [amount, setAmount] = useState(0);
  const [selectedWallet, setSelectedWallet] = useState<'gopay' | 'ovo' | 'dana' | 'shopeepay'>('gopay');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [status, setStatus] = useState<'idle' | 'processing' | 'success'>('idle');

  useEffect(() => {
    const tableParam = searchParams.get('table');
    const amountParam = searchParams.get('amount');
    
    if (tableParam) setTable(tableParam);
    if (amountParam) setAmount(parseInt(amountParam));
  }, [searchParams]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.length < 10) {
      alert('Masukkan nomor HP e-wallet yang valid (Min. 10 digit).');
      return;
    }

    setStatus('processing');
    
    try {
      const orderId = searchParams.get('id');
      if (orderId) {
        const response = await fetch(`/api/orders/${orderId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: 'Processing' }),
        });

        if (!response.ok) {
          throw new Error('Gagal memperbarui status pesanan');
        }
      }
      
      // Simulate API connection to E-wallet Gateway success delay
      setTimeout(() => {
        setStatus('success');
      }, 1500);
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan koneksi saat memproses pembayaran. Silakan coba lagi.');
      setStatus('idle');
    }
  };

  const walletConfig = {
    gopay: {
      name: 'GoPay',
      color: 'bg-emerald-600 text-white border-emerald-500',
      logoBg: 'bg-emerald-50',
      textColor: 'text-emerald-600'
    },
    ovo: {
      name: 'OVO',
      color: 'bg-indigo-900 text-white border-indigo-800',
      logoBg: 'bg-indigo-50',
      textColor: 'text-indigo-950'
    },
    dana: {
      name: 'DANA',
      color: 'bg-blue-600 text-white border-blue-500',
      logoBg: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    shopeepay: {
      name: 'ShopeePay',
      color: 'bg-orange-600 text-white border-orange-500',
      logoBg: 'bg-orange-50',
      textColor: 'text-orange-600'
    }
  };

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[550px] px-6 text-center py-10 bg-stone-50">
        <div className="w-20 h-20 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-600 flex items-center justify-center mb-6 shadow-md animate-bounce">
          <CheckCircle size={36} className="stroke-[2.5]" />
        </div>
        
        <h2 className="text-2xl font-black text-stone-900 tracking-tight">Pembayaran Sukses!</h2>
        <p className="text-xs font-bold text-emerald-800 uppercase tracking-widest mt-1 bg-emerald-50 border border-emerald-100 px-3.5 py-1 rounded-full">
          Diverifikasi via {walletConfig[selectedWallet].name}
        </p>

        <p className="text-xs text-stone-500 max-w-[80%] mt-4 leading-relaxed font-medium">
          Pembayaran Anda sebesar <strong className="text-stone-900 font-extrabold">{formatPrice(amount)}</strong> untuk <strong>Meja {table || '-'}</strong> telah berhasil diproses.
        </p>

        <div className="w-full bg-white border border-stone-200 rounded-3xl p-5 mt-8 space-y-3 shadow-sm text-left">
          <div className="flex justify-between text-xs font-bold text-stone-500">
            <span>Metode Pembayaran</span>
            <span className={walletConfig[selectedWallet].textColor}>{walletConfig[selectedWallet].name} App</span>
          </div>
          <div className="flex justify-between text-xs font-bold text-stone-500">
            <span>Nomor Meja</span>
            <span className="text-stone-900">Meja {table || '-'}</span>
          </div>
          <div className="flex justify-between text-xs font-bold text-stone-500">
            <span>Nomor E-wallet</span>
            <span className="text-stone-900">{phoneNumber}</span>
          </div>
          <div className="pt-2.5 border-t border-stone-100 flex justify-between items-center text-sm font-black">
            <span className="text-stone-850">Total Nominal</span>
            <span className="text-amber-900">{formatPrice(amount)}</span>
          </div>
        </div>

        <div className="mt-8 bg-amber-50 border border-amber-200/80 rounded-2xl p-4 text-[10px] text-amber-955 font-bold leading-relaxed max-w-[280px]">
          👍 Halaman pesanan utama Anda akan otomatis terkonfirmasi secara instan setelah pembayaran ini.
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full bg-stone-50">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-[#2b170c] via-[#1a0f08] to-[#0f0804] text-white p-6 rounded-b-[2.5rem] shadow-xl relative overflow-hidden border-b border-amber-950/20">
        <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-amber-700/10 rounded-full blur-2xl"></div>
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-amber-400 font-extrabold">E-wallet Gateway</p>
            <h2 className="text-2xl font-black tracking-tight mt-0.5 bg-gradient-to-r from-amber-200 via-amber-300 to-yellow-100 bg-clip-text text-transparent">
              Warkop Astha
            </h2>
          </div>
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/10">
            <Coffee size={20} className="text-amber-300" />
          </div>
        </div>
      </div>

      <div className="p-5 flex-1 space-y-6">
        {/* Invoice Summary */}
        <div className="bg-white rounded-3xl p-5 border border-stone-200/60 shadow-sm space-y-3.5">
          <div className="flex justify-between items-center text-[10px] text-stone-400 font-black uppercase tracking-wider">
            <span>Rincian Tagihan Meja {table}</span>
            <span className="flex items-center gap-0.5 text-emerald-600 bg-emerald-50 border border-emerald-100/60 px-2 py-0.5 rounded-full">
              <Sparkles size={9} />
              Secure Pay
            </span>
          </div>
          <div className="flex justify-between items-baseline">
            <span className="text-xs text-stone-500 font-bold">Total Pembayaran</span>
            <span className="text-xl font-black text-amber-900">{formatPrice(amount)}</span>
          </div>
        </div>

        {/* E-wallet Selector Form */}
        <form onSubmit={handlePaymentSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-black text-stone-500 uppercase tracking-wider mb-3">
              Pilih E-Wallet Anda
            </label>
            <div className="grid grid-cols-2 gap-3.5">
              {(['gopay', 'ovo', 'dana', 'shopeepay'] as const).map((w) => (
                <button
                  key={w}
                  type="button"
                  onClick={() => setSelectedWallet(w)}
                  className={`p-4 rounded-2xl border text-left flex flex-col justify-between min-h-[90px] transition-all scale-active ${
                    selectedWallet === w
                      ? 'border-amber-700 bg-amber-50/40 ring-2 ring-amber-700/10 shadow-sm'
                      : 'border-stone-200 bg-white hover:border-stone-300'
                  }`}
                >
                  <span className={`text-[10px] font-black uppercase tracking-wider ${walletConfig[w].textColor}`}>
                    {walletConfig[w].name}
                  </span>
                  <div className="flex justify-between items-center w-full mt-4">
                    <span className="text-stone-400 text-[10px] font-semibold">Bayar Cepat</span>
                    <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                      selectedWallet === w ? 'border-amber-700 bg-amber-700 text-white' : 'border-stone-300 bg-white'
                    }`}>
                      {selectedWallet === w && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Phone Number Input */}
          <div className="space-y-2">
            <label htmlFor="phone-input" className="block text-xs font-black text-stone-500 uppercase tracking-wider">
              Masukkan Nomor HP {walletConfig[selectedWallet].name} Anda
            </label>
            <div className="relative flex items-center bg-white rounded-2xl border border-stone-200 focus-within:border-amber-700 focus-within:ring-4 focus-within:ring-amber-750/5 overflow-hidden shadow-sm transition-all duration-300">
              <span className="text-xs font-bold text-stone-400 pl-4 pr-1.5 border-r border-stone-150 select-none">+62</span>
              <input
                id="phone-input"
                type="tel"
                pattern="[0-9]*"
                inputMode="numeric"
                placeholder="81234567890"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/[^0-9]/g, ''))}
                disabled={status === 'processing'}
                required
                className="w-full py-4 pl-3 pr-4 text-xs font-semibold text-stone-850 bg-transparent focus:outline-none placeholder-stone-400"
              />
            </div>
          </div>

          {/* Pay Button */}
          <button
            type="submit"
            disabled={status === 'processing'}
            className={`w-full flex items-center justify-between bg-stone-900 hover:bg-stone-800 text-white px-5 py-4.5 rounded-2xl shadow-lg transition-all duration-300 scale-active ${
              status === 'processing' && 'opacity-60 cursor-not-allowed pointer-events-none'
            }`}
          >
            {status === 'processing' ? (
              <span className="flex items-center gap-2 mx-auto text-xs font-black uppercase tracking-wider">
                <Loader2 size={16} className="animate-spin text-amber-300" />
                Membuka Aplikasi {walletConfig[selectedWallet].name}...
              </span>
            ) : (
              <>
                <span className="text-xs font-black uppercase tracking-wider flex items-center gap-2">
                  <Wallet size={15} />
                  Bayar dengan {walletConfig[selectedWallet].name}
                </span>
                <span className="text-xs font-black text-amber-300 flex items-center gap-1">
                  {formatPrice(amount)}
                  <ArrowRight size={13} className="stroke-[3]" />
                </span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function PaymentGatewayPage() {
  return (
    <MobileFrame>
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-[500px]">
          <div className="w-8 h-8 rounded-full border-4 border-stone-300 border-t-amber-700 animate-spin"></div>
        </div>
      }>
        <PaymentContent />
      </Suspense>
    </MobileFrame>
  );
}
