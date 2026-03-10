import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import api from '../lib/api';

const STATUS_COLORS = {
  PENDING: 'bg-gray-200 text-black',
  CONFIRMED: 'bg-black text-white',
  PROCESSING: 'bg-black text-white',
  SHIPPED: 'bg-black text-white',
  DELIVERED: 'bg-black text-white',
  CANCELLED: 'bg-gray-400 text-white',
  REFUNDED: 'bg-gray-400 text-white',
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    api.get('/orders')
      .then(({ data }) => setOrders(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="px-8 py-10 max-w-4xl mx-auto">
        <h1 className="text-4xl font-black tracking-tight mb-8 border-b-2 border-black pb-6">MY ORDERS</h1>

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="card h-24 animate-pulse bg-gray-100" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="card text-center py-20">
            <p className="font-black text-2xl text-gray-400 mb-4">NO ORDERS YET.</p>
            <Link to="/products" className="btn-primary inline-block">START SHOPPING →</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="card">
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                >
                  <div>
                    <p className="font-black">#{order.id.slice(-8).toUpperCase()}</p>
                    <p className="text-gray-500 text-sm font-medium">
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric', month: 'long', day: 'numeric',
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`text-xs font-black px-3 py-1 border-2 border-black ${STATUS_COLORS[order.status]}`}>
                      {order.status}
                    </span>
                    <span className="font-black text-xl">${Number(order.total).toFixed(2)}</span>
                    <span className="font-black text-gray-400">{expanded === order.id ? '▲' : '▼'}</span>
                  </div>
                </div>

                {expanded === order.id && (
                  <div className="mt-4 pt-4 border-t-2 border-black space-y-3">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className="bg-gray-100 border-2 border-black w-12 h-12 flex items-center justify-center text-xl">
                            🛍️
                          </div>
                          <div>
                            <p className="font-black text-sm">{item.product?.name}</p>
                            <p className="text-gray-500 text-xs font-medium">Qty: {item.quantity}</p>
                          </div>
                        </div>
                        <p className="font-black">${(Number(item.price) * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                    <div className="border-t-2 border-black pt-3 flex justify-between font-black">
                      <span>TOTAL</span>
                      <span>${Number(order.total).toFixed(2)}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
