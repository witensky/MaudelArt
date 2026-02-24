import React from 'react';
import { Menu, X, ExternalLink } from 'lucide-react';

interface AdminHeaderProps {
    isSidebarOpen: boolean;
    setIsSidebarOpen: (isOpen: boolean) => void;
    userEmail?: string;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ isSidebarOpen, setIsSidebarOpen, userEmail }) => {
    return (
        <header className="flex justify-between items-center mb-12 bg-white p-6 rounded-3xl shadow-sm border border-black/5">
            <div className="flex items-center gap-6">
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="p-3 rounded-2xl bg-gray-50 text-emerald-950 hover:bg-emerald-50 transition-colors border border-black/5"
                >
                    {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
                <div className="hidden md:block">
                    <h2 className="text-emerald-950 font-bold text-lg">Dashboard Admin</h2>
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Connecté en tant que {userEmail || 'Admin'}</p>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <button
                    onClick={() => window.open('/', '_blank')}
                    className="hidden lg:flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-emerald-100 transition-all border border-emerald-100"
                >
                    Voir le site <ExternalLink size={14} />
                </button>
                <div className="w-12 h-12 bg-emerald-600 rounded-2xl shadow-lg flex items-center justify-center text-white font-black">
                    {userEmail ? userEmail.charAt(0).toUpperCase() : 'A'}
                </div>
            </div>
        </header>
    );
};
