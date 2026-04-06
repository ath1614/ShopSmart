import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../lib/api';
import useAuthStore from '../store/authStore';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/auth/register', form);
      setAuth(data.user, data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <nav className="border-b-2 border-black px-8 py-4">
        <Link to="/" className="text-2xl font-black tracking-tight">SHOP<span className="text-[#FF6EC7]">SMART</span></Link>
      </nav>
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="bg-white border-2 border-black shadow-brutal p-6">
            <h1 className="text-3xl font-black mb-2 tracking-tight">CREATE ACCOUNT</h1>
            <p className="text-gray-500 font-medium mb-8">Join ShopSmart today.</p>

            {error && (
              <div className="bg-[#FF6EC7] border-2 border-black font-bold px-4 py-3 mb-6 text-sm">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-black text-sm mb-2 uppercase tracking-wider">Full Name</label>
                <input
                  type="text"
                  className="input"
                  placeholder="Your name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block font-black text-sm mb-2 uppercase tracking-wider">Email</label>
                <input
                  type="email"
                  className="input"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block font-black text-sm mb-2 uppercase tracking-wider">Password</label>
                <input
                  type="password"
                  className="input"
                  placeholder="Min 8 characters"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  minLength={8}
                  required
                />
              </div>
              <button type="submit" disabled={loading} className="btn-pink w-full text-center">
                {loading ? 'CREATING...' : 'CREATE ACCOUNT →'}
              </button>
            </form>

            <div className="my-6 flex items-center gap-4">
              <div className="flex-1 border-t-2 border-black" />
              <span className="font-black text-sm">OR</span>
              <div className="flex-1 border-t-2 border-black" />
            </div>

            <div className="space-y-3">
              <a href="/api/auth/google" className="btn-secondary w-full text-center block">
                SIGN UP WITH GOOGLE
              </a>
              <a href="/api/auth/github" className="btn-secondary w-full text-center block">
                SIGN UP WITH GITHUB
              </a>
            </div>

            <p className="mt-6 text-center font-medium text-sm">
              Already have an account?{' '}
              <Link to="/login" className="font-black underline">SIGN IN</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
