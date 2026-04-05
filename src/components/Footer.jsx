import React from 'react';
import { Facebook, Instagram, Youtube, MapPin, Phone, Mail } from 'lucide-react';

export default function Footer() {
    return (
        <footer id="contact" className="bg-black border-t border-zinc-900 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-gray-400">

                    {/* Brand */}
                    <div className="space-y-4">
                        <h3 className="font-bold text-xl md:text-2xl tracking-tighter text-white">
                            Shree Suryadev International <span className="text-brandRed">Academy.</span>
                        </h3>
                        <p className="text-sm">
                            Shree Suryadev International Academy – Empowering bodies and sharpening minds through authentic martial arts training in Muzaffarnagar.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="hover:text-brandRed transition-colors"><Facebook className="w-5 h-5" /></a>
                            <a href="https://www.instagram.com/shri_suryadev_international_ac?igsh=MTJneGRsam9mdGVyMA==" target="_blank" rel="noreferrer" className="hover:text-brandRed transition-colors"><Instagram className="w-5 h-5" /></a>
                            <a href="https://youtube.com/@suryadevmanoj-z9o?si=CLqpEnip9eBbzvIv" target="_blank" rel="noreferrer" className="hover:text-brandRed transition-colors"><Youtube className="w-5 h-5" /></a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Quick Links</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#about" className="hover:text-brandRed transition-colors">About Us</a></li>
                            <li><a href="#courses" className="hover:text-brandRed transition-colors">Our Programs</a></li>
                            <li><a href="#trainers" className="hover:text-brandRed transition-colors">The Team</a></li>
                            <li><a href="#contact" className="hover:text-brandRed transition-colors">Contact Us</a></li>
                        </ul>
                    </div>

                    {/* Classes */}
                    <div>
                        <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Our Classes</h4>
                        <ul className="space-y-2 text-sm">
                            <li><span className="hover:text-brandRed transition-colors cursor-pointer">Taekwondo</span></li>
                            <li><span className="hover:text-brandRed transition-colors cursor-pointer">Kickboxing</span></li>
                            <li><span className="hover:text-brandRed transition-colors cursor-pointer">Jeet Kune Do</span></li>
                            <li><span className="hover:text-brandRed transition-colors cursor-pointer">Self Defense</span></li>
                            <li><span className="hover:text-brandRed transition-colors cursor-pointer">Kids Martial Arts</span></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Get in Touch</h4>
                        <ul className="space-y-4 text-sm">
                            <li className="flex items-start gap-3">
                                <MapPin className="text-brandRed w-5 h-5 flex-shrink-0 mt-1" />
                                <div>
                                    <span>123 Main Street, Near City Square,<br />Muzaffarnagar, UP 251001</span>
                                    <a
                                        href="https://goo.gl/maps/muzaffarnagar"
                                        target="_blank"
                                        rel="noreferrer"
                                        className="block mt-2 text-brandRed font-medium hover:text-red-400 transition-colors underline underline-offset-4 decoration-brandRed/30"
                                    >
                                        View on Google Maps
                                    </a>
                                </div>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="text-brandRed w-5 h-5 flex-shrink-0" />
                                <span>+91 74177 30440</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="text-brandRed w-5 h-5 flex-shrink-0" />
                                <span>info@ssia.edu.in</span>
                            </li>
                        </ul>
                    </div>

                </div>

                <div className="border-t border-zinc-900 mt-12 pt-8 text-center text-sm text-gray-500 space-y-2">
                    <p>© {new Date().getFullYear()} Shree Suryadev International Academy. All rights reserved.</p>
                    <p className="flex items-center justify-center gap-2">
                        Designed and developed by Vansh | 
                        <a href="https://www.linkedin.com/in/kumar-vansh-186570386" target="_blank" rel="noreferrer" className="text-brandRed hover:text-red-400 hover:underline transition-colors">LinkedIn</a> | 
                        <a href="mailto:kvansh2140@gmail.com" className="text-brandRed hover:text-red-400 hover:underline transition-colors">Email</a>
                    </p>
                </div>
            </div>
        </footer>
    );
}
