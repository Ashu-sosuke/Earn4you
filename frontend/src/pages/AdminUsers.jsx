import React, { useEffect, useState } from 'react';
import DataTable from '../components/DataTable';
import { User, Shield, Ban, CheckCircle } from 'lucide-react';
import api from '../api/axios';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await api.get('/admin/users');
                if (response.data.success) {
                    setUsers(response.data.data);
                }
            } catch (error) {
                console.error("Failed to fetch users", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const columns = [
        {
            header: 'User',
            accessor: 'username',
            render: (row) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-slate-300">
                        <User size={16} />
                    </div>
                    <div>
                        <div className="font-medium text-white">{row.username}</div>
                    </div>
                </div>
            )
        },
        { header: 'Email', accessor: 'email' },
        { header: 'Role', accessor: 'role' },
        { header: 'Joined', accessor: 'createdAt', render: (row) => new Date(row.createdAt).toLocaleDateString() },
        {
            header: 'Status',
            accessor: 'isActive',
            render: (row) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${row.isActive
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : 'bg-red-500/10 text-red-400 border-red-500/20'
                    }`}>
                    {row.isActive ? 'Active' : 'Inactive'}
                </span>
            )
        },
        // Actions column removed for now as backend logic for User Ban/Activate is not ready for frontend integration
    ];

    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-white">User Management</h1>
            </div>

            <DataTable
                title="Registered Users"
                columns={columns}
                data={users}
                searchPlaceholder="Search users..."
            />
        </div>
    );
};

export default AdminUsers;
