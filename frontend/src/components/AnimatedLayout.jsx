import React from 'react';
import { motion } from 'framer-motion';

const AnimatedLayout = ({ children }) => {
    return (
        <div
            className="min-h-screen flex flex-col items-center py-10 px-4 overflow-hidden relative bg-cover bg-center bg-no-repeat fixed inset-0 font-sans text-gray-900"
            style={{ backgroundImage: "url('/bg.png')" }}
        >
            {/* Light Overlay with Blur */}
            <div className="absolute inset-0 bg-white/60 backdrop-blur-md z-0"></div>

            {/* Animated Elements */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="relative z-10 w-full max-w-4xl"
            >
                {children}
            </motion.div>
        </div>
    );
};

export default AnimatedLayout;
