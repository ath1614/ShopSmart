import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../lib/api';
import useAuthStore from '../store/authStore';

export default function OAuthCallback() {
  const [params] = useSearchParams();
  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();

  useEffect(() => {
    const token = params.get('token');
    if (!token) return navigate('/login');
    api.get('/users/me', { headers: { Authorization: `Bearer ${token}` } })
      .then(({ data }) => { setAuth(data, token); navigate('/dashboard'); })
      .catch(() => navigate('/login'));
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="card text-center">
        <div className="text-4xl mb-4">⚡</div>
        <p className="font-black text-xl">AUTHENTICATING...</p>
      </div>
    </div>
  );
}
