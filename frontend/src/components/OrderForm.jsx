import React, { useState } from 'react';
import { createOrder } from '../api/apiService';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, ShoppingBag, Trash2 } from 'lucide-react';

const OrderForm = ({ onOrderCreated }) => {
    const [items, setItems] = useState([{ name: 'Burger', quantity: 1, price: 12.99 }]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleAddItem = () => {
        setItems([...items, { name: '', quantity: 1, price: 0 }]);
    };

    const handleRemoveItem = (index) => {
        if (items.length > 1) {
            const newItems = items.filter((_, i) => i !== index);
            setItems(newItems);
        }
    };

    const handleChange = (index, field, value) => {
        const newItems = [...items];
        newItems[index][field] = value;
        setItems(newItems);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const totalAmount = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
            const orderData = {
                items: items,
                totalAmount: totalAmount
            };
            const response = await createOrder(orderData);
            onOrderCreated(response);
            setItems([{ name: 'Burger', quantity: 1, price: 12.99 }]); // Reset to default
        } catch (err) {
            setError('Failed to place order.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="bg-white/70 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-white/60"
        >
            <div className="flex items-center gap-3 mb-6 border-b border-gray-200 pb-4">
                <ShoppingBag className="text-primary" />
                <h2 className="text-2xl font-bold text-gray-900">New Order</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <AnimatePresence>
                    {items.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="flex gap-3 items-center group"
                        >
                            <input
                                type="text"
                                placeholder="Item Name"
                                className="flex-1 p-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary shadow-sm transition-all"
                                value={item.name}
                                onChange={(e) => handleChange(index, 'name', e.target.value)}
                                required
                            />
                            <div className="flex gap-1">
                                <input
                                    type="number"
                                    min="1"
                                    placeholder="Qty"
                                    className="w-16 p-3 bg-white border border-gray-200 rounded-xl text-gray-900 text-center focus:outline-none focus:ring-2 focus:ring-primary shadow-sm transition-all"
                                    value={item.quantity}
                                    onChange={(e) => handleChange(index, 'quantity', parseInt(e.target.value) || 0)}
                                    required
                                />
                                <div className="relative">
                                    <span className="absolute left-3 top-3 text-gray-400">$</span>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        placeholder="0.00"
                                        className="w-24 pl-6 p-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary shadow-sm transition-all"
                                        value={item.price}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            if (/^\d*\.?\d{0,2}$/.test(val)) {
                                                handleChange(index, 'price', val);
                                            }
                                        }}
                                        onBlur={(e) => {
                                            const val = parseFloat(e.target.value) || 0;
                                            handleChange(index, 'price', val.toFixed(2));
                                        }}
                                        required
                                    />
                                </div>
                            </div>
                            {items.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => handleRemoveItem(index)}
                                    className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors opacity-0 group-hover:opacity-100"
                                >
                                    <Trash2 size={18} />
                                </button>
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>

                <button
                    type="button"
                    onClick={handleAddItem}
                    className="flex items-center gap-2 text-sm text-primary font-bold hover:text-red-500 transition-colors py-2"
                >
                    <Plus size={16} /> Add Another Item
                </button>

                {error && <p className="text-red-600 text-sm bg-red-100 p-2 rounded border border-red-200">{error}</p>}

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white py-4 rounded-xl font-bold shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 disabled:opacity-50 transition-all mt-4"
                >
                    {loading ? (
                        <span className="flex items-center justify-center gap-2">
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Placing Order...
                        </span>
                    ) : 'Submit Order'}
                </motion.button>
            </form>
        </motion.div>
    );
};

export default OrderForm;
