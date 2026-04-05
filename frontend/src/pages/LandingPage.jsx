import React from 'react';
import { Link } from 'react-router-dom';

const features = [
  { icon: '⚡', title: 'AI-Powered Search', desc: 'Find products with natural language queries.', bg: 'bg-[#FFD6EC]' },
  { icon: '🛒', title: 'Smart Cart', desc: 'Price alerts, recommendations, one-click reorder.', bg: 'bg-[#FFF9C4]' },
  { icon: '📊', title: 'Seller Dashboard', desc: 'Real-time analytics, inventory and order management.', bg: 'bg-[#C8E6FF]' },
  { icon: '🔒', title: 'Secure Auth', desc: 'JWT + OAuth via Google and GitHub.', bg: 'bg-[#FFD6EC]' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] text-black">
      {/* Nav */}
      <nav className="border-b-2 border-black px-8 py-4 flex justify-between items-center bg-white sticky top-0 z-50">
        <span className="text-2xl font-black tracking-tight">
          SHOP<span className="text-[#FF6EC7]">SMART</span>
        </span>
        <div className="flex gap-3">
          <Link to="/login" className="btn-secondary text-sm px-4 py-2">LOG IN</Link>
          <Link to="/register" className="btn-pink text-sm px-4 py-2">GET STARTED</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-8 py-20 border-b-2 border-black bg-white">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="badge-pink mb-6">AI-FIRST E-COMMERCE</div>
            <h1 className="text-7xl font-black leading-none tracking-tighter mb-6">
              SHOP<br />
              <span className="text-[#FF6EC7]">SMART</span><br />
              <span className="text-[#FFE44D] [-webkit-text-stroke:2px_black]">ER.</span>
            </h1>
            <p className="text-lg font-medium text-gray-600 max-w-md mb-10">
              The next-gen commerce platform powered by AI. Natural language search, intelligent recommendations, real-time analytics.
            </p>
            <div className="flex gap-4 flex-wrap">
              <Link to="/register" className="btn-pink text-lg px-10 py-4">START FOR FREE →</Link>
              <Link to="/login" className="btn-secondary text-lg px-10 py-4">SIGN IN</Link>
            </div>
          </div>
          {/* Splash art panel */}
          <div className="relative hidden md:block">
            <div className="bg-[#FFE44D] border-2 border-black shadow-brutal-xl w-full h-80 flex items-center justify-center text-8xl">
              🛍️
            </div>
            <div className="absolute -bottom-4 -right-4 bg-[#FF6EC7] border-2 border-black w-24 h-24 flex items-center justify-center text-4xl shadow-brutal">
              ✨
            </div>
            <div className="absolute -top-4 -left-4 bg-[#C8E6FF] border-2 border-black w-16 h-16 flex items-center justify-center text-2xl shadow-brutal">
              ⚡
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-8 py-20 border-b-2 border-black">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-black mb-12 tracking-tight">EVERYTHING YOU NEED.</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <div key={f.title} className={`${f.bg} border-2 border-black shadow-brutal p-6 hover:shadow-brutal-xl hover:-translate-y-1 transition-all`}>
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="text-lg font-black mb-2 uppercase tracking-tight">{f.title}</h3>
                <p className="text-gray-700 font-medium text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="px-8 py-16 border-b-2 border-black bg-black text-white">
        <div className="max-w-5xl mx-auto grid grid-cols-3 gap-8 text-center">
          <div>
            <p className="text-5xl font-black text-[#FF6EC7]">25+</p>
            <p className="font-bold mt-2 uppercase tracking-wider text-sm">Products</p>
          </div>
          <div>
            <p className="text-5xl font-black text-[#FFE44D]">8</p>
            <p className="font-bold mt-2 uppercase tracking-wider text-sm">Categories</p>
          </div>
          <div>
            <p className="text-5xl font-black text-[#60B8FF]">100%</p>
            <p className="font-bold mt-2 uppercase tracking-wider text-sm">Secure</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-8 py-20 bg-[#FFE44D] border-b-2 border-black">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-5xl font-black mb-6 tracking-tight">READY TO BUILD?</h2>
          <p className="text-gray-700 text-lg mb-8 font-medium">Join thousands of sellers and shoppers on ShopSmart.</p>
          <Link to="/register" className="btn-primary inline-block text-lg px-12 py-4">
            CREATE ACCOUNT →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t-2 border-black px-8 py-6 flex justify-between items-center text-sm font-medium bg-white">
        <span className="font-black text-lg">SHOP<span className="text-[#FF6EC7]">SMART</span></span>
        <span className="text-gray-500">Built by Atharv Soni</span>
      </footer>
    </div>
  );
}
