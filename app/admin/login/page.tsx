'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Coffee, Lock, ArrowRight, Loader2 } from 'lucide-react';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        router.push('/admin');
        router.refresh(); // Memaksa middleware untuk membaca cookie terbaru
      } else {
        setError(data.message || 'Password salah');
      }
    } catch (err) {
      setError('Terjadi kesalahan sistem');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-xl border border-stone-200 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-2 bg-amber-700"></div>
        
        <div className="p-8 pb-6 text-center border-b border-stone-100">
          <div className="w-16 h-16 bg-amber-50 rounded-2xl mx-auto flex items-center justify-center border border-amber-100 mb-4 shadow-sm">
            <Coffee size={32} className="text-amber-700 stroke-[2.2]" />
          </div>
          <h1 className="text-2xl font-black text-stone-850 tracking-tight">Warkop Asta</h1>
          <p className="text-xs font-bold text-stone-400 mt-1 uppercase tracking-widest">Portal Kasir & Dapur</p>
        </div>

        <div className="p-8">
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-stone-500 uppercase tracking-wider flex items-center gap-1.5">
                <Lock size={12} /> Password Akses
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                placeholder="••••••••"
                className="w-full px-4 py-3.5 bg-stone-50 border border-stone-200 rounded-xl text-sm font-bold text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700 transition-all duration-300"
                required
              />
              {error && (
                <p className="text-[10px] font-bold text-red-500 mt-1.5 flex items-center gap-1">
                  ⚠️ {error}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3.5 rounded-xl text-xs font-black uppercase tracking-wider text-white shadow-md transition-all duration-300 flex items-center justify-center gap-2 ${
                isLoading 
                  ? 'bg-amber-700/60 cursor-not-allowed' 
                  : 'bg-amber-750 hover:bg-amber-800 active:bg-amber-900 scale-active'
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Memverifikasi...
                </>
              ) : (
                <>
                  Masuk Sistem
                  <ArrowRight size={14} className="stroke-[2.5]" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
      
      <p className="text-[10px] font-bold text-stone-400 mt-8">
        Kawasan Terbatas. Hanya untuk staf Warkop Asta.
      </p>
    </div>
  );
}
