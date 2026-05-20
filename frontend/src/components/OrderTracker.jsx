import React, { useState, useEffect } from 'react';
import { getOrder } from '../api/apiService';
import { motion } from 'framer-motion';
import { RefreshCw, CheckCircle, XCircle, Clock, Package, Utensils } from 'lucide-react';

const OrderTracker = ({ orderId }) => {
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!orderId) return;

        const fetchStatus = async () => {
            try {
                const data = await getOrder(orderId);
                setOrder(data);
            } catch (err) {
                console.error("Failed to fetch order", err);
            }
        };

        fetchStatus();
        // Poll every 2 seconds
        const interval = setInterval(fetchStatus, 2000);
        return () => clearInterval(interval);
    }, [orderId]);

    if (!orderId) return null;

    const getStatusConfig = (status) => {
        switch (status) {
            case 'PLACED': return {
                icon: <Package className="w-8 h-8" />,
                color: 'bg-blue-500',
                text: 'Order Placed',
                desc: 'We have received your order.'
            };
            case 'PROCESSING': return {
                icon: <RefreshCw className="w-8 h-8 animate-spin" />,
                color: 'bg-yellow-500',
                text: 'Processing',
                desc: 'Your food is being prepared.'
            };
            case 'COMPLETED': return {
                icon: <CheckCircle className="w-8 h-8" />,
                color: 'bg-green-500',
                text: 'Completed',
                desc: 'Order is ready for pickup/delivery.'
            };
            case 'FAILED': return {
                icon: <XCircle className="w-8 h-8" />,
                color: 'bg-red-500',
                text: 'Failed',
                desc: 'Something went wrong.'
            };
            default: return { icon: <Clock />, color: 'bg-gray-500', text: 'Unknown', desc: 'Fetching status...' };
        }
    };

    const config = order ? getStatusConfig(order.status) : getStatusConfig('DEFAULT');

    return (
        <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="bg-white/70 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-white/60 h-full relative overflow-hidden"
        >
            {/* Status Header */}
            <div className="flex items-start justify-between mb-8 relative z-10">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">Order Status</h2>
                    <p className="font-mono text-sm text-gray-500 mt-1">ID: {orderId.split("-")[0]}...</p>
                </div>
                <div className={`p-3 rounded-xl shadow-lg ${config.color} text-white`}>
                    {config.icon}
                </div>
            </div>

            {order ? (
                <div className="space-y-6 relative z-10">
                    <motion.div
                        key={order.status}
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-center py-6 bg-white/50 rounded-xl border border-gray-200"
                    >
                        <h3 className="text-3xl font-black text-gray-800 mb-2">{config.text}</h3>
                        <p className="text-gray-600">{config.desc}</p>
                    </motion.div>

                    <div className="border-t border-gray-200 pt-6">
                        <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                            <Utensils className="w-5 h-5" /> Order Summary
                        </h3>
                        <ul className="space-y-3">
                            {order.items.map((item) => (
                                <li key={item.id} className="flex justify-between items-center text-gray-700 bg-white/40 p-3 rounded-lg border border-white/50">
                                    <div className="flex items-center gap-3">
                                        <span className="bg-white w-8 h-8 flex items-center justify-center rounded-lg text-sm font-bold shadow-sm">{item.quantity}</span>
                                        <span>{item.name}</span>
                                    </div>
                                    <span className="font-mono font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                                </li>
                            ))}
                        </ul>
                        <div className="flex justify-between mt-6 pt-4 border-t border-gray-200 text-xl font-bold text-gray-900">
                            <span>Total</span>
                            <span>${order.totalAmount.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-40 space-y-4">
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    <p className="text-gray-500">Loading order details...</p>
                </div>
            )}

            {/* Background Glow */}
            <div className={`absolute -top-20 -right-20 w-64 h-64 ${config.color} rounded-full mix-blend-multiply filter blur-[80px] opacity-10 transition-colors duration-1000`}></div>
        </motion.div>
    );
};

export default OrderTracker;
