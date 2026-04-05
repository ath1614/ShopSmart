import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import api from '../lib/api';

const CARD_COLORS = ['bg-white', 'bg-[#FFF9C4]', 'bg-[#FFD6EC]', 'bg-[#C8E6FF]'];

const ProductCard = ({ product, index }) => {
  const firstImage = product.images?.split(',')[0];
  const bg = CARD_COLORS[index % CARD_COLORS.length];

  return (
    <Link to={`/products/${product.id}`}
      className={`${bg} border-2 border-black shadow-brutal hover:shadow-brutal-xl hover:-translate-y-1 transition-all block`}>
      <div className="border-b-2 border-black h-52 overflow-hidden">
        {firstImage ? (
          <img src={firstImage} alt={product.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl bg-gray-100">🛍️</div>
        )}
      </div>
      <div className="p-4">
        <div className="badge-pink mb-2">{product.category?.name || 'GENERAL'}</div>
        <h3 className="font-black text-base tracking-tight leading-tight mb-1">{product.name}</h3>
        <p className="text-gray-500 text-xs font-medium line-clamp-2 mb-3">{product.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-2xl font-black">${Number(product.price).toFixed(2)}</span>
          <span className="text-xs font-black bg-black text-white px-2 py-1">{product.stock} LEFT</span>
        </div>
      </div>
    </Link>
  );
};

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchProducts = async (q = search, p = page) => {
    setLoading(true);
    try {
      const { data } = await api.get('/products', { params: { search: q, page: p, limit: 12 } });
      setProducts(data.products);
      setTotalPages(data.pages);
      setTotal(data.total);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchProducts(search, page); }, [page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchProducts(search, 1);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Navbar />
      <main className="px-8 py-10 max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-black tracking-tight">PRODUCTS</h1>
            <p className="text-gray-500 font-medium">{total} items available</p>
          </div>
          <form onSubmit={handleSearch} className="flex gap-2">
            <input className="input w-64" placeholder="Search products..." value={search}
              onChange={(e) => setSearch(e.target.value)} />
            <button type="submit" className="btn-pink px-6">SEARCH</button>
          </form>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="border-2 border-black shadow-brutal h-80 animate-pulse bg-gray-100" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="card-yellow text-center py-20">
            <p className="font-black text-2xl text-gray-500">NO PRODUCTS FOUND.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-10">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn-secondary px-4 py-2">←</button>
            <span className="bg-[#FFE44D] border-2 border-black shadow-brutal px-6 py-2 font-black">{page} / {totalPages}</span>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="btn-secondary px-4 py-2">→</button>
          </div>
        )}
      </main>
    </div>
  );
}
