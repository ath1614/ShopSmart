import React from 'react';
import { Link } from 'react-router-dom';

const features = [
  { icon: '⚡', title: 'AI-Powered Search', desc: 'Find products with natural language queries.' },
  { icon: '🛒', title: 'Smart Cart', desc: 'Price alerts, recommendations, and one-click reorder.' },
  { icon: '📊', title: 'Seller Dashboard', desc: 'Real-time analytics, inventory, and order management.' },
  { icon: '🔒', title: 'Secure Auth', desc: 'JWT + OAuth via Google and GitHub.' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-black">
      {/* Nav */}
      <nav className="border-b-2 border-black px-8 py-4 flex justify-between items-center">
        <span className="text-2xl font-black tracking-tight">SHOPSMART</span>
        <div className="flex gap-4">
          <Link to="/login" className="btn-secondary text-sm">LOG IN</Link>
          <Link to="/register" className="btn-primary text-sm">GET STARTED</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-8 py-24 border-b-2 border-black">
        <div className="max-w-4xl">
          <div className="badge mb-6">AI-FIRST E-COMMERCE</div>
          <h1 className="text-7xl font-black leading-none tracking-tighter mb-6">
            SHOP<br />SMARTER.<br />SELL<br />FASTER.
          </h1>
          <p className="text-xl font-medium text-gray-600 max-w-xl mb-10">
            The next-generation commerce platform powered by AI. Natural language search, intelligent recommendations, and real-time analytics — all in one place.
          </p>
          <div className="flex gap-4 flex-wrap">
            <Link to="/register" className="btn-primary text-lg px-10 py-4">START FOR FREE →</Link>
            <Link to="/login" className="btn-secondary text-lg px-10 py-4">SIGN IN</Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-8 py-20 border-b-2 border-black">
        <h2 className="text-4xl font-black mb-12 tracking-tight">EVERYTHING YOU NEED.</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f) => (
            <div key={f.title} className="card hover:shadow-brutal-xl transition-all">
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className="text-lg font-black mb-2 uppercase tracking-tight">{f.title}</h3>
              <p className="text-gray-600 font-medium text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-8 py-20 bg-black text-white">
        <div className="max-w-2xl">
          <h2 className="text-5xl font-black mb-6 tracking-tight">READY TO BUILD?</h2>
          <p className="text-gray-400 text-lg mb-8 font-medium">Join thousands of sellers and shoppers on ShopSmart.</p>
          <Link to="/register" className="inline-block bg-white text-black font-black px-10 py-4 border-2 border-white shadow-[4px_4px_0px_0px_#555] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
            CREATE ACCOUNT →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t-2 border-black px-8 py-6 flex justify-between items-center text-sm font-medium">
        <span className="font-black">SHOPSMART</span>
        <span className="text-gray-500">Built by Atharv Soni</span>
      </footer>
    </div>
  );
}
