<<<<<<< HEAD
import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Clock,
  ExternalLink,
  FileText,
  Globe,
  Image as ImageIcon,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  Palette,
  Settings,
  TrendingUp,
  Users,
  X,
} from 'lucide-react';
import { supabase } from '../../supabaseClient';
import { ArtworksManager } from './ArtworksManager';
import { AuthorsManager } from './AuthorsManager';
import { BioManager } from './BioManager';
import { HeroImageManager } from './HeroImageManager';
import { MessagesManager } from './MessagesManager';
import { SettingsManager } from './SettingsManager';
import { SiteContentManager } from './SiteContentManager';

interface DashboardProps {
  onLogout: () => void;
}

type Tab = 'dashboard' | 'paintings' | 'bio' | 'messages' | 'settings' | 'authors' | 'content' | 'hero' | 'seo';

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);
  const [stats, setStats] = useState({ artworks: 0, messages: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      const { count: artCount } = await supabase.from('artworks').select('*', { count: 'exact', head: true });
      const { count: msgCount } = await supabase.from('messages').select('*', { count: 'exact', head: true });

      setStats({
        artworks: artCount || 0,
        messages: msgCount || 0,
      });
    };

    fetchStats();

    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth >= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'paintings', label: 'Oeuvres', icon: Palette },
    { id: 'authors', label: 'Artistes', icon: Users },
    { id: 'hero', label: 'Image Hero', icon: ImageIcon },
    { id: 'bio', label: 'Histoire & Bio', icon: FileText },
    { id: 'content', label: 'Textes du site', icon: FileText },
    { id: 'messages', label: 'Messages', icon: Mail },
    { id: 'settings', label: 'Reglages', icon: Settings },
  ] as const;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    onLogout();
  };

  return (
    <div className="flex min-h-screen bg-[#f8f9fa]">
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{ width: isSidebarOpen ? '280px' : '0px', opacity: isSidebarOpen ? 1 : 0 }}
        className="fixed z-50 flex h-[100dvh] flex-col overflow-hidden whitespace-nowrap bg-[#041a14] text-white shadow-2xl md:relative md:h-screen"
      >
        <div className="flex min-w-[280px] flex-col gap-1 border-b border-white/5 p-8">
          <h1 className="text-2xl font-black tracking-tighter text-white">
            MaudelArt<span className="text-emerald-500">.</span>
          </h1>
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-emerald-500/60">Gestionnaire d'art</p>
        </div>

        <nav className="min-w-[280px] flex-1 space-y-2 overflow-y-auto px-4 py-8">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  if (window.innerWidth < 768) {
                    setIsSidebarOpen(false);
                  }
                }}
                className={`group flex w-full items-center gap-4 rounded-2xl px-5 py-4 transition-all duration-300 ${
                  isActive ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20' : 'text-white/40 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon size={20} className={isActive ? 'text-white' : 'transition-colors group-hover:text-white'} />
                <span className={`text-sm font-bold tracking-wide transition-transform ${isActive ? 'translate-x-1' : ''}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>

        <div className="min-w-[280px] border-t border-white/5 p-6">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-4 rounded-2xl px-5 py-4 text-sm font-bold text-red-400 transition-all hover:bg-red-500/10"
          >
            <LogOut size={20} /> Deconnexion
          </button>
        </div>
      </motion.aside>

      <main className="h-screen flex-1 overflow-y-auto bg-[#f4f7f6]">
        <div className="mx-auto max-w-[1600px] p-4 md:p-12">
          <header className="mb-12 flex items-center justify-between rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-6">
              <button
                onClick={() => setIsSidebarOpen((open) => !open)}
                className="rounded-2xl border border-black/5 bg-gray-50 p-3 text-emerald-950 transition-colors hover:bg-emerald-50"
              >
                {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
              </button>

              <div className="hidden min-w-0 md:flex md:flex-col md:justify-center md:gap-1.5">
                <div className="whitespace-nowrap font-serif text-[1.65rem] font-bold leading-none tracking-tight text-emerald-950">
                  Dashboard Admin
                </div>
                <p className="whitespace-nowrap text-[11px] font-bold uppercase leading-none tracking-[0.22em] text-emerald-900/35">
                  Connectee en tant que Maude Eliacin
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => window.open('/', '_blank')}
                className="hidden items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-2 text-xs font-bold uppercase tracking-widest text-emerald-700 transition-all hover:bg-emerald-100 lg:flex"
              >
                Voir le site <ExternalLink size={14} />
              </button>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 font-black text-white shadow-lg">A</div>
            </div>
          </header>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'dashboard' && (
                <div className="space-y-12">
                  <h2 className="font-serif text-4xl font-bold text-emerald-950">Vue d'ensemble</h2>

                  <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    <StatCard title="Oeuvres exposees" value={stats.artworks} icon={Palette} color="bg-blue-500" trend="+2 cette semaine" />
                    <StatCard title="Nouveaux messages" value={stats.messages} icon={Mail} color="bg-emerald-500" trend="Action requise" />
                  </div>

                  <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                    <div className="rounded-[2.5rem] border border-black/5 bg-white p-10 shadow-sm">
                      <div className="mb-10 flex items-center justify-between">
                        <h3 className="flex items-center gap-3 text-xl font-bold text-emerald-950">
                          <TrendingUp className="text-emerald-500" size={24} /> Statistiques du mois
                        </h3>
                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-900/40">Janvier 2024</span>
                      </div>
                      <div className="space-y-6">
                        <ActivityItem icon={Users} label="Visites uniques" val="1,240" color="bg-emerald-50 text-emerald-600" />
                        <ActivityItem icon={ImageIcon} label="Vues des oeuvres" val="4,892" color="bg-blue-50 text-blue-600" />
                        <ActivityItem icon={Clock} label="Temps moyen" val="4m 12s" color="bg-purple-50 text-purple-600" />
                      </div>
                    </div>

                    <div className="relative flex flex-col justify-center overflow-hidden rounded-[2.5rem] bg-[#041a14] p-10 shadow-2xl">
                      <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-emerald-500/10 blur-[80px]" />
                      <h3 className="mb-6 serif text-2xl text-[#d4af37]">Pret a publier ?</h3>
                      <p className="mb-10 text-sm font-medium leading-relaxed text-white/60">
                        Ajoutez de nouvelles peintures ou mettez a jour vos textes pour captiver vos visiteurs.
                      </p>
                      <button
                        onClick={() => setActiveTab('paintings')}
                        className="w-full rounded-2xl bg-[#d4af37] py-5 text-xs font-black uppercase tracking-[0.3em] text-emerald-950 shadow-xl shadow-black/20 transition-all hover:bg-white"
                      >
                        Nouvelle publication
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'paintings' && <ArtworksManager />}
              {activeTab === 'messages' && <MessagesManager />}
              {activeTab === 'authors' && <AuthorsManager />}
              {activeTab === 'hero' && <HeroImageManager />}
              {activeTab === 'bio' && <BioManager />}
              {activeTab === 'content' && <SiteContentManager />}
              {activeTab === 'settings' && <SettingsManager />}

              {activeTab === 'seo' && (
                <div className="flex min-h-[400px] flex-col items-center justify-center rounded-[2.5rem] border border-dashed border-gray-300 bg-white">
                  <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl border border-gray-100 bg-gray-50">
                    <Globe className="text-gray-400" size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-emerald-950">Module SEO</h3>
                  <p className="mt-2 max-w-xs text-center text-sm font-medium text-gray-500">
                    Optimisez votre visibilite sur Google bientot.
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon, color, trend }: any) => (
  <div className="group flex flex-col gap-6 rounded-[2.5rem] border border-black/5 bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl">
    <div className={`flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-xl transition-transform group-hover:scale-110 ${color}`}>
      <Icon size={24} />
    </div>
    <div>
      <h4 className="mb-2 text-[10px] font-black uppercase tracking-widest text-gray-400">{title}</h4>
      <div className="flex items-baseline gap-4">
        <span className="text-5xl font-black tracking-tighter text-emerald-950">{value}</span>
        <span className="text-[10px] font-bold text-emerald-500">{trend}</span>
      </div>
    </div>
  </div>
);

const ActivityItem = ({ icon: Icon, label, val, color }: any) => (
  <div className="group flex items-center justify-between rounded-2xl border border-transparent p-4 transition-colors hover:border-black/5 hover:bg-gray-50">
    <div className="flex items-center gap-4">
      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${color}`}>
        <Icon size={18} />
      </div>
      <span className="text-sm font-bold text-emerald-950/80">{label}</span>
    </div>
    <span className="text-lg font-black text-emerald-950">{val}</span>
  </div>
);

=======
import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import {
    LayoutDashboard, Image as ImageIcon, Palette, Mail, TrendingUp
} from 'lucide-react';
import { MonthlyStatsCard } from './MonthlyStatsCard';

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
                        <MonthlyStatsCard />

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

>>>>>>> 720eb6fbf7785f70adcec728183b6b69aff5b97f
export default Dashboard;
