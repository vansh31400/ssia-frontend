import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { LogOut, Users, Search, CheckCircle, Plus, Trash2, Edit, X, RefreshCw, Award, Home, BarChart3, Package, CreditCard } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import IDCard from '../components/IDCard';
import Analytics from '../components/admin/Analytics';
import FeesManager from '../components/admin/FeesManager';
import InventoryManager from '../components/admin/InventoryManager';
import BeltProgression from '../components/admin/BeltProgression';
import GalleryManager from '../components/admin/GalleryManager';

export default function AdminDashboard() {
    const [students, setStudents] = useState([]);
    const [admissions, setAdmissions] = useState([]);
    const [search, setSearch] = useState('');
    const [activeTab, setActiveTab] = useState('analytics'); // 'analytics' | 'students' | 'admissions' | 'fees' | 'inventory' | 'belts' | 'gallery'
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [newStudent, setNewStudent] = useState({ fullName: '', sport: 'Taekwondo', phoneNumber: '', address: '', monthlyFeeAmount: 1500, dateOfJoining: new Date().toISOString().split('T')[0] });

    const navigate = useNavigate();
    const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));

    useEffect(() => {
        if (!adminInfo) navigate('/admin');
        else {
            fetchStudents();
            fetchAdmissions();
        }
    }, []);

    const config = { headers: { Authorization: `Bearer ${adminInfo?.token}` } };

    const fetchStudents = async () => {
        try {
            const { data } = await axios.get('https://ssia-e4sn.onrender.com/api/students', config);
            setStudents(data);
        } catch (err) { toast.error('Failed to load students'); }
    };

    const fetchAdmissions = async () => {
        try {
            const { data } = await axios.get('https://ssia-e4sn.onrender.com/api/admissions', config);
            setAdmissions(data);
        } catch (err) { toast.error('Failed to load admissions'); }
    };

    const handleAddStudent = async (e) => {
        e.preventDefault();
        try {
            await axios.post('https://ssia-e4sn.onrender.com/api/students', newStudent, config);
            toast.success('Student added successfully');
            setShowAddModal(false);
            setNewStudent({ fullName: '', sport: 'Taekwondo', phoneNumber: '', address: '', monthlyFeeAmount: 1500, dateOfJoining: new Date().toISOString().split('T')[0] });
            fetchStudents();
        } catch (err) { toast.error('Error adding student'); }
    };

    const markPaid = async (id) => {
        if (!window.confirm("Are you sure you want to mark this fee as paid?")) return;
        try {
            await axios.put(`https://ssia-e4sn.onrender.com/api/students/${id}/fees`, {}, config);
            toast.success('Fees updated to Paid');
            fetchStudents();
        } catch (err) { toast.error('Error updating fees'); }
    };

    const deleteStudent = async (id) => {
        if (!window.confirm('Are you sure you want to delete this student?')) return;
        try {
            await axios.delete(`https://ssia-e4sn.onrender.com/api/students/${id}`, config);
            toast.success('Student removed from system');
            fetchStudents();
        } catch (err) { toast.error('Error deleting student'); }
    };

    const handleLogout = () => {
        localStorage.removeItem('adminInfo');
        navigate('/admin');
    };

    const filteredData = activeTab === 'students'
        ? students.filter(s => s.fullName.toLowerCase().includes(search.toLowerCase()) || s.studentId.toLowerCase().includes(search.toLowerCase()) || s.sport.toLowerCase().includes(search.toLowerCase()))
        : admissions.filter(a => a.name.toLowerCase().includes(search.toLowerCase()) || a.selectedCourse.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="bg-brandDark min-h-screen p-4 md:p-8">
            <Toaster position="top-right" />

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center border border-zinc-700 shrink-0 overflow-hidden p-1">
                        <img src="/images/logo.png" alt="Logo" className="w-full h-full object-contain" />
                    </div>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-black text-white leading-tight">SSIA Admin <span className="text-brandRed">Area</span></h1>
                        <p className="text-zinc-400 text-xs md:text-sm font-medium tracking-wide uppercase">Command Center</p>
                    </div>
                </div>

                <div className="flex gap-3 flex-wrap w-full justify-start md:w-auto md:justify-end">
                    <button onClick={() => navigate('/')} className="flex-1 md:flex-none flex items-center justify-center bg-zinc-800 hover:bg-zinc-700 text-white px-5 py-3 rounded-xl transition-all font-bold group">
                        <Home className="w-5 h-5 md:mr-2 group-hover:-translate-y-1 transition-transform" /> <span className="hidden md:inline">Home</span>
                    </button>
                    <button onClick={() => { fetchStudents(); fetchAdmissions(); }} className="p-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl transition-all" title="Refresh Data">
                        <RefreshCw className="w-5 h-5" />
                    </button>
                    <button onClick={handleLogout} className="flex-1 md:flex-none flex items-center justify-center bg-zinc-800 hover:bg-brandRed text-white px-5 py-3 rounded-xl transition-all font-bold shadow-[0_0_15px_rgba(211,47,47,0)] hover:shadow-[0_0_15px_rgba(211,47,47,0.4)]">
                        <LogOut className="w-5 h-5 md:mr-2" /> <span className="hidden md:inline">Logout</span>
                    </button>
                </div>
            </div>

            {/* Tabs & Search */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-6 gap-6 w-full">
                <div className="flex bg-zinc-900 border border-zinc-800 rounded-xl p-1 gap-1 overflow-x-auto w-full max-w-full no-scrollbar overscroll-x-contain touch-pan-x">
                    <button onClick={() => setActiveTab('analytics')} className={`px-4 py-3 whitespace-nowrap rounded-lg font-bold uppercase tracking-wider text-sm transition-all flex items-center gap-2 ${activeTab === 'analytics' ? 'bg-brandRed text-white shadow-lg' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'}`}>
                        <BarChart3 className="w-4 h-4" /> Analytics
                    </button>
                    <button onClick={() => setActiveTab('students')} className={`px-4 py-3 whitespace-nowrap rounded-lg font-bold uppercase tracking-wider text-sm transition-all flex items-center gap-2 ${activeTab === 'students' ? 'bg-brandRed text-white shadow-lg' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'}`}>
                        <Users className="w-4 h-4" /> Students
                    </button>
                    <button onClick={() => setActiveTab('admissions')} className={`px-4 py-3 whitespace-nowrap rounded-lg font-bold uppercase tracking-wider text-sm transition-all flex items-center gap-2 ${activeTab === 'admissions' ? 'bg-brandRed text-white shadow-lg' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'}`}>
                        <Award className="w-4 h-4" /> Leads
                    </button>
                    <button onClick={() => setActiveTab('fees')} className={`px-4 py-3 whitespace-nowrap rounded-lg font-bold uppercase tracking-wider text-sm transition-all flex items-center gap-2 ${activeTab === 'fees' ? 'bg-brandRed text-white shadow-lg' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'}`}>
                        <CreditCard className="w-4 h-4" /> Fees
                    </button>
                    <button onClick={() => setActiveTab('inventory')} className={`px-4 py-3 whitespace-nowrap rounded-lg font-bold uppercase tracking-wider text-sm transition-all flex items-center gap-2 ${activeTab === 'inventory' ? 'bg-brandRed text-white shadow-lg' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'}`}>
                        <Package className="w-4 h-4" /> Inventory
                    </button>
                    <button onClick={() => setActiveTab('gallery')} className={`px-4 py-3 whitespace-nowrap rounded-lg font-bold uppercase tracking-wider text-sm transition-all flex items-center gap-2 ${activeTab === 'gallery' ? 'bg-brandRed text-white shadow-lg' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'}`}>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg> Gallery
                    </button>
                    <button onClick={() => setActiveTab('belts')} className={`px-4 py-3 whitespace-nowrap rounded-lg font-bold uppercase tracking-wider text-sm transition-all flex items-center gap-2 ${activeTab === 'belts' ? 'bg-brandRed text-white shadow-lg' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'}`}>
                        <Award className="w-4 h-4" /> Belts & Certs
                    </button>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full xl:w-auto">
                    <div className="relative flex-grow">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 w-5 h-5" />
                        <input
                            type="text" placeholder="Search by name, ID or sport..." value={search} onChange={e => setSearch(e.target.value)}
                            className="w-full xl:w-80 pl-12 pr-4 py-4 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-brandRed transition-colors"
                        />
                    </div>
                    {activeTab === 'students' && (
                        <button onClick={() => setShowAddModal(true)} className="bg-brandRed hover:bg-red-700 text-white px-6 py-4 rounded-xl font-bold flex items-center uppercase tracking-widest transition-transform shadow-[0_0_15px_rgba(211,47,47,0.3)] shadow-outline-red shrink-0">
                            <Plus className="w-5 h-5 mr-2" /> Add
                        </button>
                    )}
                </div>
            </div>

            {/* Main Content Area */}
            {activeTab === 'analytics' && <Analytics adminInfo={adminInfo} />}
            {activeTab === 'fees' && <FeesManager adminInfo={adminInfo} students={students} fetchStudents={fetchStudents} />}
            {activeTab === 'inventory' && <InventoryManager adminInfo={adminInfo} students={students} />}
            {activeTab === 'belts' && <BeltProgression adminInfo={adminInfo} students={students} fetchStudents={fetchStudents} />}
            {activeTab === 'gallery' && <GalleryManager adminInfo={adminInfo} />}

            {(activeTab === 'students' || activeTab === 'admissions') && (
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl relative">
                    <div className="overflow-x-auto min-h-[500px]">
                        <table className="w-full text-left border-collapse whitespace-nowrap">
                            <thead>
                                <tr className="bg-zinc-950 text-zinc-400 text-sm uppercase tracking-widest border-b border-zinc-800">
                                    {activeTab === 'students' ? (
                                        <>
                                            <th className="py-5 px-6 font-bold w-32">ID #</th>
                                            <th className="py-5 px-6 font-bold">Student Name</th>
                                            <th className="py-5 px-6 font-bold">Program</th>
                                            <th className="py-5 px-6 font-bold">Joined</th>
                                            <th className="py-5 px-6 font-bold text-center">Fees Status</th>
                                            <th className="py-5 px-6 font-bold text-right">Actions</th>
                                        </>
                                    ) : (
                                        <>
                                            <th className="py-5 px-6 font-bold">Applicant Name</th>
                                            <th className="py-5 px-6 font-bold">Program</th>
                                            <th className="py-5 px-6 font-bold">Age</th>
                                            <th className="py-5 px-6 font-bold">Contact</th>
                                            <th className="py-5 px-6 font-bold">Message</th>
                                            <th className="py-5 px-6 font-bold text-right">Date</th>
                                        </>
                                    )}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-800/50">
                                {filteredData.map(item => (
                                    <tr key={item._id} className="hover:bg-zinc-800/30 transition-all group">
                                        {activeTab === 'students' ? (
                                            <>
                                                <td className="py-5 px-6"><span className="px-3 py-1 bg-zinc-800 rounded-md font-mono text-zinc-300 font-bold border border-zinc-700 text-sm group-hover:border-brandRed transition-colors">{item.studentId}</span></td>
                                                <td className="py-5 px-6 font-bold text-white text-lg">{item.fullName}</td>
                                                <td className="py-5 px-6 text-zinc-400 font-medium">{item.sport}</td>
                                                <td className="py-5 px-6 text-zinc-400">{new Date(item.dateOfJoining).toLocaleDateString()}</td>
                                                <td className="py-5 px-6 text-center">
                                                    <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border ${item.feesStatus === 'Paid' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-brandRed/10 text-brandRed border-brandRed/20'}`}>
                                                        {item.feesStatus}
                                                    </span>
                                                </td>
                                                <td className="py-5 px-6 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        {item.feesStatus !== 'Paid' && (
                                                            <button onClick={() => markPaid(item._id)} className="p-2 bg-green-500/10 hover:bg-green-500 text-green-500 hover:text-white rounded-lg transition-all border border-green-500/20" title="Mark Fees Paid">
                                                                <CheckCircle className="w-5 h-5" />
                                                            </button>
                                                        )}
                                                        <button onClick={() => setSelectedStudent(item)} className="p-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-all" title="View ID Card">
                                                            <Award className="w-5 h-5 text-zinc-300" />
                                                        </button>
                                                        <button onClick={() => deleteStudent(item._id)} className="p-2 bg-red-500/10 hover:bg-brandRed border border-red-500/20 text-brandRed hover:text-white rounded-lg transition-all" title="Delete Student">
                                                            <Trash2 className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </>
                                        ) : (
                                            <>
                                                <td className="py-5 px-6 font-bold text-white">{item.name}</td>
                                                <td className="py-5 px-6 text-brandRed font-bold uppercase text-xs tracking-widest">{item.selectedCourse}</td>
                                                <td className="py-5 px-6 text-zinc-400">{item.age}</td>
                                                <td className="py-5 px-6 font-mono text-zinc-300">{item.phone}</td>
                                                <td className="py-5 px-6 text-zinc-400 max-w-[200px] truncate">{item.message || '-'}</td>
                                                <td className="py-5 px-6 text-right text-zinc-500 text-sm whitespace-nowrap">{new Date(item.createdAt).toLocaleDateString()}</td>
                                            </>
                                        )}
                                    </tr>
                                ))}

                                {filteredData.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="py-16 text-center">
                                            <div className="inline-flex flex-col items-center justify-center text-zinc-500">
                                                <Search className="w-12 h-12 mb-4 opacity-50" />
                                                <p className="text-xl font-bold uppercase tracking-widest">No Records Found</p>
                                                <p className="text-sm mt-2 opacity-70">Try adjusting your search criteria</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Add Student Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl relative">
                        <div className="bg-zinc-950 p-6 border-b border-zinc-800 flex justify-between items-center">
                            <h2 className="text-xl font-black uppercase tracking-tight">Add New <span className="text-brandRed">Student</span></h2>
                            <button onClick={() => setShowAddModal(false)} className="text-zinc-500 hover:text-white"><X className="w-6 h-6" /></button>
                        </div>

                        <form onSubmit={handleAddStudent} className="p-4 md:p-6 space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Full Name *</label>
                                    <input required type="text" value={newStudent.fullName} onChange={e => setNewStudent({ ...newStudent, fullName: e.target.value })} pattern="[A-Za-z\s]+" title="Please enter a valid name using alphabets" className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brandRed transition-colors" placeholder="Enter Student's Full Name" />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Program *</label>
                                    <select required value={newStudent.sport} onChange={e => setNewStudent({ ...newStudent, sport: e.target.value })} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brandRed transition-colors appearance-none">
                                        <option value="Taekwondo">Taekwondo</option>
                                        <option value="Kickboxing">Kickboxing</option>
                                        <option value="Jeet Kune Do">Jeet Kune Do</option>
                                        <option value="MMA">MMA</option>
                                        <option value="Yoga">Yoga</option>
                                        <option value="Midbrain Activation">Midbrain Activation</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Monthly Fee (₹) *</label>
                                    <input required type="number" value={newStudent.monthlyFeeAmount} onChange={e => setNewStudent({ ...newStudent, monthlyFeeAmount: e.target.value })} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brandRed transition-colors" />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Joining Date *</label>
                                    <input required type="date" max={new Date().toISOString().split('T')[0]} value={newStudent.dateOfJoining} onChange={e => setNewStudent({ ...newStudent, dateOfJoining: e.target.value })} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brandRed transition-colors [color-scheme:dark]" />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Phone Number *</label>
                                    <input required type="text" value={newStudent.phoneNumber} onChange={e => {
                                        const onlyNums = e.target.value.replace(/\D/g, '').slice(0, 10);
                                        setNewStudent({ ...newStudent, phoneNumber: onlyNums });
                                    }} minLength={10} maxLength={10} pattern="[0-9]{10}" title="Please enter exactly 10 digits" className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brandRed transition-colors" placeholder="Enter 10-digit Mobile Number" />
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Home Address *</label>
                                    <textarea required value={newStudent.address} onChange={e => setNewStudent({ ...newStudent, address: e.target.value })} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brandRed transition-colors" rows="2" placeholder="Enter complete residential address"></textarea>
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4 mt-4 border-t border-zinc-800">
                                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-4 rounded-xl transition-all uppercase tracking-wider text-sm">Cancel</button>
                                <button type="submit" className="flex-1 bg-brandRed hover:bg-red-700 text-white font-bold py-4 rounded-xl transition-all shadow-[0_0_15px_rgba(211,47,47,0.4)] uppercase tracking-wider text-sm">Save Student</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* View ID Card Wrapper */}
            {selectedStudent && (
                <IDCard student={selectedStudent} onClose={() => setSelectedStudent(null)} />
            )}
        </div>
    );
}
