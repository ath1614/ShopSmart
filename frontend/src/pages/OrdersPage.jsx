import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import api from '../lib/api';

const STATUS_STYLE = {
  PENDING: 'bg-[#FFF9C4]',
  CONFIRMED: 'bg-[#C8E6FF]',
  PROCESSING: 'bg-[#FFD6EC]',
  SHIPPED: 'bg-[#C8E6FF]',
  DELIVERED: 'bg-[#D4F5D4]',
  CANCELLED: 'bg-gray-200',
  REFUNDED: 'bg-gray-200',
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    api.get('/orders').then(({ data }) => setOrders(data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Navbar />
      <main className="px-8 py-10 max-w-4xl mx-auto">
        <div className="bg-[#FFD6EC] border-2 border-black shadow-brutal p-6 mb-8 flex items-center gap-4">
          <div className="w-12 h-12 bg-black flex items-center justify-center">
            <Package size={24} color="white" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-4xl font-black tracking-tight">MY ORDERS</h1>
            <p className="text-gray-600 font-medium">{orders.length} order{orders.length !== 1 ? 's' : ''} total</p>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="border-2 border-black shadow-brutal h-24 animate-pulse bg-gray-100" />)}</div>
        ) : orders.length === 0 ? (
          <div className="bg-[#FFF9C4] border-2 border-black shadow-brutal text-center py-20">
            <Package size={56} className="mx-auto mb-4 text-gray-300" strokeWidth={1.5} />
            <p className="font-black text-2xl text-gray-500 mb-4">NO ORDERS YET.</p>
            <Link to="/products" className="btn-pink inline-flex items-center gap-2">START SHOPPING <ArrowRight size={16} /></Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, i) => (
              <div key={order.id} className={`${i % 2 === 0 ? 'bg-white' : 'bg-[#FFF9C4]'} border-2 border-black shadow-brutal`}>
                <div className="flex justify-between items-center p-4 cursor-pointer"
                  onClick={() => setExpanded(expanded === order.id ? null : order.id)}>
                  <div>
                    <p className="font-black">#{order.id.slice(-8).toUpperCase()}</p>
                    <p className="text-gray-500 text-sm font-medium">
                      {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-black px-3 py-1 border-2 border-black ${STATUS_STYLE[order.status]}`}>
                      {order.status}
                    </span>
                    <span className="font-black text-xl">${Number(order.total).toFixed(2)}</span>
                    {expanded === order.id
                      ? <ChevronUp size={18} strokeWidth={2.5} />
                      : <ChevronDown size={18} strokeWidth={2.5} />}
                  </div>
                </div>

                {expanded === order.id && (
                  <div className="border-t-2 border-black p-4 space-y-3 bg-[#FAFAFA]">
                    {order.items.map((item) => {
                      const firstImage = item.product?.images?.split(',')[0];
                      return (
                        <div key={item.id} className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <div className="border-2 border-black w-12 h-12 overflow-hidden flex-shrink-0">
                              {firstImage
                                ? <img src={firstImage} alt={item.product?.name} className="w-full h-full object-cover" />
                                : <div className="w-full h-full bg-gray-100" />
                              }
                            </div>
                            <div>
                              <p className="font-black text-sm">{item.product?.name}</p>
                              <p className="text-gray-500 text-xs font-medium">Qty: {item.quantity}</p>
                            </div>
                          </div>
                          <p className="font-black">${(Number(item.price) * item.quantity).toFixed(2)}</p>
                        </div>
                      );
                    })}
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
