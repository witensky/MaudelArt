import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';

interface AdminLayoutProps {
    children: React.ReactNode;
    activeTab: string;
    setActiveTab: (tab: string) => void;
    onLogout: () => void;
    userEmail?: string;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
    children,
    activeTab,
    setActiveTab,
    onLogout,
    userEmail
}) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) setIsSidebarOpen(false);
            else setIsSidebarOpen(true);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="flex min-h-screen bg-[#f8f9fa]">
            {/* Mobile Overlay */}
            <AnimatePresence>
                {isSidebarOpen && window.innerWidth < 768 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsSidebarOpen(false)}
                        className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
                    />
                )}
            </AnimatePresence>

            <AdminSidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
                onLogout={onLogout}
            />

            <main className="flex-1 overflow-y-auto h-screen bg-[#f4f7f6]">
                <div className="p-4 md:p-12 max-w-[1600px] mx-auto">
                    <AdminHeader
                        isSidebarOpen={isSidebarOpen}
                        setIsSidebarOpen={setIsSidebarOpen}
                        userEmail={userEmail}
                    />
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                        >
                            {children}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
};
