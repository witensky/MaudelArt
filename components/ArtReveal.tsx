import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { supabase } from '../supabaseClient';

interface ArtRevealProps {
    fallbackImage?: string;
}

export const ArtReveal: React.FC<ArtRevealProps> = ({
    fallbackImage = "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=1200"
}) => {
    const [heroImage, setHeroImage] = useState(fallbackImage);
    const [imageLoaded, setImageLoaded] = useState(false);
    const curtainControls = useAnimation();

    // Load hero image from database
    useEffect(() => {
        const loadHeroImage = async () => {
            const { data } = await supabase
                .from('site_content')
                .select('content')
                .eq('key', 'hero_image')
                .single();

            if (data?.content?.image_url) {
                setHeroImage(data.content.image_url);
            }
        };
        loadHeroImage();
    }, []);

    // Preload image
    useEffect(() => {
        const img = new Image();
        img.src = heroImage;
        img.onload = () => {
            setImageLoaded(true);
            // Start curtain reveal animation
            curtainControls.start({
                clipPath: 'polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)',
                opacity: 0,
                transition: { duration: 2, delay: 0.5, ease: [0.75, 0, 0.25, 1] }
            });
        };
    }, [heroImage, curtainControls]);

    return (
        <div className="relative w-full h-full perspective-1000">
            {/* Main Canvas Container with 3D Transform */}
            <motion.div
                initial={{ opacity: 0, rotateY: -15, scale: 0.9 }}
                animate={{ opacity: 1, rotateY: 0, scale: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="relative w-full h-full transform-gpu"
                style={{
                    transformStyle: 'preserve-3d',
                    perspective: '1000px'
                }}
            >
                {/* Golden Frame */}
                <div className="absolute inset-0 -z-10">
                    <div className="w-full h-full border-8 border-[#d4af37] rounded-sm shadow-[0_30px_80px_rgba(0,0,0,0.7)]" />
                </div>

                {/* Artwork Image with Depth */}
                <div className="relative w-full h-full overflow-hidden rounded-sm">
                    {imageLoaded ? (
                        <motion.img
                            src={heroImage}
                            alt="Featured Masterpiece"
                            className="w-full h-full object-cover"
                            initial={{ scale: 1.2, filter: 'blur(10px)' }}
                            animate={{ scale: 1, filter: 'blur(0px)' }}
                            transition={{ duration: 2, ease: "easeOut" }}
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-emerald-950/50 to-emerald-900/30 flex items-center justify-center">
                            <div className="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
                        </div>
                    )}

                    {/* Subtle Vignette */}
                    <div className="absolute inset-0 shadow-[inset_0_0_120px_rgba(0,0,0,0.4)] pointer-events-none" />
                </div>

                {/* Torn Green Curtain Overlay - Animated Reveal */}
                <motion.div
                    initial={{
                        clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
                        opacity: 1
                    }}
                    animate={curtainControls}
                    className="absolute inset-0 z-10 pointer-events-none"
                    style={{
                        background: 'linear-gradient(135deg, rgba(6, 78, 59, 0.85) 0%, rgba(4, 26, 20, 0.75) 100%)',
                        backdropFilter: 'blur(8px)',
                    }}
                >
                    {/* Torn Edge Effect - Right Side */}
                    <div
                        className="absolute right-0 top-0 bottom-0 w-32"
                        style={{
                            background: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0 L100 10 L95 30 L100 50 L90 70 L100 90 L100 100 L0 100 Z' fill='rgba(6,78,59,0.9)'/%3E%3C/svg%3E")`,
                            backgroundRepeat: 'repeat-y',
                            backgroundSize: '100% auto',
                            filter: 'drop-shadow(0 0 10px rgba(0,0,0,0.5))'
                        }}
                    />

                    {/* Fabric Texture Overlay */}
                    <div
                        className="absolute inset-0 opacity-20"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='fabric' x='0' y='0' width='60' height='60' patternUnits='userSpaceOnUse'%3E%3Crect fill='%23064e3b' width='60' height='60'/%3E%3Cline x1='0' y1='0' x2='60' y2='60' stroke='%2310b981' stroke-width='0.5' opacity='0.3'/%3E%3Cline x1='60' y1='0' x2='0' y2='60' stroke='%2310b981' stroke-width='0.5' opacity='0.3'/%3E%3C/pattern%3E%3C/defs%3E%3Crect fill='url(%23fabric)' width='60' height='60'/%3E%3C/svg%3E")`
                        }}
                    />
                </motion.div>

                {/* 3D Light Reflection - Right Edge */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 0.6, 0] }}
                    transition={{ duration: 2, delay: 1.5, repeat: Infinity, repeatDelay: 5 }}
                    className="absolute top-0 right-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-white to-transparent"
                    style={{
                        transform: 'translateZ(20px)',
                        filter: 'blur(2px)'
                    }}
                />

                {/* Floating Shadow Effect */}
                <div className="absolute -bottom-8 inset-x-8 h-12 bg-black/30 blur-2xl rounded-full" />
            </motion.div>

            {/* Ambient Glow Behind Canvas */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1.2 }}
                transition={{ duration: 3, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                className="absolute inset-0 -z-20 bg-emerald-500/15 blur-[120px] rounded-full"
            />
        </div>
    );
};
