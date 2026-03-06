import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import api from '../lib/api';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    api.get(`/products/${id}`).then(({ data }) => setProduct(data)).catch(() => navigate('/products'));
  }, [id]);

  const addToCart = async () => {
    try {
      await api.post('/cart', { productId: id, quantity: qty });
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch {}
  };

  if (!product) return (
    <div className="min-h-screen bg-white"><Navbar />
      <div className="flex items-center justify-center h-96">
        <p className="font-black text-2xl animate-pulse">LOADING...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="px-8 py-10 max-w-5xl mx-auto">
        <button onClick={() => navigate(-1)} className="btn-secondary mb-8 text-sm px-4 py-2">← BACK</button>
        <div className="grid md:grid-cols-2 gap-10">
          <div className="bg-gray-100 border-2 border-black h-96 flex items-center justify-center text-8xl shadow-brutal">
            🛍️
          </div>
          <div>
            <div className="badge mb-3">{product.category?.name || 'GENERAL'}</div>
            <h1 className="text-4xl font-black tracking-tight mb-3">{product.name}</h1>
            <p className="text-gray-600 font-medium mb-6">{product.description}</p>
            <div className="text-5xl font-black mb-6">${Number(product.price).toFixed(2)}</div>
            <p className="text-sm font-bold text-gray-500 mb-6">{product.stock} IN STOCK</p>

            <div className="flex items-center gap-4 mb-6">
              <label className="font-black text-sm uppercase">QTY</label>
              <div className="flex border-2 border-black">
                <button onClick={() => setQty(q => Math.max(1, q - 1))} className="px-4 py-2 font-black border-r-2 border-black hover:bg-black hover:text-white transition-colors">−</button>
                <span className="px-6 py-2 font-black">{qty}</span>
                <button onClick={() => setQty(q => Math.min(product.stock, q + 1))} className="px-4 py-2 font-black border-l-2 border-black hover:bg-black hover:text-white transition-colors">+</button>
              </div>
            </div>

            <button onClick={addToCart} className="btn-primary w-full text-lg py-4">
              {added ? '✓ ADDED TO CART' : 'ADD TO CART →'}
            </button>
          </div>
        </div>

        {product.reviews?.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-black mb-6 border-b-2 border-black pb-4">REVIEWS ({product.reviews.length})</h2>
            <div className="space-y-4">
              {product.reviews.map((r) => (
                <div key={r.id} className="card">
                  <div className="flex justify-between mb-2">
                    <span className="font-black">{r.user?.name || 'Anonymous'}</span>
                    <span className="badge">{'★'.repeat(r.rating)}</span>
                  </div>
                  <p className="font-medium text-gray-600">{r.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
