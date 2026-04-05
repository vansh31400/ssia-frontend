import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

export default function Analytics({ adminInfo }) {
    const [stats, setStats] = useState({
        totalStudents: 0,
        paidStudents: 0,
        unpaidStudents: 0,
        totalRevenue: 0,
        leads: 0
    });

    const [students, setStudents] = useState([]);
    const [admissions, setAdmissions] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${adminInfo?.token}` } };
                const [studRes, adminRes, feeRes, saleRes] = await Promise.all([
                    axios.get('https://ssia-e4sn.onrender.com/api/students', config),
                    axios.get('https://ssia-e4sn.onrender.com/api/admissions', config),
                    axios.get('https://ssia-e4sn.onrender.com/api/fees', config),
                    axios.get('https://ssia-e4sn.onrender.com/api/inventory/sales', config)
                ]);

                const studs = studRes.data;
                const leads = adminRes.data;
                const fees = feeRes.data;
                const sales = saleRes.data;

                let paid = 0;
                let unpaid = 0;
                let feeRevenue = fees.reduce((acc, fee) => acc + (fee.amount || 0), 0);
                let saleRevenue = sales.reduce((acc, sale) => acc + (sale.totalPrice || 0), 0);
                let totalRev = feeRevenue + saleRevenue;

                studs.forEach(s => {
                    if (s.feesStatus === 'Paid') paid++;
                    else unpaid++;
                });

                setStudents(studs);
                setAdmissions(leads);

                setStats({
                    totalStudents: studs.length,
                    paidStudents: paid,
                    unpaidStudents: unpaid,
                    totalRevenue: totalRev,
                    leads: leads.length,
                    feeRevenue,
                    saleRevenue
                });

            } catch (err) {
                console.error("Error fetching analytics data", err);
            }
        };
        fetchData();
    }, [adminInfo]);

    const pieData = [
        { name: 'Fees Revenue', value: stats.feeRevenue || 1 },
        { name: 'Merchandise Sales', value: stats.saleRevenue || 1 },
    ];
    const COLORS = ['#22c55e', '#3b82f6'];

    const sportData = [
        { name: 'Taekwondo', count: students.filter(s => s.sport === 'Taekwondo').length },
        { name: 'Kickboxing', count: students.filter(s => s.sport === 'Kickboxing').length },
        { name: 'Jeet Kune Do', count: students.filter(s => s.sport === 'Jeet Kune Do').length },
        { name: 'MMA', count: students.filter(s => s.sport === 'MMA').length },
        { name: 'Yoga', count: students.filter(s => s.sport === 'Yoga').length },
        { name: 'Midbrain', count: students.filter(s => s.sport === 'Midbrain Activation').length },
    ];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10 blur-sm"><LineChart width={100} height={50} data={[{ v: 0 }, { v: 5 }, { v: 2 }, { v: 10 }]}><Line type="monotone" dataKey="v" stroke="#22c55e" strokeWidth={5} /></LineChart></div>
                    <p className="text-zinc-500 font-bold uppercase text-sm mb-2 relative z-10">Total Revenue (All Time)</p>
                    <p className="text-4xl font-black text-white relative z-10">₹{stats.totalRevenue.toLocaleString()}</p>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl shadow-xl">
                    <p className="text-zinc-500 font-bold uppercase text-sm mb-2">Total Active Students</p>
                    <p className="text-4xl font-black text-brandRed">{stats.totalStudents}</p>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl shadow-xl">
                    <p className="text-zinc-500 font-bold uppercase text-sm mb-2">Pending Fees</p>
                    <p className="text-4xl font-black text-red-500">{stats.unpaidStudents} Students</p>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl shadow-xl">
                    <p className="text-zinc-500 font-bold uppercase text-sm mb-2">New Leads</p>
                    <p className="text-4xl font-black text-blue-500">{stats.leads}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl shadow-xl">
                    <h3 className="text-xl font-bold text-white mb-6 uppercase tracking-wider">Revenue Breakdown</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#fff' }} itemStyle={{ color: '#fff' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl shadow-xl">
                    <h3 className="text-xl font-bold text-white mb-6 uppercase tracking-wider">Students by Program</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={sportData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                                <XAxis dataKey="name" stroke="#a1a1aa" tick={{ fill: '#a1a1aa' }} />
                                <YAxis stroke="#a1a1aa" tick={{ fill: '#a1a1aa' }} />
                                <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#fff' }} cursor={{ fill: '#27272a' }} />
                                <Bar dataKey="count" fill="#d32f2f" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
