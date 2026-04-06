import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, CheckCircle } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import api from '../lib/api';

export default function CartPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkedOut, setCheckedOut] = useState(false);
  const navigate = useNavigate();

  const fetchCart = async () => {
    try { const { data } = await api.get('/cart'); setItems(data); }
    catch (err) { console.error(err); } finally { setLoading(false); }
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
        shippingAddress: JSON.stringify({ street: '123 Main St', city: 'NYC', state: 'NY', zipCode: '10001', country: 'US' }),
        paymentMethod: 'card',
      });
      setCheckedOut(true);
      setTimeout(() => navigate('/orders'), 1500);
    } catch (err) { console.error(err); }
  };

  const total = items.reduce((s, i) => s + Number(i.product.price) * i.quantity, 0);

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Navbar />
      <main className="px-8 py-10 max-w-4xl mx-auto">
        <div className="bg-[#C8E6FF] border-2 border-black shadow-brutal p-6 mb-8 flex items-center gap-4">
          <div className="w-12 h-12 bg-black flex items-center justify-center">
            <ShoppingCart size={24} color="white" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-4xl font-black tracking-tight">YOUR CART</h1>
            <p className="text-gray-600 font-medium">{items.length} item{items.length !== 1 ? 's' : ''}</p>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="border-2 border-black shadow-brutal h-24 animate-pulse bg-gray-100" />)}</div>
        ) : items.length === 0 ? (
          <div className="bg-[#FFF9C4] border-2 border-black shadow-brutal text-center py-20">
            <ShoppingCart size={56} className="mx-auto mb-4 text-gray-300" strokeWidth={1.5} />
            <p className="font-black text-2xl text-gray-500 mb-4">CART IS EMPTY.</p>
            <Link to="/products" className="btn-pink inline-flex items-center gap-2">SHOP NOW <ArrowRight size={16} /></Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-4">
              {items.map((item, i) => {
                const firstImage = item.product.images?.split(',')[0];
                return (
                  <div key={item.id} className={`${i % 2 === 0 ? 'bg-white' : 'bg-[#FFF9C4]'} border-2 border-black shadow-brutal flex gap-4 items-center p-4`}>
                    <div className="border-2 border-black w-20 h-20 flex-shrink-0 overflow-hidden">
                      {firstImage
                        ? <img src={firstImage} alt={item.product.name} className="w-full h-full object-cover" />
                        : <div className="w-full h-full bg-gray-100" />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-black truncate">{item.product.name}</p>
                      <p className="text-gray-500 text-sm font-medium">${Number(item.product.price).toFixed(2)} each</p>
                    </div>
                    <div className="flex border-2 border-black">
                      <button onClick={() => updateQty(item.id, item.quantity - 1)} className="px-3 py-2 border-r-2 border-black hover:bg-[#FF6EC7] transition-colors">
                        <Minus size={14} strokeWidth={2.5} />
                      </button>
                      <span className="px-4 py-2 font-black">{item.quantity}</span>
                      <button onClick={() => updateQty(item.id, item.quantity + 1)} className="px-3 py-2 border-l-2 border-black hover:bg-[#FF6EC7] transition-colors">
                        <Plus size={14} strokeWidth={2.5} />
                      </button>
                    </div>
                    <p className="font-black w-20 text-right">${(Number(item.product.price) * item.quantity).toFixed(2)}</p>
                    <button onClick={() => removeItem(item.id)} className="text-gray-300 hover:text-[#FF6EC7] transition-colors">
                      <Trash2 size={18} strokeWidth={2} />
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="bg-[#FFE44D] border-2 border-black shadow-brutal p-6 h-fit">
              <h2 className="font-black text-xl mb-4 border-b-2 border-black pb-4">ORDER SUMMARY</h2>
              <div className="space-y-2 mb-4">
                {items.map((i) => (
                  <div key={i.id} className="flex justify-between text-sm font-medium">
                    <span className="truncate mr-2">{i.product.name} ×{i.quantity}</span>
                    <span className="font-black">${(Number(i.product.price) * i.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t-2 border-black pt-4 mb-6">
                <div className="flex justify-between font-black text-2xl">
                  <span>TOTAL</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
              <button onClick={checkout}
                className={`w-full font-black py-4 border-2 border-black shadow-brutal hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all uppercase tracking-wider flex items-center justify-center gap-2 ${checkedOut ? 'bg-[#D4F5D4]' : 'bg-black text-white'}`}>
                {checkedOut ? <><CheckCircle size={18} /> ORDER PLACED!</> : <>CHECKOUT <ArrowRight size={18} /></>}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
