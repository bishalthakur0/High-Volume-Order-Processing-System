import React, { useState, useEffect } from 'react';
import OrderForm from './components/OrderForm';
import OrderTracker from './components/OrderTracker';
import AnimatedLayout from './components/AnimatedLayout';
import { motion } from 'framer-motion';
import { Utensils, Search } from 'lucide-react';

function App() {
  const [currentOrderId, setCurrentOrderId] = useState(null);
  const [trackInput, setTrackInput] = useState('');

  // Check URL params on load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (id) {
      setCurrentOrderId(id);
      setTrackInput(id);
    }
  }, []);

  const handleTrack = () => {
    if (trackInput.trim()) {
      setCurrentOrderId(trackInput.trim());
    }
  };

  return (
    <AnimatedLayout>
      <header className="mb-12 text-center">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="flex items-center justify-center gap-3 mb-2"
        >
          <div className="p-3 bg-white/80 rounded-full backdrop-blur-sm shadow-md">
            <Utensils className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-5xl font-black text-gray-900 drop-shadow-sm tracking-tight">
            FoodQueue
          </h1>
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-gray-700 text-lg font-medium tracking-wide"
        >
          Real-time Asynchronous Event Processor
        </motion.p>
      </header>

      <main className="grid md:grid-cols-2 gap-8 items-start">
        <div className="w-full">
          <OrderForm onOrderCreated={(order) => {
            setCurrentOrderId(order.id);
            // Optional: Update URL without reload
            window.history.pushState({}, '', `?id=${order.id}`);
          }} />
        </div>

        <div className="w-full">
          <motion.div
            layout
            transition={{ duration: 0.5 }}
          >
            {currentOrderId ? (
              <OrderTracker orderId={currentOrderId} />
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/60 backdrop-blur-xl p-10 rounded-2xl shadow-xl border border-white/50 text-center text-gray-600"
              >
                <p className="text-lg font-medium">Place an order or track an existing one.</p>
              </motion.div>
            )}
          </motion.div>

          {/* Manual Lookup */}
          <motion.div
            className="mt-8 pt-8 border-t border-gray-300/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <p className="text-sm text-gray-600 mb-2 uppercase tracking-wider font-bold">Track by ID</p>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter UUID..."
                value={trackInput}
                onChange={(e) => setTrackInput(e.target.value)}
                className="flex-1 p-4 bg-white/80 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary shadow-sm transition-all"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleTrack();
                }}
              />
              <button
                onClick={handleTrack}
                className="bg-gray-800 hover:bg-gray-900 text-white p-4 rounded-xl transition-colors font-bold flex items-center gap-2"
              >
                <Search size={20} />
              </button>
            </div>
          </motion.div>
        </div>
      </main>
    </AnimatedLayout>
  );
}

export default App;
