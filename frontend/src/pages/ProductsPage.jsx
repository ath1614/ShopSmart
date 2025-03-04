import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import api from '../lib/api';

const ProductCard = ({ product }) => (
  <Link to={`/products/${product.id}`} className="card hover:shadow-brutal-xl transition-all block">
    <div className="bg-gray-100 border-2 border-black h-48 flex items-center justify-center mb-4 text-5xl">
      🛍️
    </div>
    <div className="badge mb-2">{product.category?.name || 'GENERAL'}</div>
    <h3 className="font-black text-lg tracking-tight leading-tight mb-1">{product.name}</h3>
    <p className="text-gray-500 text-sm font-medium line-clamp-2 mb-3">{product.description}</p>
    <div className="flex justify-between items-center">
      <span className="text-2xl font-black">${Number(product.price).toFixed(2)}</span>
      <span className="text-xs font-bold text-gray-500">{product.stock} left</span>
    </div>
  </Link>
);

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/products', { params: { search, page, limit: 12 } });
      setProducts(data.products);
      setTotalPages(data.pages);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, [page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchProducts();
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="px-8 py-10 max-w-6xl mx-auto">
        <div className="flex justify-between items-end mb-8 border-b-2 border-black pb-6">
          <h1 className="text-4xl font-black tracking-tight">PRODUCTS</h1>
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              className="input w-64"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button type="submit" className="btn-primary px-6">SEARCH</button>
          </form>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="card animate-pulse h-72 bg-gray-100" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="card text-center py-20">
            <p className="font-black text-2xl text-gray-400">NO PRODUCTS FOUND.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-10">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn-secondary px-4 py-2">←</button>
            <span className="card px-6 py-2 font-black">{page} / {totalPages}</span>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="btn-secondary px-4 py-2">→</button>
          </div>
        )}
      </main>
    </div>
  );
}
