import React, { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import html2canvas from 'html2canvas';

export default function IDCard({ student, onClose }) {
    const cardRef = useRef(null);

    const downloadIDCard = async () => {
        if (!cardRef.current) return;
        try {
            const canvas = await html2canvas(cardRef.current, { backgroundColor: null, scale: 3 });
            const image = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = image;
            link.download = `ID-CARD-${student.studentId}.png`;
            link.click();
        } catch (err) {
            console.error(err);
        }
    };

    if (!student) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-sm relative animate-zoom-in shadow-[0_0_50px_rgba(211,47,47,0.15)]">
                <button onClick={onClose} className="absolute -top-4 -right-4 bg-brandRed text-white w-8 h-8 rounded-full flex items-center justify-center font-bold shadow-lg hover:rotate-90 hover:scale-110 transition-all duration-300 z-50">X</button>

                {/* ID Card Design */}
                <div ref={cardRef} className="w-full bg-white text-black rounded-lg overflow-hidden shadow-2xl relative border-[6px] border-zinc-900 pb-4">
                    {/* Header */}
                    <div className="bg-brandRed pt-4 pb-12 text-center text-white relative">
                        <h2 className="font-black uppercase text-lg tracking-tight leading-none bg-black inline-block px-3 py-1 -skew-x-12 mb-1">
                            <span className="skew-x-12 block">SSIA</span>
                        </h2>
                        <p className="text-[10px] uppercase font-bold tracking-widest opacity-90">International Academy</p>
                    </div>

                    <div className="px-4 pb-4 flex flex-col items-center relative z-10">
                        {/* Photo Placeholder */}
                        <div className="w-24 h-24 rounded-bl-3xl rounded-tr-3xl overflow-hidden border-4 border-white shadow-xl bg-brandRed text-white flex items-center justify-center mb-4 -mt-10 mx-auto relative z-20">
                            <span className="text-4xl font-black uppercase">{student.fullName?.charAt(0) || 'S'}</span>
                        </div>

                        <div className="text-center mb-4 w-full">
                            <h3 className="font-black text-xl uppercase tracking-tighter">{student.fullName}</h3>
                            <p className="text-brandRed font-bold text-sm uppercase tracking-widest">{student.sport}</p>
                        </div>

                        <div className="w-full bg-zinc-100 rounded-lg p-3 text-xs font-semibold space-y-2 mb-4">
                            <div className="flex justify-between border-b border-zinc-300 pb-1">
                                <span className="text-zinc-500 uppercase">ID No.</span>
                                <span className="font-mono font-bold text-brandRed">{student.studentId}</span>
                            </div>
                            <div className="flex justify-between border-b border-zinc-300 pb-1">
                                <span className="text-zinc-500 uppercase">Joined</span>
                                <span>{new Date(student.dateOfJoining).toLocaleDateString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-zinc-500 uppercase">Contact</span>
                                <span>{student.phoneNumber || 'N/A'}</span>
                            </div>
                        </div>

                        {/* QR Code */}
                        <div className="flex justify-between items-center w-full px-2">
                            <div className="w-16 h-16 p-1 bg-white border border-zinc-200 rounded">
                                <QRCodeSVG value={`SSIA VERIFIED - ${student.studentId} - ${student.fullName}`} size={54} />
                            </div>
                            <div className="text-right">
                                <div className="w-20 border-b-2 border-black mb-1 mx-auto"></div>
                                <span className="text-[10px] uppercase font-bold text-zinc-500">Auth Signature</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-zinc-900 text-white text-[9px] text-center p-2 mt-2 uppercase tracking-widest">
                        If found, please return to: +91 74177 30440
                    </div>
                </div>

                <button onClick={downloadIDCard} className="w-full mt-6 bg-brandRed hover:bg-red-700 text-white font-black uppercase py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-brandRed/40 active:scale-95 hover:-translate-y-1">
                    Download as Image
                </button>
            </div>
        </div>
    );
}
