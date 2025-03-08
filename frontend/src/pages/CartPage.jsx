import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import api from '../lib/api';

export default function CartPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCart = async () => {
    try { const { data } = await api.get('/cart'); setItems(data); }
    catch {} finally { setLoading(false); }
  };

  useEffect(() => { fetchCart(); }, []);

  const updateQty = async (id, quantity) => {
    if (quantity < 1) return removeItem(id);
    await api.put(`/cart/${id}`, { quantity });
    fetchCart();
  };

  const removeItem = async (id) => {
    await api.delete(`/cart/${id}`);
    fetchCart();
  };

  const checkout = async () => {
    try {
      await api.post('/orders', {
        shippingAddress: { street: '123 Main St', city: 'NYC', state: 'NY', zipCode: '10001', country: 'US' },
        paymentMethod: 'card',
      });
      navigate('/orders');
    } catch {}
  };

  const total = items.reduce((s, i) => s + Number(i.product.price) * i.quantity, 0);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="px-8 py-10 max-w-4xl mx-auto">
        <h1 className="text-4xl font-black tracking-tight mb-8 border-b-2 border-black pb-6">YOUR CART</h1>

        {loading ? (
          <div className="space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="card h-24 animate-pulse bg-gray-100" />)}</div>
        ) : items.length === 0 ? (
          <div className="card text-center py-20">
            <p className="font-black text-2xl text-gray-400 mb-4">CART IS EMPTY.</p>
            <Link to="/products" className="btn-primary inline-block">SHOP NOW →</Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="card flex gap-4 items-center">
                  <div className="bg-gray-100 border-2 border-black w-20 h-20 flex items-center justify-center text-3xl flex-shrink-0">🛍️</div>
                  <div className="flex-1">
                    <p className="font-black">{item.product.name}</p>
                    <p className="text-gray-500 text-sm font-medium">${Number(item.product.price).toFixed(2)} each</p>
                  </div>
                  <div className="flex border-2 border-black">
                    <button onClick={() => updateQty(item.id, item.quantity - 1)} className="px-3 py-1 font-black border-r-2 border-black hover:bg-black hover:text-white transition-colors">−</button>
                    <span className="px-4 py-1 font-black">{item.quantity}</span>
                    <button onClick={() => updateQty(item.id, item.quantity + 1)} className="px-3 py-1 font-black border-l-2 border-black hover:bg-black hover:text-white transition-colors">+</button>
                  </div>
                  <p className="font-black w-20 text-right">${(Number(item.product.price) * item.quantity).toFixed(2)}</p>
                  <button onClick={() => removeItem(item.id)} className="text-gray-400 hover:text-black font-black">✕</button>
                </div>
              ))}
            </div>

            <div className="card h-fit">
              <h2 className="font-black text-xl mb-4 border-b-2 border-black pb-4">ORDER SUMMARY</h2>
              <div className="space-y-2 mb-4">
                {items.map((i) => (
                  <div key={i.id} className="flex justify-between text-sm font-medium">
                    <span>{i.product.name} ×{i.quantity}</span>
                    <span>${(Number(i.product.price) * i.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t-2 border-black pt-4 mb-6">
                <div className="flex justify-between font-black text-xl">
                  <span>TOTAL</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
              <button onClick={checkout} className="btn-primary w-full text-center">CHECKOUT →</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
