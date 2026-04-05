import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CreditCard, History, CheckCircle, Search, Calendar, Download, X } from 'lucide-react';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import { format } from 'date-fns';

export default function FeesManager({ adminInfo, students, fetchStudents }) {
    const [feesHistory, setFeesHistory] = useState([]);
    const [search, setSearch] = useState('');
    const [paymentModal, setPaymentModal] = useState({ show: false, student: null, amount: '', method: 'Cash', monthPaidFor: '' });
    const currentMonthStr = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });

    const config = { headers: { Authorization: `Bearer ${adminInfo?.token}` } };

    useEffect(() => {
        fetchFees();
    }, []);

    const fetchFees = async () => {
        try {
            const { data } = await axios.get('https://ssia-e4sn.onrender.com/api/fees', config);
            setFeesHistory(data);
        } catch (err) {
            toast.error('Failed to load fee history');
        }
    };

    const generateReceipt = (student, amount, method, dateStr) => {
        const doc = new jsPDF();
        doc.setFillColor(24, 24, 27);
        doc.rect(0, 0, 210, 40, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(22);
        doc.text("SSIA MARTIAL ARTS", 105, 20, { align: 'center' });
        doc.setFontSize(12);
        doc.setTextColor(211, 47, 47);
        doc.text("Official Payment Receipt", 105, 30, { align: 'center' });

        doc.setTextColor(0, 0, 0);
        doc.setFontSize(12);
        doc.text(`Receipt Date: ${format(new Date(), 'PPpp')}`, 20, 60);
        doc.text(`Student Name: ${student.fullName}`, 20, 75);
        doc.text(`Student ID: ${student.studentId}`, 20, 85);
        doc.text(`Program: ${student.sport}`, 20, 95);

        doc.setLineWidth(0.5);
        doc.line(20, 105, 190, 105);

        doc.setFontSize(14);
        doc.text(`Amount Paid: Rs. ${amount}`, 20, 120);
        doc.text(`Payment Method: ${method}`, 20, 130);
        doc.text(`For Month: ${dateStr}`, 20, 140);

        doc.line(20, 150, 190, 150);
        doc.text("Authorized Signature", 140, 180);

        doc.save(`Receipt_${student.studentId}_${Date.now()}.pdf`);
    };

    const handleProcessPayment = async (e) => {
        e.preventDefault();
        try {
            await axios.post('https://ssia-e4sn.onrender.com/api/fees', {
                studentId: paymentModal.student._id,
                amount: paymentModal.amount,
                monthPaidFor: paymentModal.monthPaidFor,
                paymentMethod: paymentModal.method
            }, config);

            toast.success('Fee recorded! Generating receipt...');
            generateReceipt(paymentModal.student, paymentModal.amount, paymentModal.method, paymentModal.monthPaidFor);

            setPaymentModal({ show: false, student: null, amount: '', method: 'Cash', monthPaidFor: '' });
            fetchFees();
            if (fetchStudents) fetchStudents();
        } catch (err) {
            toast.error('Error recording fee');
        }
    };

    const unpaidStudents = students.filter(s => (s.feesStatus !== 'Paid' || (s.pendingMonths && s.pendingMonths.length > 0)) && (s.fullName.toLowerCase().includes(search.toLowerCase()) || s.studentId.includes(search)));

    return (
        <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
                    <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-950">
                        <h3 className="text-xl font-black text-white uppercase tracking-wider flex items-center gap-2">
                            <CreditCard className="w-5 h-5 text-brandRed" /> Pending Fees
                        </h3>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 w-4 h-4" />
                            <input type="text" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="w-48 pl-10 pr-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white text-sm focus:outline-none focus:border-brandRed transition-colors" />
                        </div>
                    </div>
                    <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
                        <table className="w-full text-left border-collapse whitespace-nowrap">
                            <thead className="sticky top-0 bg-zinc-950">
                                <tr className="text-zinc-400 text-xs uppercase tracking-widest border-b border-zinc-800">
                                    <th className="py-4 px-6 font-bold">Student</th>
                                    <th className="py-4 px-6 font-bold">Amt Due</th>
                                    <th className="py-4 px-6 font-bold text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-800/50">
                                {unpaidStudents.map(student => (
                                    <tr key={student._id} className="hover:bg-zinc-800/30 transition-all">
                                        <td className="py-4 px-6">
                                            <p className="font-bold text-white text-md">{student.fullName}</p>
                                            <p className="font-mono text-xs text-zinc-500">{student.studentId}</p>
                                            {student.pendingMonths && student.pendingMonths.length > 0 && (
                                                <div className="flex flex-wrap gap-1 mt-1">
                                                    {student.pendingMonths.map(pm => (
                                                        <span key={pm} className="text-[10px] bg-red-500/10 text-brandRed px-2 py-0.5 rounded border border-red-500/20">{pm} Due</span>
                                                    ))}
                                                </div>
                                            )}
                                        </td>
                                        <td className="py-4 px-6 text-brandRed font-bold">₹{student.monthlyFeeAmount}</td>
                                        <td className="py-4 px-6 text-right">
                                            <button onClick={() => setPaymentModal({ show: true, student, amount: student.monthlyFeeAmount, method: 'Cash', monthPaidFor: student.pendingMonths && student.pendingMonths.length > 0 ? student.pendingMonths[0] : currentMonthStr })} className="bg-green-500/10 hover:bg-green-500 text-green-500 hover:text-white px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-all border border-green-500/20 flex items-center gap-2 ml-auto">
                                                <CheckCircle className="w-4 h-4" /> Collect Fee
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {unpaidStudents.length === 0 && (
                                    <tr><td colSpan="3" className="py-12 text-center text-zinc-500 font-bold uppercase tracking-widest text-sm">No Pending Fees</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
                    <div className="p-6 border-b border-zinc-800 bg-zinc-950 flex justify-between items-center">
                        <h3 className="text-xl font-black text-white uppercase tracking-wider flex items-center gap-2">
                            <History className="w-5 h-5 text-green-500" /> Payment History
                        </h3>
                    </div>
                    <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
                        <table className="w-full text-left border-collapse whitespace-nowrap">
                            <thead className="sticky top-0 bg-zinc-950">
                                <tr className="text-zinc-400 text-xs uppercase tracking-widest border-b border-zinc-800">
                                    <th className="py-4 px-6 font-bold">Student</th>
                                    <th className="py-4 px-6 font-bold">Month</th>
                                    <th className="py-4 px-6 font-bold text-right">Amount / Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-800/50">
                                {feesHistory.map(fee => (
                                    <tr key={fee._id} className="hover:bg-zinc-800/30 transition-all">
                                        <td className="py-4 px-6">
                                            <p className="font-bold text-white max-w-[150px] truncate">{fee.studentId?.fullName || "Deleted Student"}</p>
                                            <p className="font-mono text-xs text-zinc-500">{fee.studentId?.studentId || "N/A"}</p>
                                        </td>
                                        <td className="py-4 px-6 text-zinc-300">
                                            <span className="flex items-center gap-1 text-sm bg-zinc-800 px-3 py-1 rounded w-fit"><Calendar className="w-3 h-3 text-brandRed" /> {fee.monthPaidFor}</span>
                                        </td>
                                        <td className="py-4 px-6 text-right flex items-center justify-end gap-3">
                                            <div>
                                                <p className="font-bold text-green-500">₹{fee.amount}</p>
                                                <p className="text-xs text-zinc-500">{new Date(fee.paymentDate).toLocaleDateString()}</p>
                                            </div>
                                            <button onClick={() => generateReceipt({fullName: fee.studentId?.fullName || "Deleted Student", studentId: fee.studentId?.studentId || "N/A", sport: "General"}, fee.amount, fee.paymentMethod || fee.method || 'Cash', fee.monthPaidFor)} className="p-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors border border-zinc-700" title="Download Slip">
                                                <Download className="w-4 h-4 text-brandRed" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {feesHistory.length === 0 && (
                                    <tr><td colSpan="3" className="py-12 text-center text-zinc-500">No payment history found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Payment Modal */}
            {
                paymentModal.show && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative">
                            <div className="bg-zinc-950 p-6 border-b border-zinc-800 flex justify-between items-center">
                                <h2 className="text-xl font-black uppercase tracking-tight text-white">Process Payment</h2>
                                <button onClick={() => setPaymentModal({ show: false, student: null, amount: '', method: 'Cash', monthPaidFor: '' })} className="text-zinc-500 hover:text-white"><X className="w-6 h-6" /></button>
                            </div>
                            <form onSubmit={handleProcessPayment} className="p-6 space-y-5">
                                <div>
                                    <p className="text-zinc-400 text-sm">Student</p>
                                    <p className="text-xl font-bold text-white">{paymentModal.student?.fullName}</p>
                                    <p className="text-brandRed text-sm font-bold uppercase">{paymentModal.student?.sport}</p>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Month Paid For</label>
                                    <select required value={paymentModal.monthPaidFor} onChange={e => setPaymentModal({ ...paymentModal, monthPaidFor: e.target.value })} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-500 transition-colors">
                                        <option value={currentMonthStr}>{currentMonthStr} (Current)</option>
                                        {paymentModal.student?.pendingMonths?.map(m => (
                                            <option key={m} value={m}>{m} (Pending)</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Amount to Pay (₹)</label>
                                    <input required type="number" value={paymentModal.amount} onChange={e => setPaymentModal({ ...paymentModal, amount: e.target.value })} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-500 transition-colors" />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Payment Method</label>
                                    <select required value={paymentModal.method} onChange={e => setPaymentModal({ ...paymentModal, method: e.target.value })} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-500 transition-colors">
                                        <option value="Cash">Cash</option>
                                        <option value="Online">Online / UPI</option>
                                        <option value="Card">Card</option>
                                    </select>
                                </div>

                                <button type="submit" className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-xl transition-all shadow-[0_0_15px_rgba(34,197,94,0.4)] uppercase tracking-wider text-sm flex items-center justify-center gap-2">
                                    <CheckCircle className="w-5 h-5" /> Generate Receipt
                                </button>
                            </form>
                        </div>
                    </div>
                )
            }
        </>
    );
}
