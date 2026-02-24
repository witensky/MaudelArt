import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import {
    LayoutDashboard, Image as ImageIcon, Palette, Mail, TrendingUp, Users, Clock
} from 'lucide-react';

// Managers
import { ArtworksManager } from './ArtworksManager';
import { MessagesManager } from './MessagesManager';
import { CollectionsManager } from './CollectionsManager';
import { BioManager } from './BioManager';
import { SettingsManager } from './SettingsManager';
import { AuthorsManager } from './AuthorsManager';
import { SiteContentManager } from './SiteContentManager';
import { HeroImageManager } from './HeroImageManager';
import { MediaLibraryManager } from './MediaLibrary/MediaLibraryManager';
import { CurrencyManager } from './CurrencyManager';

// Layout
import { AdminLayout } from './Layout/AdminLayout';

interface DashboardProps {
    onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
    const [activeTab, setActiveTab] = useState<string>('dashboard');
    const [stats, setStats] = useState({ artworks: 0, messages: 0, collections: 0 });
    const [userEmail, setUserEmail] = useState<string>('');

    useEffect(() => {
        fetchStats();
        getUserInfo();
    }, []);

    const getUserInfo = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user && user.email) {
            setUserEmail(user.email);
        }
    }

    const fetchStats = async () => {
        const { count: artCount } = await supabase.from('artworks').select('*', { count: 'exact', head: true });
        const { count: msgCount } = await supabase.from('messages').select('*', { count: 'exact', head: true });
        const { count: collCount } = await supabase.from('collections').select('*', { count: 'exact', head: true });

        setStats({
            artworks: artCount || 0,
            messages: msgCount || 0,
            collections: collCount || 0
        });
    };

    return (
        <AdminLayout
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onLogout={async () => {
                await supabase.auth.signOut();
                onLogout();
            }}
            userEmail={userEmail}
        >
            {activeTab === 'dashboard' && (
                <div className="space-y-12">
                    <h2 className="text-4xl font-serif text-emerald-950 font-bold">Vue d'ensemble</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <StatCard title="Œuvres Exposées" value={stats.artworks} icon={Palette} color="bg-blue-500" trend="+2 cette semaine" />
                        <StatCard title="Total Collections" value={stats.collections} icon={ImageIcon} color="bg-purple-500" trend="Archive complète" />
                        <StatCard title="Nouveaux Messages" value={stats.messages} icon={Mail} color="bg-emerald-500" trend="Action requise" />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-black/5">
                            <div className="flex justify-between items-center mb-10">
                                <h3 className="text-xl font-bold text-emerald-950 flex items-center gap-3">
                                    <TrendingUp className="text-emerald-500" size={24} /> Statistiques du Mois
                                </h3>
                                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-900/40">Janvier 2024</span>
                            </div>
                            <div className="space-y-6">
                                <ActivityItem icon={Users} label="Visites uniques" val="1,240" color="bg-emerald-50 text-emerald-600" />
                                <ActivityItem icon={ImageIcon} label="Vues des œuvres" val="4,892" color="bg-blue-50 text-blue-600" />
                                <ActivityItem icon={Clock} label="Temps moyen" val="4m 12s" color="bg-purple-50 text-purple-600" />
                            </div>
                        </div>

                        <div className="bg-[#041a14] p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col justify-center">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[80px] rounded-full" />
                            <h3 className="text-2xl serif text-[#d4af37] mb-6">Prêt à exposer ?</h3>
                            <p className="text-white/60 text-sm mb-10 leading-relaxed font-medium">Ajoutez de nouvelles peintures ou mettez à jour vos textes pour captiver vos visiteurs.</p>
                            <button
                                onClick={() => setActiveTab('paintings')}
                                className="w-full py-5 bg-[#d4af37] text-emerald-950 font-black uppercase tracking-[0.3em] text-xs rounded-2xl hover:bg-white transition-all shadow-xl shadow-black/20"
                            >
                                Nouvelle Publication
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'paintings' && <ArtworksManager />}
            {activeTab === 'messages' && <MessagesManager />}
            {activeTab === 'gallery' && <CollectionsManager />}
            {activeTab === 'authors' && <AuthorsManager />}
            {activeTab === 'hero' && <HeroImageManager />}
            {activeTab === 'bio' && <BioManager />}
            {activeTab === 'content' && <SiteContentManager />}
            {activeTab === 'settings' && <SettingsManager />}
            {activeTab === 'media' && <MediaLibraryManager />}
            {activeTab === 'currencies' && <CurrencyManager />}

            {activeTab === 'seo' && (
                <div className="flex flex-col items-center justify-center min-h-[400px] bg-white rounded-[2.5rem] border border-dashed border-gray-300">
                    <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mb-6 border border-gray-100">
                        <Palette className="text-gray-400" size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-emerald-950">Module SEO</h3>
                    <p className="text-gray-500 text-sm mt-2 max-w-xs text-center font-medium">Optimisez votre visibilité sur Google bientôt.</p>
                </div>
            )}
        </AdminLayout>
    );
};

// Helper Components (kept within file or moved to separate files later)
const StatCard = ({ title, value, icon: Icon, color, trend }: any) => (
    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-black/5 flex flex-col gap-6 hover:shadow-xl hover:-translate-y-1 transition-all group">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform ${color}`}>
            <Icon size={24} />
        </div>
        <div>
            <h4 className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2">{title}</h4>
            <div className="flex items-baseline gap-4">
                <span className="text-5xl font-black text-emerald-950 tracking-tighter">{value}</span>
                <span className="text-[10px] font-bold text-emerald-500">{trend}</span>
            </div>
        </div>
    </div>
);

const ActivityItem = ({ icon: Icon, label, val, color }: any) => (
    <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 transition-colors border border-transparent hover:border-black/5 group">
        <div className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
                <Icon size={18} />
            </div>
            <span className="text-sm font-bold text-emerald-950/80">{label}</span>
        </div>
        <span className="text-lg font-black text-emerald-950">{val}</span>
    </div>
);

export default Dashboard;
