import React from 'react';
import { motion } from 'framer-motion';

interface FastImageCanvasProps {
    imageUrl: string;
}

// Fallback component - Much faster than Three.js
export const FastImageCanvas: React.FC<FastImageCanvasProps> = ({ imageUrl }) => {
    return (
        <motion.div
            className="w-full h-full relative"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
        >
            {/* Golden Frame */}
            <div className="absolute inset-0 -z-10">
                <div className="w-full h-full border-8 border-[#d4af37] rounded-sm shadow-2xl transform rotate-0 hover:rotate-1 transition-transform duration-500" />
            </div>

            {/* Image with subtle 3D effect */}
            <div className="w-full h-full relative overflow-hidden rounded-sm shadow-[0_20px_60px_rgba(0,0,0,0.5)] transform-gpu">
                <motion.img
                    src={imageUrl}
                    alt="Featured Artwork"
                    className="w-full h-full object-cover"
                    loading="eager"
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    whileHover={{ scale: 1.05 }}
                />

                {/* Lighting effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/20 pointer-events-none" />

                {/* Subtle vignette */}
                <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.3)] pointer-events-none" />
            </div>

            {/* Floating shadow */}
            <div className="absolute -bottom-4 inset-x-8 h-8 bg-black/20 blur-xl rounded-full" />
        </motion.div>
    );
};
