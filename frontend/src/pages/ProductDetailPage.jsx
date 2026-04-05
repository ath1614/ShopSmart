import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Star, CheckCircle, Minus, Plus } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import api from '../lib/api';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeImg, setActiveImg] = useState(0);

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
    <div className="min-h-screen bg-[#FAFAFA]"><Navbar />
      <div className="flex items-center justify-center h-96">
        <div className="bg-[#FFE44D] border-2 border-black shadow-brutal px-10 py-6">
          <p className="font-black text-2xl animate-pulse">LOADING...</p>
        </div>
      </div>
    </div>
  );

  const images = product.images?.split(',').filter(Boolean) || [];

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Navbar />
      <main className="px-8 py-10 max-w-5xl mx-auto">
        <button onClick={() => navigate(-1)} className="btn-secondary mb-8 text-sm px-4 py-2 flex items-center gap-2">
          <ArrowLeft size={16} strokeWidth={2.5} /> BACK
        </button>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Images */}
          <div>
            <div className="border-2 border-black shadow-brutal h-96 overflow-hidden mb-3 bg-gray-100">
              {images[activeImg] ? (
                <img src={images[activeImg]} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&q=80" alt="product" className="w-full h-full object-cover" />
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setActiveImg(i)}
                    className={`border-2 border-black w-20 h-20 overflow-hidden transition-all ${activeImg === i ? 'shadow-brutal' : 'opacity-50 hover:opacity-100'}`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <div className="badge-pink mb-3">{product.category?.name || 'GENERAL'}</div>
            <h1 className="text-4xl font-black tracking-tight mb-3">{product.name}</h1>
            <p className="text-gray-600 font-medium mb-6">{product.description}</p>

            <div className="bg-[#FFE44D] border-2 border-black shadow-brutal inline-block px-6 py-3 mb-6">
              <span className="text-4xl font-black">${Number(product.price).toFixed(2)}</span>
            </div>

            <div className="mb-6">
              <span className={`inline-flex items-center gap-2 px-3 py-1 border-2 border-black font-black text-sm ${product.stock > 10 ? 'bg-[#D4F5D4]' : 'bg-[#FFD6EC]'}`}>
                <CheckCircle size={14} strokeWidth={2.5} />
                {product.stock > 0 ? `${product.stock} IN STOCK` : 'OUT OF STOCK'}
              </span>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <label className="font-black text-sm uppercase">QTY</label>
              <div className="flex border-2 border-black shadow-brutal">
                <button onClick={() => setQty(q => Math.max(1, q - 1))}
                  className="px-4 py-2 border-r-2 border-black hover:bg-[#FF6EC7] transition-colors flex items-center">
                  <Minus size={16} strokeWidth={2.5} />
                </button>
                <span className="px-6 py-2 font-black bg-white">{qty}</span>
                <button onClick={() => setQty(q => Math.min(product.stock, q + 1))}
                  className="px-4 py-2 border-l-2 border-black hover:bg-[#FF6EC7] transition-colors flex items-center">
                  <Plus size={16} strokeWidth={2.5} />
                </button>
              </div>
            </div>

            <button onClick={addToCart} disabled={product.stock === 0}
              className={`w-full text-lg py-4 font-black border-2 border-black shadow-brutal hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all uppercase tracking-wider flex items-center justify-center gap-3 ${added ? 'bg-[#D4F5D4]' : 'bg-[#FF6EC7]'}`}>
              {added ? <><CheckCircle size={20} strokeWidth={2.5} /> ADDED TO CART</> : <><ShoppingCart size={20} strokeWidth={2.5} /> ADD TO CART</>}
            </button>
          </div>
        </div>

        {/* Reviews */}
        {product.reviews?.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-black mb-6 border-b-2 border-black pb-4">
              REVIEWS <span className="text-[#FF6EC7]">({product.reviews.length})</span>
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {product.reviews.map((r, i) => (
                <div key={r.id} className={`${i % 2 === 0 ? 'bg-[#FFF9C4]' : 'bg-[#FFD6EC]'} border-2 border-black shadow-brutal p-4`}>
                  <div className="flex justify-between mb-2">
                    <span className="font-black">{r.user?.name || 'Anonymous'}</span>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, si) => (
                        <Star key={si} size={14} strokeWidth={2}
                          className={si < r.rating ? 'fill-[#FF6EC7] text-[#FF6EC7]' : 'text-gray-300'} />
                      ))}
                    </div>
                  </div>
                  {r.title && <p className="font-black text-sm mb-1">{r.title}</p>}
                  <p className="font-medium text-gray-600 text-sm">{r.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
