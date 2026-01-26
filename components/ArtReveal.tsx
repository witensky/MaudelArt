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
    const tearControls = useAnimation();

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
            // Start curtain reveal animation with smooth fade
            curtainControls.start({
                opacity: 0,
                transition: { 
                    duration: 4, 
                    delay: 1, 
                    ease: [0.25, 0.46, 0.45, 0.94]  // Smooth ease-out
                }
            });
            // Tear animation from right side
            tearControls.start({
                clipPath: 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)',
                transition: { 
                    duration: 4, 
                    delay: 1, 
                    ease: [0.25, 0.46, 0.45, 0.94]
                }
            });
        };
    }, [heroImage, curtainControls, tearControls]);

    return (
        <div className="relative w-full h-full perspective-1000">
            {/* Main Canvas Container with 3D Transform - Enhanced */}
            <motion.div
                initial={{ 
                    opacity: 0, 
                    rotateY: -25,
                    rotateX: -5,
                    scale: 0.85
                }}
                animate={{ 
                    opacity: 1, 
                    rotateY: 0,
                    rotateX: 0,
                    scale: 1
                }}
                transition={{ duration: 2, ease: "easeOut" }}
                className="relative w-full h-full transform-gpu"
                style={{
                    transformStyle: 'preserve-3d',
                    perspective: '1200px'
                }}
            >
                {/* Golden Frame */}
                <div className="absolute inset-0 -z-10">
                    <div className="w-full h-full border-8 border-[#d4af37] rounded-sm shadow-[0_40px_100px_rgba(0,0,0,0.8)]" />
                </div>

                {/* Artwork Image with Depth */}
                <div className="relative w-full h-full overflow-hidden rounded-sm">
                    {imageLoaded ? (
                        <motion.img
                            src={heroImage}
                            alt="Featured Masterpiece"
                            className="w-full h-full object-cover"
                            initial={{ scale: 1.2, filter: 'blur(12px) brightness(0.9)' }}
                            animate={{ scale: 1, filter: 'blur(0px) brightness(1)' }}
                            transition={{ duration: 3.5, delay: 0.5, ease: "easeOut" }}
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-emerald-950/50 to-emerald-900/30 flex items-center justify-center">
                            <div className="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
                        </div>
                    )}

                    {/* Subtle Vignette */}
                    <div className="absolute inset-0 shadow-[inset_0_0_120px_rgba(0,0,0,0.4)] pointer-events-none" />
                </div>

                {/* Torn Green Curtain Overlay - Advanced Animation */}
                <motion.div
                    initial={{
                        clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
                        opacity: 1
                    }}
                    animate={curtainControls}
                    className="absolute inset-0 z-10 pointer-events-none"
                    style={{
                        background: 'linear-gradient(135deg, rgba(16, 100, 80, 0.9) 0%, rgba(6, 50, 40, 0.85) 50%, rgba(4, 26, 20, 0.8) 100%)',
                        backdropFilter: 'blur(12px)',
                    }}
                >
                    {/* Torn Edge Effect - Right Side with 3D Perspective */}
                    <motion.div
                        animate={tearControls}
                        className="absolute right-0 top-0 bottom-0 w-40 origin-right"
                        style={{
                            transformStyle: 'preserve-3d',
                            perspective: '1000px',
                            transformOrigin: '100% 50%',
                            rotateY: -15,
                            rotateZ: 2
                        }}
                    >
                        <div
                            className="w-full h-full"
                            style={{
                                background: `url("data:image/svg+xml,%3Csvg width='180' height='140' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3ClinearGradient id='grad1' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23064e3b;stop-opacity:0.95' /%3E%3Cstop offset='50%25' style='stop-color:%230d6e53;stop-opacity:0.9' /%3E%3Cstop offset='100%25' style='stop-color:%23064e3b;stop-opacity:0.85' /%3E%3C/linearGradient%3E%3C/defs%3E%3Cpath d='M0 0 Q8 12 0 28 Q6 42 0 65 Q10 78 0 98 Q8 110 0 128 L0 0 Z' fill='url(%23grad1)' stroke='%2310b981' stroke-width='0.7'/%3E%3Cpath d='M25 8 Q32 22 25 48 Q34 65 25 85 Q38 102 25 122 L25 8 Z' fill='%230d6e53' stroke='%2306b6d4' stroke-width='0.4'/%3E%3Cpath d='M50 5 Q58 18 50 38 Q60 52 50 72 Q68 88 50 115 L50 5 Z' fill='%23064e3b'/%3E%3Cpath d='M75 12 Q82 26 75 52 Q88 68 75 92 Q92 108 75 130 L75 12 Z' fill='%230d6e53' opacity='0.8'/%3E%3Cpath d='M100 3 Q110 16 100 36 Q115 50 100 70 Q125 85 100 120 L100 3 Z' fill='%23064e3b'/%3E%3C/svg%3E")`,
                                backgroundRepeat: 'repeat-y',
                                backgroundSize: '100% auto',
                                filter: 'drop-shadow(-10px 4px 25px rgba(0,0,0,0.7))',
                                opacity: 0.98
                            }}
                        />
                    </motion.div>

                    {/* Enhanced Fabric Texture - More Visible */}
                    <div
                        className="absolute inset-0 opacity-30"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='fabric2' x='0' y='0' width='80' height='80' patternUnits='userSpaceOnUse'%3E%3Crect fill='%23064e3b' width='80' height='80'/%3E%3Cline x1='0' y1='0' x2='80' y2='80' stroke='%2310b981' stroke-width='0.8' opacity='0.4'/%3E%3Cline x1='80' y1='0' x2='0' y2='80' stroke='%2310b981' stroke-width='0.8' opacity='0.4'/%3E%3Cline x1='40' y1='0' x2='40' y2='80' stroke='%2306b6d4' stroke-width='0.5' opacity='0.2'/%3E%3Cline x1='0' y1='40' x2='80' y2='40' stroke='%2306b6d4' stroke-width='0.5' opacity='0.2'/%3E%3C/pattern%3E%3C/defs%3E%3Crect fill='url(%23fabric2)' width='80' height='80'/%3E%3C/svg%3E")`
                        }}
                    />

                    {/* Inner Light Streaks */}
                    <div className="absolute inset-0 opacity-20">
                        <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-cyan-300/20 to-transparent" />
                    </div>
                </motion.div>

                {/* 3D Light Reflection - Right Edge Enhanced */}
                <motion.div
                    initial={{ opacity: 0, scaleY: 0 }}
                    animate={{ 
                        opacity: [0, 0.9, 0.5, 0],
                        scaleY: [0, 1, 1, 0]
                    }}
                    transition={{ duration: 4, delay: 0.8, ease: "easeInOut" }}
                    className="absolute top-0 right-0 bottom-0 w-3 bg-gradient-to-b from-transparent via-white to-transparent origin-right"
                    style={{
                        transform: 'translateZ(40px)',
                        filter: 'blur(1.5px)',
                        transformStyle: 'preserve-3d',
                        boxShadow: '0 0 20px rgba(255, 255, 255, 0.4)'
                    }}
                />

                {/* Dynamic Shadow - 3D Effect with Depth */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 0.7, 0.5] }}
                    transition={{ duration: 4, delay: 0.8, ease: "easeOut" }}
                    className="absolute -bottom-12 inset-x-0 h-20 bg-gradient-to-b from-black/50 to-transparent blur-[20px] rounded-full"
                />

                {/* Enhanced Depth Shadow on Right - 3D Edge */}
                <motion.div
                    initial={{ opacity: 0, x: 0 }}
                    animate={{ opacity: [0, 0.7, 0.6], x: [0, 5, 5] }}
                    transition={{ duration: 4, delay: 0.8 }}
                    className="absolute inset-y-0 -right-6 w-16 bg-gradient-to-l from-black/70 via-black/40 to-transparent blur-xl opacity-70"
                    style={{
                        transformStyle: 'preserve-3d',
                        transform: 'perspective(1000px) rotateY(-25deg)'
                    }}
                />
            </motion.div>

            {/* Ambient Glow - Pulsing Background with Gradient */}
            <motion.div
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ 
                    opacity: [0, 0.9, 0.7],
                    scale: [0.6, 1.4, 1.3]
                }}
                transition={{ duration: 4.5, delay: 0.3, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                className="absolute inset-0 -z-20 bg-gradient-to-tr from-emerald-700/30 via-cyan-500/15 to-emerald-500/20 blur-[160px] rounded-full"
            />

            {/* Fade to Background Gradient */}
            <div className="absolute inset-0 -z-30 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-emerald-950/50" />
            </div>
        </div>
    );
};
