import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, ShoppingCart, Package, LogOut } from 'lucide-react';
import useAuthStore from '../../store/authStore';

const navLinks = [
  { to: '/dashboard', label: 'DASHBOARD', icon: LayoutDashboard, active: 'bg-[#FFE44D]' },
  { to: '/products', label: 'PRODUCTS', icon: ShoppingBag, active: 'bg-[#FF6EC7]' },
  { to: '/cart', label: 'CART', icon: ShoppingCart, active: 'bg-[#C8E6FF]' },
  { to: '/orders', label: 'ORDERS', icon: Package, active: 'bg-[#FFD6EC]' },
];

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <nav className="border-b-2 border-black px-8 py-4 flex justify-between items-center bg-white sticky top-0 z-50">
      <Link to="/dashboard" className="text-xl font-black tracking-tight">
        SHOP<span className="text-[#FF6EC7]">SMART</span>
      </Link>
      <div className="hidden md:flex items-center gap-1">
        {navLinks.map((l) => {
          const Icon = l.icon;
          return (
            <Link key={l.to} to={l.to}
              className={`px-4 py-2 font-black text-sm tracking-wider border-2 transition-all flex items-center gap-2 ${
                pathname === l.to
                  ? `${l.active} border-black shadow-brutal`
                  : 'border-transparent hover:border-black hover:bg-gray-50'
              }`}>
              <Icon size={15} strokeWidth={2.5} />
              {l.label}
            </Link>
          );
        })}
      </div>
      <div className="flex items-center gap-4">
        <span className="font-bold text-sm hidden md:block">{user?.name || user?.email}</span>
        <button onClick={handleLogout} className="btn-secondary text-sm px-4 py-2 flex items-center gap-2">
          <LogOut size={15} strokeWidth={2.5} /> LOGOUT
        </button>
      </div>
    </nav>
  );
}
