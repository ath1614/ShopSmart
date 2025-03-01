import React, { useEffect, useState } from 'react';
import Navbar from '../components/layout/Navbar';
import useAuthStore from '../store/authStore';
import api from '../lib/api';
import { Link } from 'react-router-dom';

const StatCard = ({ label, value, sub }) => (
  <div className="card">
    <p className="text-xs font-black uppercase tracking-widest text-gray-500 mb-1">{label}</p>
    <p className="text-4xl font-black tracking-tight">{value}</p>
    {sub && <p className="text-sm font-medium text-gray-500 mt-1">{sub}</p>}
  </div>
);

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const [orders, setOrders] = useState([]);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    api.get('/orders').then(({ data }) => setOrders(data)).catch(() => {});
    api.get('/cart').then(({ data }) => setCartCount(data.length)).catch(() => {});
  }, []);

  const totalSpent = orders.reduce((s, o) => s + Number(o.total), 0);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="px-8 py-10 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10 border-b-2 border-black pb-8">
          <div className="badge mb-3">{user?.role}</div>
          <h1 className="text-5xl font-black tracking-tight">
            WELCOME BACK{user?.name ? `, ${user.name.toUpperCase()}` : ''}.
          </h1>
          <p className="text-gray-500 font-medium mt-2">Here's what's happening with your account.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <StatCard label="Total Orders" value={orders.length} />
          <StatCard label="Total Spent" value={`$${totalSpent.toFixed(2)}`} />
          <StatCard label="Cart Items" value={cartCount} />
          <StatCard label="Account Status" value="ACTIVE" sub="Verified" />
        </div>

        {/* Quick Actions */}
        <div className="mb-10">
          <h2 className="text-2xl font-black mb-4 tracking-tight">QUICK ACTIONS</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link to="/products" className="card hover:shadow-brutal-xl transition-all text-center">
              <div className="text-3xl mb-2">🛍️</div>
              <p className="font-black text-sm uppercase">Browse Products</p>
            </Link>
            <Link to="/cart" className="card hover:shadow-brutal-xl transition-all text-center">
              <div className="text-3xl mb-2">🛒</div>
              <p className="font-black text-sm uppercase">View Cart</p>
            </Link>
            <Link to="/orders" className="card hover:shadow-brutal-xl transition-all text-center">
              <div className="text-3xl mb-2">📦</div>
              <p className="font-black text-sm uppercase">My Orders</p>
            </Link>
            <div className="card hover:shadow-brutal-xl transition-all text-center cursor-pointer">
              <div className="text-3xl mb-2">⚙️</div>
              <p className="font-black text-sm uppercase">Settings</p>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div>
          <h2 className="text-2xl font-black mb-4 tracking-tight">RECENT ORDERS</h2>
          {orders.length === 0 ? (
            <div className="card text-center py-12">
              <p className="text-gray-400 font-black text-lg">NO ORDERS YET.</p>
              <Link to="/products" className="btn-primary mt-4 inline-block">SHOP NOW →</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.slice(0, 5).map((o) => (
                <div key={o.id} className="card flex justify-between items-center">
                  <div>
                    <p className="font-black text-sm">#{o.id.slice(-8).toUpperCase()}</p>
                    <p className="text-gray-500 text-xs font-medium">{new Date(o.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <span className="badge">{o.status}</span>
                    <p className="font-black mt-1">${Number(o.total).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
