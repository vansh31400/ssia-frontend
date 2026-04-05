import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Package, Plus, Edit2, Trash2, CheckCircle, ShoppingBag, X, Download, History } from 'lucide-react';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import { format } from 'date-fns';

export default function InventoryManager({ adminInfo, students }) {
    const [items, setItems] = useState([]);
    const [sales, setSales] = useState([]);
    const [newItem, setNewItem] = useState({ itemName: '', category: 'Uniform', price: '', stock: '' });
    const [sellModal, setSellModal] = useState({ show: false, item: null, studentId: '', quantity: 1 });

    const config = { headers: { Authorization: `Bearer ${adminInfo?.token}` } };

    useEffect(() => {
        fetchInventory();
        fetchSales();
    }, []);

    const fetchSales = async () => {
        try {
            const { data } = await axios.get('https://ssia-e4sn.onrender.com/api/inventory/sales', config);
            setSales(data);
        } catch (err) {
            toast.error('Failed to load sales history');
        }
    };

    const generateReceipt = (sale) => {
        const doc = new jsPDF();
        doc.setFillColor(24, 24, 27);
        doc.rect(0, 0, 210, 40, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(22);
        doc.text("SSIA MARTIAL ARTS", 105, 20, { align: 'center' });
        doc.setFontSize(12);
        doc.setTextColor(59, 130, 246);
        doc.text("Inventory Purchase Receipt", 105, 30, { align: 'center' });

        doc.setTextColor(0, 0, 0);
        doc.setFontSize(12);
        doc.text(`Receipt Date: ${format(new Date(), 'PPpp')}`, 20, 60);
        doc.text(`Sold To: ${sale.studentId ? sale.studentId.fullName : 'Guest'}`, 20, 75);
        if (sale.studentId) doc.text(`Student ID: ${sale.studentId.studentId}`, 20, 85);
        
        doc.text(`Item: ${sale.itemId?.itemName || 'Deleted Item'}`, 20, sale.studentId ? 95 : 85);
        doc.text(`Quantity: ${sale.quantity}`, 20, sale.studentId ? 105 : 95);

        doc.setLineWidth(0.5);
        doc.line(20, sale.studentId ? 115 : 105, 190, sale.studentId ? 115 : 105);

        doc.setFontSize(14);
        doc.text(`Total Paid: Rs. ${sale.totalPrice}`, 20, sale.studentId ? 130 : 120);

        doc.line(20, sale.studentId ? 140 : 130, 190, sale.studentId ? 140 : 130);
        doc.text("Authorized Signature", 140, sale.studentId ? 170 : 160);

        doc.save(`Receipt_Inventory_${Date.now()}.pdf`);
    };

    const fetchInventory = async () => {
        try {
            const { data } = await axios.get('https://ssia-e4sn.onrender.com/api/inventory', config);
            setItems(data);
        } catch (err) {
            toast.error('Failed to load inventory');
        }
    };

    const handleAddItem = async (e) => {
        e.preventDefault();
        try {
            await axios.post('https://ssia-e4sn.onrender.com/api/inventory', newItem, config);
            toast.success('Item added to inventory');
            setNewItem({ itemName: '', category: 'Uniform', price: '', stock: '' });
            fetchInventory();
        } catch (err) {
            toast.error('Error adding item');
        }
    };

    const handleUpdateStock = async (id, currentStock, change) => {
        const newStock = currentStock + change;
        if (newStock < 0) return toast.error('Stock cannot be negative');

        try {
            await axios.put(`https://ssia-e4sn.onrender.com/api/inventory/${id}`, { stock: newStock }, config);
            toast.success('Stock updated');
            fetchInventory();
        } catch (err) {
            toast.error('Error updating stock');
        }
    };

    const handleSellItem = async (e) => {
        e.preventDefault();
        try {
            const totalPrice = sellModal.item.price * sellModal.quantity;
            await axios.post('https://ssia-e4sn.onrender.com/api/inventory/sell', {
                studentId: sellModal.studentId || null,
                itemId: sellModal.item._id,
                quantity: sellModal.quantity,
                totalPrice
            }, config);

            toast.success('Item sold successfully!');
            setSellModal({ show: false, item: null, studentId: '', quantity: 1 });
            fetchInventory();
            fetchSales();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Error selling item');
        }
    };

    return (
        <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Add Item Form */}
                <div className="col-span-1 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl h-fit">
                    <h3 className="text-xl font-black text-white uppercase tracking-wider mb-6 flex items-center gap-2">
                        <Package className="w-5 h-5 text-brandRed" /> Add Item
                    </h3>
                    <form onSubmit={handleAddItem} className="space-y-4">
                        <div>
                            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Item Name</label>
                            <input required type="text" value={newItem.itemName} onChange={e => setNewItem({ ...newItem, itemName: e.target.value })} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brandRed transition-colors mt-2" placeholder="e.g. Red Training Gloves" />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Category</label>
                            <select required value={newItem.category} onChange={e => setNewItem({ ...newItem, category: e.target.value })} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brandRed transition-colors mt-2">
                                <option value="Uniform">Uniform</option>
                                <option value="Gloves">Gloves</option>
                                <option value="Shin Guards">Shin Guards</option>
                                <option value="Weapon">Weapon</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Price (₹)</label>
                                <input required type="number" value={newItem.price} onChange={e => setNewItem({ ...newItem, price: e.target.value })} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brandRed transition-colors mt-2" />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Init. Stock</label>
                                <input required type="number" value={newItem.stock} onChange={e => setNewItem({ ...newItem, stock: e.target.value })} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brandRed transition-colors mt-2" />
                            </div>
                        </div>
                        <button type="submit" className="w-full bg-brandRed hover:bg-red-700 text-white font-bold py-4 mt-6 rounded-xl transition-all shadow-[0_0_15px_rgba(211,47,47,0.4)] uppercase tracking-wider text-sm flex items-center justify-center gap-2">
                            <Plus className="w-5 h-5" /> Add to Inventory
                        </button>
                    </form>
                </div>

                {/* Inventory Table */}
                <div className="col-span-1 lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
                    <div className="overflow-x-auto min-h-[400px]">
                        <table className="w-full text-left border-collapse whitespace-nowrap">
                            <thead>
                                <tr className="bg-zinc-950 text-zinc-400 text-sm uppercase tracking-widest border-b border-zinc-800">
                                    <th className="py-5 px-6 font-bold">Item Name</th>
                                    <th className="py-5 px-6 font-bold">Category</th>
                                    <th className="py-5 px-6 font-bold">Price</th>
                                    <th className="py-5 px-6 font-bold text-center">Stock</th>
                                    <th className="py-5 px-6 font-bold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-800/50">
                                {items.map(item => (
                                    <tr key={item._id} className="hover:bg-zinc-800/30 transition-all group">
                                        <td className="py-4 px-6 font-bold text-white">{item.itemName}</td>
                                        <td className="py-4 px-6 text-zinc-400">{item.category}</td>
                                        <td className="py-4 px-6 text-green-500 font-bold">₹{item.price.toLocaleString()}</td>
                                        <td className="py-4 px-6 text-center">
                                            <span className={`px-4 py-1.5 rounded-full text-xs font-black border ${item.stock <= 5 ? 'bg-brandRed/10 text-brandRed border-brandRed/20' : 'bg-green-500/10 text-green-500 border-green-500/20'}`}>
                                                {item.stock} in stock
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <div className="flex justify-end gap-2 items-center">
                                                <button onClick={() => setSellModal({ show: true, item, studentId: '', quantity: 1 })} disabled={item.stock === 0} className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${item.stock > 0 ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg' : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'}`} title="Sell Item">
                                                    <ShoppingBag className="w-4 h-4" />
                                                </button>
                                                <div className="w-px h-6 bg-zinc-800 mx-2"></div>
                                                <button onClick={() => handleUpdateStock(item._id, item.stock, -1)} className="w-8 h-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-white border border-zinc-700 transition-colors">-</button>
                                                <span className="text-white font-bold w-6 text-center">{item.stock}</span>
                                                <button onClick={() => handleUpdateStock(item._id, item.stock, 1)} className="w-8 h-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-white border border-zinc-700 transition-colors">+</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {items.length === 0 && (
                                    <tr><td colSpan="5" className="py-12 text-center text-zinc-500">No inventory items. Use the form to add some.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Sales History Table */}
            <div className="mt-8 bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
                <div className="p-6 border-b border-zinc-800 bg-zinc-950 flex justify-between items-center">
                    <h3 className="text-xl font-black text-white uppercase tracking-wider flex items-center gap-2">
                        <History className="w-5 h-5 text-blue-500" /> Sales History
                    </h3>
                </div>
                <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
                    <table className="w-full text-left border-collapse whitespace-nowrap">
                        <thead className="sticky top-0 bg-zinc-950">
                            <tr className="text-zinc-400 text-xs uppercase tracking-widest border-b border-zinc-800">
                                <th className="py-4 px-6 font-bold">Date</th>
                                <th className="py-4 px-6 font-bold">Item</th>
                                <th className="py-4 px-6 font-bold">Qty</th>
                                <th className="py-4 px-6 font-bold">Sold To</th>
                                <th className="py-4 px-6 font-bold text-right">Total (₹) / Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800/50">
                            {sales.map(s => (
                                <tr key={s._id} className="hover:bg-zinc-800/30 transition-all">
                                    <td className="py-4 px-6 text-zinc-400 text-sm">{new Date(s.createdAt).toLocaleDateString()}</td>
                                    <td className="py-4 px-6 font-bold text-white max-w-[150px] truncate">{s.itemId?.itemName || "Deleted Item"}</td>
                                    <td className="py-4 px-6 text-zinc-300 font-bold">{s.quantity}</td>
                                    <td className="py-4 px-6">
                                        <p className="font-bold text-white text-sm">{s.studentId?.fullName || "Guest"}</p>
                                        <p className="font-mono text-xs text-zinc-500">{s.studentId?.studentId || "Walk-in"}</p>
                                    </td>
                                    <td className="py-4 px-6 text-right flex items-center justify-end gap-3">
                                        <div className="font-bold text-blue-500">₹{s.totalPrice}</div>
                                        <button onClick={() => generateReceipt(s)} className="p-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors border border-zinc-700" title="Download Receipt">
                                            <Download className="w-4 h-4 text-blue-500" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {sales.length === 0 && (
                                <tr><td colSpan="5" className="py-12 text-center text-zinc-500">No sales history found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Sell Modal */}
            {
                sellModal.show && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative">
                            <div className="bg-zinc-950 p-6 border-b border-zinc-800 flex justify-between items-center">
                                <h2 className="text-xl font-black uppercase tracking-tight text-white flex items-center gap-2"><ShoppingBag className="w-6 h-6 text-blue-500" /> Sell Item</h2>
                                <button onClick={() => setSellModal({ show: false, item: null, studentId: '', quantity: 1 })} className="text-zinc-500 hover:text-white"><X className="w-6 h-6" /></button>
                            </div>
                            <form onSubmit={handleSellItem} className="p-6 space-y-5">
                                <div>
                                    <p className="text-zinc-400 text-sm">Selling</p>
                                    <p className="text-xl font-bold text-white">{sellModal.item?.itemName}</p>
                                    <p className="text-blue-500 text-sm font-bold uppercase">₹{sellModal.item?.price} per unit</p>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Select Student (Optional)</label>
                                    <select value={sellModal.studentId} onChange={e => setSellModal({ ...sellModal, studentId: e.target.value })} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors">
                                        <option value="">Walk-in Customer / Guest</option>
                                        {students?.map(s => (
                                            <option key={s._id} value={s._id}>{s.fullName} ({s.studentId})</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Quantity</label>
                                    <input required type="number" min="1" max={sellModal.item?.stock} value={sellModal.quantity} onChange={e => setSellModal({ ...sellModal, quantity: e.target.value })} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors" />
                                </div>

                                <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 flex justify-between items-center mt-4">
                                    <span className="text-zinc-400 font-bold uppercase text-xs tracking-widest">Total Amount</span>
                                    <span className="text-2xl font-black text-white">₹{sellModal.item?.price * sellModal.quantity}</span>
                                </div>

                                <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 rounded-xl transition-all shadow-[0_0_15px_rgba(59,130,246,0.4)] uppercase tracking-wider text-sm flex items-center justify-center gap-2">
                                    <CheckCircle className="w-5 h-5" /> Complete Sale
                                </button>
                            </form>
                        </div>
                    </div>
                )
            }
        </>
    );
}
