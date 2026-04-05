import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, CreditCard, ShoppingCart, CheckCircle, ShoppingBag, Settings, ArrowRight } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import useAuthStore from '../store/authStore';
import api from '../lib/api';

const STATUS_BG = {
  PENDING: 'bg-[#FFF9C4]',
  CONFIRMED: 'bg-[#C8E6FF]',
  PROCESSING: 'bg-[#FFD6EC]',
  SHIPPED: 'bg-[#C8E6FF]',
  DELIVERED: 'bg-[#D4F5D4]',
  CANCELLED: 'bg-gray-200',
  REFUNDED: 'bg-gray-200',
};

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const [orders, setOrders] = useState([]);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    api.get('/orders').then(({ data }) => setOrders(data)).catch(() => {});
    api.get('/cart').then(({ data }) => setCartCount(data.length)).catch(() => {});
  }, []);

  const totalSpent = orders.reduce((s, o) => s + Number(o.total), 0);

  const stats = [
    { label: 'Total Orders', value: orders.length, bg: 'bg-[#FFE44D]', icon: Package },
    { label: 'Total Spent', value: `$${totalSpent.toFixed(2)}`, bg: 'bg-[#FFD6EC]', icon: CreditCard },
    { label: 'Cart Items', value: cartCount, bg: 'bg-[#C8E6FF]', icon: ShoppingCart },
    { label: 'Status', value: 'ACTIVE', bg: 'bg-[#D4F5D4]', icon: CheckCircle },
  ];

  const actions = [
    { to: '/products', icon: ShoppingBag, label: 'Browse Products', bg: 'bg-[#FFD6EC]' },
    { to: '/cart', icon: ShoppingCart, label: 'View Cart', bg: 'bg-[#FFF9C4]' },
    { to: '/orders', icon: Package, label: 'My Orders', bg: 'bg-[#C8E6FF]' },
    { to: '/products', icon: Settings, label: 'New Arrivals', bg: 'bg-[#D4F5D4]' },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Navbar />
      <main className="px-8 py-10 max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-10 bg-[#FFE44D] border-2 border-black shadow-brutal p-8">
          <div className="badge-pink mb-3">{user?.role}</div>
          <h1 className="text-5xl font-black tracking-tight">
            WELCOME BACK{user?.name ? `, ${user.name.toUpperCase().split(' ')[0]}` : ''}.
          </h1>
          <p className="text-gray-700 font-medium mt-2">Here's what's happening with your account today.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {stats.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className={`${s.bg} border-2 border-black shadow-brutal p-5`}>
                <div className="w-10 h-10 bg-black flex items-center justify-center mb-3">
                  <Icon size={20} color="white" strokeWidth={2.5} />
                </div>
                <p className="text-xs font-black uppercase tracking-widest text-gray-600 mb-1">{s.label}</p>
                <p className="text-3xl font-black">{s.value}</p>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="mb-10">
          <h2 className="text-2xl font-black mb-4 tracking-tight">QUICK ACTIONS</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {actions.map((a) => {
              const Icon = a.icon;
              return (
                <Link key={a.label} to={a.to}
                  className={`${a.bg} border-2 border-black shadow-brutal p-6 text-center hover:shadow-brutal-xl hover:-translate-y-1 transition-all`}>
                  <div className="w-12 h-12 bg-black flex items-center justify-center mx-auto mb-3">
                    <Icon size={22} color="white" strokeWidth={2.5} />
                  </div>
                  <p className="font-black text-sm uppercase tracking-wide">{a.label}</p>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Recent Orders */}
        <div>
          <h2 className="text-2xl font-black mb-4 tracking-tight">RECENT ORDERS</h2>
          {orders.length === 0 ? (
            <div className="bg-[#FFD6EC] border-2 border-black shadow-brutal text-center py-12">
              <Package size={48} className="mx-auto mb-4 text-gray-400" strokeWidth={1.5} />
              <p className="text-gray-600 font-black text-lg mb-4">NO ORDERS YET.</p>
              <Link to="/products" className="btn-pink inline-flex items-center gap-2">
                SHOP NOW <ArrowRight size={16} />
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.slice(0, 5).map((o, i) => (
                <div key={o.id} className={`${i % 2 === 0 ? 'bg-white' : 'bg-[#FFF9C4]'} border-2 border-black shadow-brutal flex justify-between items-center p-4`}>
                  <div>
                    <p className="font-black text-sm">#{o.id.slice(-8).toUpperCase()}</p>
                    <p className="text-gray-500 text-xs font-medium">{new Date(o.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-black px-3 py-1 border-2 border-black ${STATUS_BG[o.status]}`}>{o.status}</span>
                    <p className="font-black">${Number(o.total).toFixed(2)}</p>
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
