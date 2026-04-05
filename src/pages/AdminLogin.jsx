import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';

export default function AdminLogin() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handlePasswordLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await axios.post('https://ssia-e4sn.onrender.com/api/auth/login', { username, password });
            localStorage.setItem('adminInfo', JSON.stringify(data));
            navigate('/admin/dashboard');
        } catch (error) {
            alert(error.response?.data?.message || 'Login Failed');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLoginSuccess = async (credentialResponse) => {
        setLoading(true);
        try {
            // Send the Google-provided JWT to backend for server-side verification
            const { data } = await axios.post('https://ssia-e4sn.onrender.com/api/auth/google', {
                token: credentialResponse.credential
            });
            localStorage.setItem('adminInfo', JSON.stringify(data));
            navigate('/admin/dashboard');
        } catch (error) {
            alert(error.response?.data?.message || 'Google Auth Verification Failed');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLoginError = () => {
        alert('Google Sign In was unsuccessful. Try again later');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-brandDark p-4 relative overflow-hidden">
            {/* Background Animations */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brandRed rounded-full opacity-10 blur-[100px] animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-900 rounded-full opacity-10 blur-[100px] animate-pulse" style={{ animationDelay: '1s' }}></div>

            <div className="bg-zinc-900/80 backdrop-blur-xl p-8 md:p-10 rounded-3xl max-w-md w-full border border-zinc-800 shadow-[0_0_50px_rgba(0,0,0,0.5)] z-10 animate-fade-in relative">
                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
                    <div className="w-24 h-24 bg-white border border-zinc-700 shadow-2xl rounded-full flex items-center justify-center mb-6 overflow-hidden p-2">
                        <img src="/images/logo.png" alt="SSIA Logo" className="w-full h-full object-contain" />
                    </div>
                </div>

                <h2 className="text-3xl font-black text-center mt-8 mb-2 tracking-tight">Admin <span className="text-brandRed">Portal</span></h2>
                <p className="text-gray-400 text-center text-sm font-medium mb-8">Secure Access Hub</p>

                {/* Password Flow */}
                <form onSubmit={handlePasswordLogin} className="space-y-4 animate-slide-up">
                    <div className="space-y-1">
                        <label className="text-xs uppercase tracking-widest text-gray-400 font-bold ml-1">Username</label>
                        <input
                            type="text"
                            placeholder="Enter admin username"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-brandRed transition-colors"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs uppercase tracking-widest text-gray-400 font-bold ml-1">Password</label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-brandRed transition-colors mb-2"
                        />
                    </div>

                    <button disabled={loading} type="submit" className="w-full bg-brandRed hover:bg-red-700 text-white font-bold py-4 mt-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(211,47,47,0.4)] active:scale-95 disabled:opacity-50">
                        {loading ? 'Authenticating...' : 'Sign In'} <ArrowRight className="w-5 h-5" />
                    </button>
                </form>

                {/* Third Party Auth (Google) */}
                <div className="mt-8 pt-6 border-t border-zinc-800">
                    <p className="text-xs text-center text-zinc-500 font-bold uppercase tracking-widest mb-4">Or Continue With</p>
                    <div className="flex justify-center flex-col items-center gap-2">
                        <GoogleLogin
                            onSuccess={handleGoogleLoginSuccess}
                            onError={handleGoogleLoginError}
                            theme="filled_black"
                            width="280"
                            shape="pill"
                            text="continue_with"
                        />
                    </div>
                </div>

            </div>
        </div>
    );
}
