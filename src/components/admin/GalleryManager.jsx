import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, Upload, Plus, X, Image as ImageIcon, ArrowUp, ArrowDown, Save, Edit } from 'lucide-react';
import toast from 'react-hot-toast';

export default function GalleryManager() {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editData, setEditData] = useState(null);

    // Upload Form State
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [uploadType, setUploadType] = useState('General'); // 'General' or 'HallOfFame'
    const [hallOfFameData, setHallOfFameData] = useState({
        studentName: '',
        title: '',
        year: '',
        sport: ''
    });

    useEffect(() => {
        fetchImages();
    }, []);

    const fetchImages = async () => {
        try {
            const { data } = await axios.get('https://ssia-e4sn.onrender.com/api/gallery');
            setImages(data);
        } catch (error) {
            toast.error('Failed to load gallery');
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            const objectUrl = URL.createObjectURL(file);
            setPreview(objectUrl);
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!selectedFile) return toast.error('Please select an image first.');

        setUploading(true);
        const adminData = JSON.parse(localStorage.getItem('adminInfo'));

        const formData = new FormData();
        formData.append('image', selectedFile);
        formData.append('type', uploadType);

        if (uploadType === 'HallOfFame') {
            formData.append('studentName', hallOfFameData.studentName);
            formData.append('title', hallOfFameData.title);
            formData.append('year', hallOfFameData.year);
            formData.append('sport', hallOfFameData.sport);
        }

        try {
            await axios.post('https://ssia-e4sn.onrender.com/api/gallery', formData, {
                headers: {
                    Authorization: `Bearer ${adminData.token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            toast.success('Image uploaded successfully!');
            setIsUploadModalOpen(false);
            resetForm();
            fetchImages();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Upload failed');
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this image?')) return;

        try {
            const adminData = JSON.parse(localStorage.getItem('adminInfo'));
            await axios.delete(`https://ssia-e4sn.onrender.com/api/gallery/${id}`, {
                headers: { Authorization: `Bearer ${adminData.token}` }
            });
            toast.success('Image deleted');
            fetchImages();
        } catch (error) {
            toast.error('Failed to delete image');
        }
    };

    const resetForm = () => {
        setSelectedFile(null);
        setPreview(null);
        setUploadType('General');
        setHallOfFameData({ studentName: '', title: '', year: '', sport: '' });
    };

    const handleMove = (id, direction) => {
        const itemIndex = images.findIndex(img => img._id === id);
        if (itemIndex === -1) return;
        
        const type = images[itemIndex].type;
        const typeItems = images.filter(img => img.type === type);
        const typeIndex = typeItems.findIndex(img => img._id === id);
        
        if (direction === 'up' && typeIndex > 0) {
            const prevItem = typeItems[typeIndex - 1];
            const prevItemGlobalIndex = images.findIndex(img => img._id === prevItem._id);
            const newImages = [...images];
            [newImages[itemIndex], newImages[prevItemGlobalIndex]] = [newImages[prevItemGlobalIndex], newImages[itemIndex]];
            setImages(newImages);
        } else if (direction === 'down' && typeIndex < typeItems.length - 1) {
            const nextItem = typeItems[typeIndex + 1];
            const nextItemGlobalIndex = images.findIndex(img => img._id === nextItem._id);
            const newImages = [...images];
            [newImages[itemIndex], newImages[nextItemGlobalIndex]] = [newImages[nextItemGlobalIndex], newImages[itemIndex]];
            setImages(newImages);
        }
    };

    const handleSaveOrder = async () => {
        try {
            const adminData = JSON.parse(localStorage.getItem('adminInfo'));
            const items = images.map((img, index) => ({ id: img._id, order: index }));
            await axios.put('https://ssia-e4sn.onrender.com/api/gallery/reorder', { items }, {
                headers: { Authorization: `Bearer ${adminData.token}` }
            });
            toast.success('Order saved successfully');
        } catch (error) {
            toast.error('Failed to save order');
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const adminData = JSON.parse(localStorage.getItem('adminInfo'));
            await axios.put(`https://ssia-e4sn.onrender.com/api/gallery/${editData._id}`, editData, {
                headers: { Authorization: `Bearer ${adminData.token}` }
            });
            toast.success('Details updated!');
            setIsEditModalOpen(false);
            setEditData(null);
            fetchImages();
        } catch (error) {
            toast.error('Failed to update details');
        }
    };

    if (loading) return <div className="text-white">Loading Gallery...</div>;

    const generalImages = images.filter(img => img.type === 'General');
    const hallOfFameImages = images.filter(img => img.type === 'HallOfFame');

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex justify-between items-center bg-zinc-900 border border-zinc-800 p-6 rounded-2xl flex-wrap gap-4">
                <div>
                    <h2 className="text-2xl font-black text-white uppercase tracking-tight">Gallery Content Manager</h2>
                    <p className="text-gray-400 mt-1">Manage images for Hall of Fame and Action Gallery</p>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={handleSaveOrder}
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg flex items-center gap-2 uppercase tracking-wide text-sm"
                    >
                        <Save className="w-5 h-5" /> Save Order
                    </button>
                    <button
                        onClick={() => { resetForm(); setIsUploadModalOpen(true); }}
                        className="bg-brandRed hover:bg-red-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg flex items-center gap-2 uppercase tracking-wide text-sm"
                    >
                        <Plus className="w-5 h-5" /> Upload Photo
                    </button>
                </div>
            </div>

            {/* Hall Of Fame Section */}
            <div>
                <h3 className="text-xl font-bold text-white uppercase mb-4 border-b border-zinc-800 pb-2">Hall of Fame Records</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {hallOfFameImages.map((img, index) => (
                        <div key={img._id} className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden group">
                            <div className="h-48 overflow-hidden relative flex items-center justify-center bg-zinc-950">
                                {/* Local server serves from /uploads, thus HTTP is needed if relative path, prepended by the base url */}
                                <img src={img.imageUrl.startsWith('data:') || img.imageUrl.startsWith('http') ? img.imageUrl : `https://ssia-e4sn.onrender.com${img.imageUrl}`} alt="HoF" className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-500" />
                                <div className="absolute top-2 left-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    {index > 0 && <button onClick={() => handleMove(img._id, 'up')} className="bg-zinc-800 hover:bg-zinc-600 text-white p-1 rounded-md shadow-lg"><ArrowUp className="w-4 h-4" /></button>}
                                    {index < hallOfFameImages.length - 1 && <button onClick={() => handleMove(img._id, 'down')} className="bg-zinc-800 hover:bg-zinc-600 text-white p-1 rounded-md shadow-lg"><ArrowDown className="w-4 h-4" /></button>}
                                </div>
                                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => { setEditData(img); setIsEditModalOpen(true); }}
                                        className="bg-blue-600 hover:bg-blue-800 text-white p-2 rounded-full shadow-lg"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(img._id)}
                                        className="bg-red-600 hover:bg-red-800 text-white p-2 rounded-full shadow-lg"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            <div className="p-4">
                                <h4 className="font-bold text-white uppercase text-lg leading-tight">{img.studentName}</h4>
                                {img.sport && <p className="text-brandRed text-sm font-bold">{img.sport}</p>}
                                <p className="text-zinc-400 text-sm mt-1">{img.title} • {img.year}</p>
                            </div>
                        </div>
                    ))}
                    {hallOfFameImages.length === 0 && <p className="text-zinc-500 col-span-full">No Hall of Fame records found.</p>}
                </div>
            </div>

            {/* General Gallery Section */}
            <div className="pt-8">
                <h3 className="text-xl font-bold text-white uppercase mb-4 border-b border-zinc-800 pb-2">General Action Gallery</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {generalImages.map((img, index) => (
                        <div key={img._id} className="relative group overflow-hidden rounded-xl aspect-square bg-zinc-950 border border-zinc-800 flex items-center justify-center">
                            <img src={img.imageUrl.startsWith('data:') || img.imageUrl.startsWith('http') ? img.imageUrl : `https://ssia-e4sn.onrender.com${img.imageUrl}`} alt="Gallery" className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-500" />
                            <div className="absolute top-2 left-2 flex gap-1 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                                {index > 0 && <button onClick={() => handleMove(img._id, 'up')} className="bg-zinc-800 hover:bg-zinc-600 text-white p-1.5 rounded-full shadow-lg"><ArrowUp className="w-4 h-4" /></button>}
                                {index < generalImages.length - 1 && <button onClick={() => handleMove(img._id, 'down')} className="bg-zinc-800 hover:bg-zinc-600 text-white p-1.5 rounded-full shadow-lg"><ArrowDown className="w-4 h-4" /></button>}
                            </div>
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button
                                    onClick={() => handleDelete(img._id)}
                                    className="bg-red-600 hover:bg-red-800 text-white p-3 rounded-full transform scale-0 group-hover:scale-100 transition-transform delay-100 shadow-xl"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                    {generalImages.length === 0 && <p className="text-zinc-500 col-span-full">No general gallery images found.</p>}
                </div>
            </div>

            {/* Upload Modal */}
            {isUploadModalOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl animate-fade-in">
                        <div className="p-6 border-b border-zinc-800 flex justify-between items-center sticky top-0 bg-zinc-950 z-10">
                            <h3 className="text-xl font-bold text-white uppercase">Upload Image</h3>
                            <button onClick={() => setIsUploadModalOpen(false)} className="text-zinc-400 hover:text-white">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleUpload} className="p-6 space-y-6">

                            {/* File Input & Preview */}
                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-widest text-zinc-400 font-bold block mb-2">Select Image</label>
                                <div className="border-2 border-dashed border-zinc-700 hover:border-brandRed bg-zinc-900 rounded-xl p-4 text-center cursor-pointer relative transition-colors h-48 flex flex-col items-center justify-center">
                                    {preview ? (
                                        <div className="w-full h-full relative">
                                            <img src={preview} alt="Preview" className="max-h-full max-w-full object-contain mx-auto rounded" />
                                        </div>
                                    ) : (
                                        <>
                                            <ImageIcon className="w-10 h-10 text-zinc-500 mb-2" />
                                            <p className="text-zinc-400 font-medium">Click or drag image here</p>
                                        </>
                                    )}
                                    <input type="file" required accept="image/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                                </div>
                            </div>

                            {/* Section Type Selector */}
                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-widest text-zinc-400 font-bold">Image Destination</label>
                                <div className="flex bg-zinc-900 rounded-lg p-1 border border-zinc-800">
                                    <button
                                        type="button"
                                        className={`flex-1 py-2 text-sm font-bold rounded-md transition-colors ${uploadType === 'General' ? 'bg-brandRed text-white' : 'text-zinc-400 hover:text-white'}`}
                                        onClick={() => setUploadType('General')}
                                    >General Gallery</button>
                                    <button
                                        type="button"
                                        className={`flex-1 py-2 text-sm font-bold rounded-md transition-colors ${uploadType === 'HallOfFame' ? 'bg-brandRed text-white' : 'text-zinc-400 hover:text-white'}`}
                                        onClick={() => setUploadType('HallOfFame')}
                                    >Hall of Fame</button>
                                </div>
                            </div>

                            {/* Conditional Hall of Fame Fields */}
                            {uploadType === 'HallOfFame' && (
                                <div className="grid grid-cols-2 gap-4 animate-fade-in pt-4 border-t border-zinc-800">
                                    <div className="space-y-2 col-span-2">
                                        <label className="text-xs uppercase tracking-widest text-zinc-400 font-bold">Student or Team Name (Optional)</label>
                                        <input type="text" value={hallOfFameData.studentName} onChange={e => setHallOfFameData({ ...hallOfFameData, studentName: e.target.value })} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:border-brandRed outline-none" placeholder="e.g. Rahul Saini or ABC Team" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs uppercase tracking-widest text-zinc-400 font-bold">Sport (Optional)</label>
                                        <input type="text" value={hallOfFameData.sport} onChange={e => setHallOfFameData({ ...hallOfFameData, sport: e.target.value })} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:border-brandRed outline-none" placeholder="Leave blank if not applicable" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs uppercase tracking-widest text-zinc-400 font-bold">Year (Optional)</label>
                                        <input type="text" value={hallOfFameData.year} onChange={e => setHallOfFameData({ ...hallOfFameData, year: e.target.value })} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:border-brandRed outline-none" placeholder="e.g. 2024" />
                                    </div>
                                    <div className="space-y-2 col-span-2">
                                        <label className="text-xs uppercase tracking-widest text-zinc-400 font-bold">Achievement Title (Optional)</label>
                                        <input type="text" value={hallOfFameData.title} onChange={e => setHallOfFameData({ ...hallOfFameData, title: e.target.value })} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:border-brandRed outline-none" placeholder="e.g. National Gold Medalist" />
                                    </div>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={uploading}
                                className="w-full bg-brandRed hover:bg-red-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 uppercase tracking-wide disabled:opacity-50 transition-all mt-4"
                            >
                                {uploading ? 'Uploading...' : <><Upload className="w-5 h-5" /> Finalize Upload</>}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {isEditModalOpen && editData && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-md shadow-2xl animate-fade-in">
                        <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-950 rounded-t-2xl">
                            <h3 className="text-xl font-bold text-white uppercase">Edit Details</h3>
                            <button onClick={() => { setIsEditModalOpen(false); setEditData(null); }} className="text-zinc-400 hover:text-white">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-widest text-zinc-400 font-bold">Student or Team Name (Optional)</label>
                                <input type="text" value={editData.studentName || ''} onChange={e => setEditData({ ...editData, studentName: e.target.value })} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:border-brandRed outline-none" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-widest text-zinc-400 font-bold">Sport (Optional)</label>
                                <input type="text" value={editData.sport || ''} onChange={e => setEditData({ ...editData, sport: e.target.value })} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:border-brandRed outline-none" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-widest text-zinc-400 font-bold">Year (Optional)</label>
                                <input type="text" value={editData.year || ''} onChange={e => setEditData({ ...editData, year: e.target.value })} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:border-brandRed outline-none" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-widest text-zinc-400 font-bold">Achievement Title (Optional)</label>
                                <input type="text" value={editData.title || ''} onChange={e => setEditData({ ...editData, title: e.target.value })} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:border-brandRed outline-none" />
                            </div>
                            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl uppercase tracking-wide transition-all mt-4">
                                Save Changes
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
