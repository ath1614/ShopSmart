import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

const navLinks = [
  { to: '/dashboard', label: 'DASHBOARD' },
  { to: '/products', label: 'PRODUCTS' },
  { to: '/cart', label: 'CART' },
  { to: '/orders', label: 'ORDERS' },
];

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <nav className="border-b-2 border-black px-8 py-4 flex justify-between items-center bg-white sticky top-0 z-50">
      <Link to="/dashboard" className="text-xl font-black tracking-tight">SHOPSMART</Link>
      <div className="hidden md:flex items-center gap-1">
        {navLinks.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            className={`px-4 py-2 font-black text-sm tracking-wider border-2 transition-all ${
              pathname === l.to
                ? 'bg-black text-white border-black'
                : 'border-transparent hover:border-black'
            }`}
          >
            {l.label}
          </Link>
        ))}
      </div>
      <div className="flex items-center gap-4">
        <span className="font-bold text-sm hidden md:block">{user?.name || user?.email}</span>
        <button onClick={handleLogout} className="btn-secondary text-sm px-4 py-2">LOGOUT</button>
      </div>
    </nav>
  );
}
