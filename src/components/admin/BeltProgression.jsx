import React, { useState } from 'react';
import axios from 'axios';
import { Award, Zap, Download, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const BELTS = ['White', 'Yellow', 'Green', 'Blue', 'Red', 'Black'];
const BELT_COLORS = {
    'White': '#ffffff',
    'Yellow': '#eab308',
    'Green': '#22c55e',
    'Blue': '#3b82f6',
    'Red': '#ef4444',
    'Black': '#111111'
};

export default function BeltProgression({ adminInfo, students, fetchStudents }) {
    const [search, setSearch] = useState('');

    const config = { headers: { Authorization: `Bearer ${adminInfo?.token}` } };

    const handleUpdateBelt = async (id, currentBelt) => {
        const currentIndex = BELTS.indexOf(currentBelt);
        if (currentIndex === BELTS.length - 1) return toast.error('Already at highest belt');

        const nextBelt = BELTS[currentIndex + 1];
        try {
            await axios.put(`https://ssia-e4sn.onrender.com/api/students/${id}/belt`, { currentBelt: nextBelt }, config);
            toast.success(`Promoted to ${nextBelt} Belt!`);
            if (fetchStudents) fetchStudents();
        } catch (err) {
            toast.error('Error updating belt');
        }
    };

    const handleAddClass = async (id) => {
        try {
            await axios.put(`https://ssia-e4sn.onrender.com/api/students/${id}/classes`, {}, config);
            toast.success('Class attended recorded');
            if (fetchStudents) fetchStudents();
        } catch (err) {
            toast.error('Error updating classes');
        }
    }

    const generateCertificate = async (student) => {
        const doc = new jsPDF('landscape', 'mm', 'a4');

        const getBeltRGB = (belt) => {
            switch (belt) {
                case 'White': return [240, 240, 240];
                case 'Yellow': return [234, 179, 8];
                case 'Green': return [34, 197, 94];
                case 'Blue': return [59, 130, 246];
                case 'Red': return [239, 68, 68];
                case 'Black': return [30, 30, 30];
                default: return [255, 255, 255];
            }
        };

        const loadImage = (url) => {
            return new Promise((resolve, reject) => {
                const img = new window.Image();
                img.crossOrigin = 'Anonymous';
                img.src = url;
                img.onload = () => resolve(img);
                img.onerror = (e) => reject(e);
            });
        };

        try {
            // Load the blank template
            const bgImg = await loadImage('/images/certificate_bg.jpg');
            // Add full background
            doc.addImage(bgImg, 'JPEG', 0, 0, 297, 210);

            // 1. Student Name
            doc.setFontSize(44);
            doc.setFont('times', 'bolditalic');
            doc.setTextColor(20, 20, 20);
            doc.text(student.fullName, 148.5, 87, { align: 'center' });

            // 2. Rank
            doc.setFontSize(28);
            doc.setFont('times', 'bold');
            const beltColorRGB = getBeltRGB(student.currentBelt || 'White');
            if (student.currentBelt === 'White') {
                doc.setTextColor(80, 80, 80);
            } else {
                doc.setTextColor(beltColorRGB[0], beltColorRGB[1], beltColorRGB[2]);
            }
            const beltName = `${student.currentBelt || 'White'} Belt`;
            // The blank line for the rank is below "and has been awarded the rank of"
            doc.text(beltName, 148.5, 122, { align: 'center' });

            // 3. Date
            doc.setTextColor(40, 40, 40);
            doc.setFontSize(14);
            doc.setFont('times', 'bold');
            const dateStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
            // Placement on the word "Date: _________" line
            doc.text(dateStr, 155, 137, { align: 'center' });

            // 4. Certificate ID (Update existing if you want, but the template already has one printed according to the image! If the template has it hardcoded, we should cover it or just not write it. Let's assume the blank template lacks it.)
            // Or maybe the user uploaded the template without the bottom right text? Let's just generate it dynamically somewhere.
            // Wait, the template image provided has "Certificate ID: SSIA-2026-011" hardcoded in the corner. If the user uses that EXACT image, it will have a hardcoded ID! I shouldn't print another one. 
            // Just to be safe, I'm not placing an ID overlay that might overlap.

            const filename = `${student.fullName.replace(/ /g, '_')}_Certificate.pdf`;
            doc.save(filename);
            toast.success("Certificate Downloaded!");

        } catch (error) {
            console.error(error);
            toast.error("Error! Please make sure you have saved the blank template as 'certificate_bg.jpg' inside the 'public/images/' folder.", { duration: 6000 });
        }
    };

    const filteredStudents = students.filter(s => s.fullName.toLowerCase().includes(search.toLowerCase()) || s.studentId.includes(search));

    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-6 border-b border-zinc-800 flex flex-col md:flex-row justify-between items-center bg-zinc-950 gap-4">
                <h3 className="text-xl font-black text-white uppercase tracking-wider flex items-center gap-2">
                    <Award className="w-6 h-6 text-brandRed" /> Belt Progression
                </h3>
                <div className="relative w-full md:w-auto">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 w-4 h-4" />
                    <input type="text" placeholder="Search student..." value={search} onChange={e => setSearch(e.target.value)} className="w-full md:w-64 pl-10 pr-4 py-3 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-brandRed transition-colors" />
                </div>
            </div>
            <div className="overflow-x-auto min-h-[400px]">
                <table className="w-full text-left border-collapse whitespace-nowrap">
                    <thead className="bg-zinc-950 text-zinc-400 text-xs uppercase tracking-widest border-b border-zinc-800">
                        <tr>
                            <th className="py-5 px-6 font-bold">Student</th>
                            <th className="py-5 px-6 font-bold">Current Belt</th>
                            <th className="py-5 px-6 font-bold text-center">Classes Attended</th>
                            <th className="py-5 px-6 font-bold text-right" colSpan="2">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/50">
                        {filteredStudents.map(student => (
                            <tr key={student._id} className="hover:bg-zinc-800/30 transition-all">
                                <td className="py-5 px-6">
                                    <p className="font-bold text-white text-lg">{student.fullName}</p>
                                    <p className="font-mono text-xs text-zinc-500">{student.sport}</p>
                                </td>
                                <td className="py-5 px-6">
                                    <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase border ${student.currentBelt === 'Black' ? 'bg-zinc-100 text-black' : 'bg-zinc-800 text-white border-zinc-700'}`}>
                                        {student.currentBelt || 'White'}
                                    </span>
                                </td>
                                <td className="py-5 px-6 text-center">
                                    <div className="flex items-center justify-center gap-3">
                                        <span className="text-white font-bold text-xl">{student.classesAttended || 0}</span>
                                        <button onClick={() => handleAddClass(student._id)} className="w-8 h-8 rounded-lg bg-zinc-800 hover:bg-brandRed flex items-center justify-center text-white transition-all shadow-lg">
                                            <Zap className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <p className="text-[10px] text-zinc-500 mt-1">Min 40 required</p>
                                </td>
                                <td className="py-5 px-6 text-right w-32">
                                    <button onClick={() => handleUpdateBelt(student._id, student.currentBelt)} className="bg-blue-500/10 hover:bg-blue-500 text-blue-500 hover:text-white px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-all border border-blue-500/20 w-full mb-2">
                                        Promote Belt
                                    </button>
                                    <button onClick={() => generateCertificate(student)} className="bg-zinc-800 hover:bg-white text-white hover:text-black px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 w-full">
                                        <Download className="w-3 h-3" /> Certificate
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
