import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
    const [stats, setStats] = useState<any>(null);
    const [users, setUsers] = useState<any[]>([]);
    const [leads, setLeads] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, usersRes, leadsRes] = await Promise.all([
                    axios.get('https://servicoperto-backend.onrender.com/api/admin/stats'),
                    axios.get('https://servicoperto-backend.onrender.com/api/admin/users'),
                    axios.get('https://servicoperto-backend.onrender.com/api/admin/leads')
                ]);
                setStats(statsRes.data);
                setUsers(usersRes.data);
                setLeads(leadsRes.data);
            } catch (err) {
                console.error("Error fetching admin data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center">
            <div className="text-blue-500 text-xl font-bold animate-pulse">Carregando Painel...</div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-900 text-white p-8">
            <header className="mb-10 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight">Painel <span className="text-blue-500">Administrativo</span></h1>
                    <p className="text-slate-400 mt-1">Monitore o crescimento e a atividade do ServiçoPerto.</p>
                </div>
                <div className="bg-slate-800 px-4 py-2 rounded-lg border border-slate-700">
                    <span className="text-green-400 font-bold">● Sistema Online</span>
                </div>
            </header>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl">
                    <p className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-2">Total de Usuários</p>
                    <h2 className="text-4xl font-black">{stats?.summary.totalUsers}</h2>
                    <div className="mt-4 flex gap-2">
                        {stats?.summary.roles.map((r: any) => (
                            <span key={r.role} className="text-xs bg-slate-700 px-2 py-1 rounded text-slate-300">
                                {r.role === 'PROVIDER' ? 'Prestadores' : 'Clientes'}: {r.count}
                            </span>
                        ))}
                    </div>
                </div>
                <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl border-l-4 border-l-blue-500">
                    <p className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-2">Bairros Ativos</p>
                    <h2 className="text-4xl font-black">{stats?.regions.length}</h2>
                    <p className="text-xs text-blue-400 mt-2 font-medium">Bairros com prestadores</p>
                </div>
                <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl border-l-4 border-l-amber-500">
                    <p className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-2">Pré-Inscritos (Leads)</p>
                    <h2 className="text-4xl font-black">{leads.length}</h2>
                    <p className="text-xs text-amber-400 mt-2 font-medium">Interessados no lançamento</p>
                </div>
                <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl">
                    <p className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-2">Crescimento (30d)</p>
                    <h2 className="text-4xl font-black">+{stats?.trends.reduce((acc: number, t: any) => acc + parseInt(t.count), 0)}</h2>
                    <p className="text-xs text-green-400 mt-2 font-medium">Novos cadastros</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Neighborhood Rankings */}
                <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden shadow-xl">
                    <div className="p-6 border-b border-slate-700">
                        <h3 className="text-xl font-bold">Top Regiões</h3>
                    </div>
                    <div className="p-6">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-slate-500 text-xs font-bold uppercase border-b border-slate-700">
                                    <th className="pb-4">Bairro</th>
                                    <th className="pb-4 text-right">Prestadores</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats?.regions.map((reg: any, i: number) => (
                                    <tr key={i} className="border-b border-slate-700/50 last:border-0">
                                        <td className="py-4 font-medium">{reg.neighborhood || 'Não informado'}</td>
                                        <td className="py-4 text-right text-blue-400 font-bold">{reg.count}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pre-Registrations (Leads) List */}
                <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden shadow-xl">
                    <div className="p-6 border-b border-slate-700 bg-amber-500/10">
                        <h3 className="text-xl font-bold text-amber-500">Novos Leads (Vips)</h3>
                    </div>
                    <div className="p-6">
                        <div className="space-y-4">
                            {leads.length === 0 && <p className="text-slate-500 text-sm">Nenhum lead encontrado.</p>}
                            {leads.slice(0, 10).map((lead) => (
                                <div key={lead.id} className="p-3 bg-slate-900/50 rounded-xl border border-slate-700/30">
                                    <div className="flex justify-between items-start mb-1">
                                        <p className="font-bold text-sm tracking-tight">{lead.name || 'Cliente Interessado'}</p>
                                        <span className={`text-[8px] px-1.5 py-0.5 rounded-full font-black uppercase ${lead.type === 'PROVIDER' ? 'bg-amber-900/40 text-amber-400 border border-amber-800' : 'bg-blue-900/40 text-blue-400 border border-blue-800'}`}>
                                            {lead.type}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-400 font-mono">{lead.whatsapp}</p>
                                    {lead.specialty && <p className="text-[10px] text-amber-600 font-bold mt-1 uppercase">{lead.specialty}</p>}
                                    <p className="text-[8px] text-slate-600 mt-2">{new Date(lead.created_at).toLocaleString()}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Recent Users List */}
                <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden shadow-xl">
                    <div className="p-6 border-b border-slate-700">
                        <h3 className="text-xl font-bold">Últimos Cadastros</h3>
                    </div>
                    <div className="p-6">
                        <div className="space-y-4">
                            {users.slice(0, 8).map((user) => (
                                <div key={user.id} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-xl border border-slate-700/30">
                                    <div>
                                        <p className="font-bold text-sm">{user.name}</p>
                                        <p className="text-[10px] text-slate-500">{user.email}</p>
                                    </div>
                                    <div className="text-right">
                                        <span className={`text-[8px] px-1.5 py-0.5 rounded-full font-bold uppercase ${user.role === 'PROVIDER' ? 'bg-blue-900/40 text-blue-400 border border-blue-800' : 'bg-green-900/40 text-green-400 border border-green-800'}`}>
                                            {user.role}
                                        </span>
                                        <p className="text-[9px] text-slate-600 mt-1">{new Date(user.created_at).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
