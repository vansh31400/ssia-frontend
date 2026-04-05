import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    const links = [
        { name: 'Home', href: '#home' },
        { name: 'About', href: '#about' },
        { name: 'Courses', href: '#courses' },
        { name: 'Trainers', href: '#trainers' },
        { name: 'Gallery', href: '#gallery' },
    ];

    return (
        <nav className="fixed w-full z-50 bg-black/90 backdrop-blur-md border-b border-zinc-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <div className="flex-shrink-0">
                        <a href="#" className="flex items-center gap-2 font-black text-lg xl:text-xl uppercase tracking-wider text-white hidden lg:flex drop-shadow-md">
                            <img src="/images/logo.png" alt="SSIA Logo" className="h-10 w-auto bg-white rounded-md" />
                            <span>SHREE SURYADEV INTERNATIONAL <span className="text-brandRed">ACADEMY</span></span>
                        </a>
                        <a href="#" className="flex items-center gap-2 font-black text-3xl tracking-tighter text-white lg:hidden">
                            <img src="/images/logo.png" alt="SSIA Logo" className="h-8 w-auto bg-white rounded-md" />
                            <span>SSIA<span className="text-brandRed">.</span></span>
                        </a>
                    </div>

                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-8">
                            {links.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    className="text-gray-300 hover:text-brandRed px-3 py-2 rounded-md font-medium transition-colors"
                                >
                                    {link.name}
                                </a>
                            ))}
                            <a href="/admin" className="text-brandRed hover:text-white border border-brandRed hover:bg-brandRed px-4 py-2 rounded-md font-bold transition-all">
                                Admin
                            </a>
                        </div>
                    </div>

                    <div className="-mr-2 flex md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-zinc-800 focus:outline-none"
                        >
                            {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isOpen && (
                <div className="md:hidden bg-zinc-900 border-b border-zinc-800">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {links.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                className="text-gray-300 hover:text-brandRed block px-3 py-2 rounded-md text-base font-medium"
                                onClick={() => setIsOpen(false)}
                            >
                                {link.name}
                            </a>
                        ))}
                        <a href="/admin" className="text-brandRed block px-3 py-2 rounded-md text-base font-bold">
                            Admin Login
                        </a>
                    </div>
                </div>
            )}
        </nav>
    );
}
