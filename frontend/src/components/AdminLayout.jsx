import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import { Menu, Search } from 'lucide-react';

const AdminLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const navigate = useNavigate();

    React.useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || user.role !== 'admin') {
            navigate('/login');
        }
    }, [navigate]);

    return (
        <div className="min-h-screen bg-black text-white">
            <AdminSidebar
                isOpen={isSidebarOpen}
                toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            />

            <div className="lg:ml-64 min-h-screen flex flex-col">
                {/* Admin Header */}
                <header className="sticky top-0 z-30 bg-black/80 backdrop-blur-md border-b border-slate-900 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setIsSidebarOpen(true)}
                                className="lg:hidden p-2 rounded-lg text-slate-400 hover:bg-slate-800 transition-colors"
                            >
                                <Menu className="w-6 h-6" />
                            </button>
                            <h2 className="text-xl font-semibold text-white">Admin Dashboard</h2>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700"></div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
