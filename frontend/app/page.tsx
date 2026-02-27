// app/page.tsx
'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Truck } from 'lucide-react';

export default function Home() {
  const [status, setStatus] = useState<string>('Connecting...');

  useEffect(() => {
    // Call the Backend API
    axios.get('http://localhost:5000/')
      .then(res => setStatus(res.data.message))
      .catch(err => setStatus('Backend Offline 🔴'));
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-slate-50">
      <div className="bg-white p-10 rounded-2xl shadow-xl text-center border border-slate-200">
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-black rounded-full">
            <Truck className="text-white w-8 h-8" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Pickyo</h1>
        <p className="text-slate-500 mb-6">Logistics Marketplace MVP</p>

        <div className="px-4 py-2 bg-slate-100 rounded-lg text-sm font-mono text-slate-600">
          Server Status: <span className="font-bold text-emerald-600">{status}</span>
        </div>
      </div>
    </main>
  );
}