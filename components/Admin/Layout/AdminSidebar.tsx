import React from 'react';
import { motion } from 'framer-motion';
import {
    LayoutDashboard, Image as ImageIcon, Palette, FileText, Mail, Settings,
    LogOut, Users, Camera, DollarSign
} from 'lucide-react';

interface AdminSidebarProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    isSidebarOpen: boolean;
    setIsSidebarOpen: (isOpen: boolean) => void;
    onLogout: () => void;
}

export const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'paintings', label: 'Œuvres', icon: Palette },
    { id: 'gallery', label: 'Collections', icon: ImageIcon },
    { id: 'media', label: 'Médiathèque', icon: Camera },
    { id: 'authors', label: 'Artistes', icon: Users },
    { id: 'hero', label: 'Image Hero', icon: ImageIcon },
    { id: 'bio', label: 'Histoire & Bio', icon: FileText },
    { id: 'content', label: 'Textes du Site', icon: FileText },
    { id: 'currencies', label: 'Devises & Prix', icon: DollarSign },
    { id: 'messages', label: 'Messages', icon: Mail },
    { id: 'settings', label: 'Réglages', icon: Settings },
];

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
    activeTab,
    setActiveTab,
    isSidebarOpen,
    setIsSidebarOpen,
    onLogout
}) => {
    return (
        <motion.aside
            initial={false}
            animate={{ width: isSidebarOpen ? '280px' : '0px', opacity: isSidebarOpen ? 1 : 0 }}
            className="fixed md:relative z-50 h-[100dvh] md:h-screen bg-maudel-dark text-white shadow-2xl flex flex-col overflow-hidden whitespace-nowrap"
        >
            <div className="p-8 border-b border-white/5 flex flex-col gap-1 min-w-[280px]">
                <h1 className="text-2xl font-black tracking-tighter text-white">
                    MaudelArt<span className="text-emerald-400">.</span>
                </h1>
                <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-emerald-400/60">Gestionnaire d'Art</p>
            </div>

            <nav className="flex-1 overflow-y-auto py-8 px-4 space-y-2 min-w-[280px]">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => { setActiveTab(item.id); if (window.innerWidth < 768) setIsSidebarOpen(false); }}
                            className={`admin-sidebar-btn w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group ${isActive
                                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20'
                                : 'text-white/40 hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            <Icon size={20} className={isActive ? 'text-white' : 'group-hover:text-white transition-colors'} />
                            <span className={`text-sm font-bold tracking-wide ${isActive ? 'translate-x-1' : ''} transition-transform`}>
                                {item.label}
                            </span>
                        </button>
                    )
                })}
            </nav>

            <div className="p-6 border-t border-white/5 min-w-[280px]">
                <button
                    onClick={onLogout}
                    className="w-full flex items-center gap-4 px-5 py-4 text-red-400 hover:bg-red-500/10 rounded-2xl transition-all font-bold text-sm"
                >
                    <LogOut size={20} /> Déconnexion
                </button>
            </div>
        </motion.aside>
    );
};
