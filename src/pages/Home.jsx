import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Phone, CheckCircle, ChevronRight, Award, Users, Trophy, MapPin, Mail, Shield, Target, Flame, HeartHandshake } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const courses = [
    { title: 'Taekwondo', age: '5+ Years', desc: 'Korean martial art characterized by rapid kicking techniques, head-height kicks, jumping, and spinning kicks.', img: '/images/taekwondo.jpg' },
    { title: 'Kickboxing', age: '10+ Years', desc: 'High-intensity conditioning, pad work, and sparring combining boxing basics and karate kicks.', img: '/images/kickboxing.jpg' },
    { title: 'Jeet Kune Do', age: '10+ Years', desc: 'Bruce Lee’s philosophy for realistic combat. Direct, efficient, and explosive real-world self-defense.', img: '/images/jeet-kune-do.jpg' },
    { title: 'MMA', age: '15+ Years', desc: 'Mixed Martial Arts combining striking, grappling, and ground fighting techniques for versatile and comprehensive combat sports training.', img: '/images/MMA.jpeg?auto=format&fit=crop&w=800&q=80' },
    { title: 'Yoga', age: '5+ Years', desc: 'Focus on flexibility, core strength, mindfulness, breath control, and overall holistic health for a balanced body and mind.', img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80' },
    { title: 'Midbrain Activation', age: '5-18 Years', desc: 'Specially designed exercises and mental training programs intended to enhance brain function, creativity, and sensory perception in children.', img: '/images/MIDBRAIN.jpeg?auto=format&fit=crop&w=800&q=80' }
];

const trainers = [
    {
        name: 'Manoj Sir',
        role: 'Head Coach',
        features: ['Senior Black Belt', 'Expert in JEET KUNE DO &\nCombat Training'],
        exp: '15+ Yrs Experience',
        img: 'public/images/manojsir.jpeg',
        imgClass: 'object-top'
    },
    {
        name: 'COACH ',
        role: "Girls' Coach",
        features: ['Self Defence Specialist', 'Black Belt Instructor'],
        exp: '7+ Yrs Experience',
        img: 'public/images/madam.jpeg',
        imgClass: 'object-center'
    },
    {
        name: 'MASTER KANHAIYA',
        role: 'Kids Coach',
        features: ['Specialized in Kids Martial\nArts Training', 'Fun & Discipline Focused'],
        exp: '5+ Yrs Experience',
        img: 'public/images/kanhaiya.jpg',
        imgClass: 'object-center'
    }
];

const testimonials = [
    { name: "Suresh Kumar", role: "Parent", text: "My son's confidence has skyrocketed since he joined Shree Suryadev International Academy. The discipline they teach here is unmatched.", rating: 5 },
    { name: "Anjali Singh", role: "National Medalist", text: "The coaches here don't just teach techniques; they prepare you mentally for the real fights. Best academy in UP.", rating: 5 },
    { name: "Rahul Dhiman", role: "Adult Batch Student", text: "Joined for fitness, stayed for the amazing community. Kickboxing classes are the highlight of my day.", rating: 4 },
    { name: "Priya Sharma", role: "Parent", text: "Excellent safe environment for girls to learn self-defense. Highly recommended for kids.", rating: 5 },
    { name: "Vansh", role: "College Student", text: "Jeet Kune Do classes are practical and intense. I feel much more aware and capable now.", rating: 5 },
    { name: "Amit Rajput", role: "Kickboxing Trainee", text: "Manoj sir is amazing. Lost 10 kgs in 3 months just from the stamina rounds and sparring.", rating: 5 },
    { name: "Neha Malik", role: "Taekwondo Green Belt", text: "The facility is top-notch. Everyone pushes you to be your absolute best version.", rating: 4 },
    { name: "Ramesh Chaudhary", role: "Parent", text: "The dedication of head coach Manoj Sir is clearly visible. They treat every student like family.", rating: 5 }
];

export default function Home() {
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        phone: '',
        selectedCourse: 'Taekwondo',
        message: ''
    });
    const [loading, setLoading] = useState(false);

    // Dynamic Gallery State
    const [gallery, setGallery] = useState([]);
    const [hallOfFame, setHallOfFame] = useState([]);
    const [showAllCourses, setShowAllCourses] = useState(false); // Toggle state for courses
    const [showAllGallery, setShowAllGallery] = useState(false); // Toggle state for gallery
    const [selectedImage, setSelectedImage] = useState(null); // Fullscreen image modal state
    const [selectedHallOfFame, setSelectedHallOfFame] = useState(null); // Fullscreen hall of fame state

    useEffect(() => {
        const fetchGallery = async () => {
            try {
                const { data } = await axios.get('https://ssia-e4sn.onrender.com/api/gallery');
                setGallery(data.filter(img => img.type === 'General').map(img => `https://ssia-e4sn.onrender.com${img.imageUrl}`));
                setHallOfFame(data.filter(img => img.type === 'HallOfFame').map(img => ({
                    ...img,
                    img: `https://ssia-e4sn.onrender.com${img.imageUrl}`
                })));
            } catch (error) {
                console.error('Failed to load dynamic gallery data. Make sure backend is running.');
            }
        };
        fetchGallery();

        // Smooth Scroll Reveal Observer
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        document.querySelectorAll('.reveal-on-scroll').forEach((el) => {
            observer.observe(el);
        });

        return () => observer.disconnect();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'phone') {
            // Only allow digits and restrict to 10 characters
            const onlyNums = value.replace(/\D/g, '').slice(0, 10);
            setFormData({ ...formData, [name]: onlyNums });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleAdmissionSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post('https://ssia-e4sn.onrender.com/api/admissions', formData);
            toast.success('Form submitted successfully! We will contact you soon.');
            setFormData({ name: '', age: '', phone: '', selectedCourse: 'Taekwondo', message: '' });
        } catch (error) {
            toast.error('Failed to submit form. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-brandDark w-full overflow-hidden">
            <Toaster position="top-center" reverseOrder={false} />
            <Navbar />

            {/* Hero Section */}
            <section id="home" className="relative h-screen flex items-center justify-center text-center px-4 animate-fade-in"
                style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.6)), url(https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&q=80)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}>
                <div className="max-w-5xl mx-auto space-y-8 pt-20 animate-slide-up">
                    <span className="text-brandRed font-bold tracking-[0.2em] uppercase text-sm md:text-base animate-pulse">Welcome to Muzaffarnagar's Finest Academy</span>
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tight text-white drop-shadow-2xl animate-zoom-in">
                        Unleash Your <br />
                        <span className="text-brandRed bg-clip-text text-transparent bg-gradient-to-r from-brandRed to-red-500">Inner Warrior</span>
                    </h1>
                    <p className="text-lg md:text-2xl text-gray-300 max-w-2xl mx-auto font-light">
                        Shree Suryadev International Academy. Train with champions, build discipline, and master self-defense.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-6 pt-8 animate-fade-in">
                        <a href="#admission" className="bg-brandRed hover:bg-red-700 text-white px-10 py-4 rounded-sm font-bold transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 hover:shadow-[0_0_30px_rgba(211,47,47,0.8)] focus:scale-95 smooth-render">
                            Start Training
                        </a>
                        <a href="tel:+917417730440" className="bg-transparent border border-white/30 hover:bg-white hover:text-black hover:scale-105 text-white px-10 py-4 rounded-sm font-bold transition-all duration-500 backdrop-blur-sm flex items-center justify-center gap-2 smooth-render">
                            <Phone className="w-5 h-5 animate-bounce" /> Contact Us
                        </a>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section id="about" className="py-24 px-4 bg-zinc-950">
                <div className="max-w-7xl mx-auto flex flex-col gap-16">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center reveal-on-scroll">
                        <div className="space-y-6">
                            <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-tight">The <span className="text-brandRed">Academy</span></h2>
                            <div className="w-20 h-1 bg-brandRed rounded-full"></div>
                            <p className="text-gray-400 text-lg leading-relaxed">
                                Founded with the vision to create a community of strong, disciplined, and confident individuals. At Shree Suryadev International Academy, we don't just teach fighting; we build character, mental fortitude, and lifelong fitness habits.
                            </p>
                            <p className="text-gray-400 text-lg leading-relaxed mt-2 border-l-2 border-brandRed pl-4">
                                We are proudly affiliated with the <strong className="text-gray-200">Kickboxing Association UP (WAKO)</strong>, recognized by the <strong className="text-gray-200">Ministry of Youth Affairs & Sports (Govt. of India)</strong>, and the <strong className="text-gray-200">International Olympic Committee (IOC)</strong>.
                            </p>
                            <ul className="space-y-4 pt-4">
                                <li className="flex items-center gap-3 text-gray-300"><CheckCircle className="text-brandRed w-6 h-6" /> World-class training facility</li>
                                <li className="flex items-center gap-3 text-gray-300"><CheckCircle className="text-brandRed w-6 h-6" /> Certified professional instructors</li>
                                <li className="flex items-center gap-3 text-gray-300"><CheckCircle className="text-brandRed w-6 h-6" /> Programs for all age groups</li>
                            </ul>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-xl text-center hover:border-brandRed transition-colors">
                                <Users className="w-12 h-12 text-brandRed mx-auto mb-4" />
                                <h3 className="text-4xl font-black mb-2">500+</h3>
                                <p className="text-gray-400 uppercase tracking-wider text-sm">Active Students</p>
                            </div>
                            <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-xl text-center hover:border-brandRed transition-colors transform lg:translate-y-12">
                                <Trophy className="w-12 h-12 text-brandRed mx-auto mb-4" />
                                <h3 className="text-4xl font-black mb-2">250+</h3>
                                <p className="text-gray-400 uppercase tracking-wider text-sm">Medals Won</p>
                            </div>
                            <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-xl text-center hover:border-brandRed transition-colors">
                                <Award className="w-12 h-12 text-brandRed mx-auto mb-4" />
                                <h3 className="text-4xl font-black mb-2">15+</h3>
                                <p className="text-gray-400 uppercase tracking-wider text-sm">Expert Trainers</p>
                            </div>
                            <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-xl text-center hover:border-brandRed transition-colors transform lg:translate-y-12">
                                <div className="w-12 h-12 border-2 border-brandRed rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-brandRed">
                                    #1
                                </div>
                                <h3 className="text-4xl font-black mb-2">Rated</h3>
                                <p className="text-gray-400 uppercase tracking-wider text-sm">In The City</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission & Why Us Section */}
            <section id="why-us" className="py-24 px-4 bg-brandDark border-t border-zinc-900 relative">
                {/* Subtle Background Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brandRed rounded-full blur-[200px] opacity-[0.05] pointer-events-none"></div>

                <div className="max-w-7xl mx-auto relative z-10 flex flex-col gap-20">

                    {/* Mission Area */}
                    <div className="text-center max-w-4xl mx-auto space-y-6 reveal-on-scroll">
                        <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight">
                            <span className="text-white">Our</span> <span className="text-brandRed">Mission</span>
                        </h2>
                        <p className="text-xl md:text-3xl font-light text-gray-300 leading-relaxed italic border-l-4 border-brandRed pl-6 text-left inline-block mt-8 shadow-sm">
                            "To empower every individual with the physical strength to defend themselves and the mental discipline to conquer life's challenges."
                        </p>
                    </div>

                    {/* Why Us Cards */}
                    <div className="reveal-on-scroll" style={{ transitionDelay: '0.2s' }}>
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-tight">
                                Why Choose <span className="text-brandRed">Our Academy?</span>
                            </h2>
                            <div className="w-16 h-1 bg-brandRed rounded-full mx-auto mt-4"></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl hover:border-brandRed hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(211,47,47,0.15)] transition-all duration-500 ease-out smooth-render group">
                                <div className="w-14 h-14 bg-zinc-950 rounded-xl flex items-center justify-center mb-6 group-hover:bg-brandRed group-hover:rotate-12 transition-all duration-500 smooth-render">
                                    <Shield className="w-7 h-7 text-brandRed group-hover:text-white transition-colors duration-500" />
                                </div>
                                <h3 className="text-xl font-bold uppercase text-white mb-3">Safe Learning</h3>
                                <p className="text-gray-400 leading-relaxed text-sm">
                                    Zero-tolerance bullying policy. Dedicated focus on creating a secure, respectful environment especially for women and kids.
                                </p>
                            </div>

                            <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl hover:border-brandRed hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(211,47,47,0.15)] transition-all duration-500 ease-out smooth-render group">
                                <div className="w-14 h-14 bg-zinc-950 rounded-xl flex items-center justify-center mb-6 group-hover:bg-brandRed group-hover:rotate-12 transition-all duration-500 smooth-render">
                                    <Target className="w-7 h-7 text-brandRed group-hover:text-white transition-colors duration-500" />
                                </div>
                                <h3 className="text-xl font-bold uppercase text-white mb-3">Excellence Focused</h3>
                                <p className="text-gray-400 leading-relaxed text-sm">
                                    We don't just teach the basics; our program builds real stamina, agility, and precision required for competitive combat.
                                </p>
                            </div>

                            <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl hover:border-brandRed hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(211,47,47,0.15)] transition-all duration-500 ease-out smooth-render group">
                                <div className="w-14 h-14 bg-zinc-950 rounded-xl flex items-center justify-center mb-6 group-hover:bg-brandRed group-hover:rotate-12 transition-all duration-500 smooth-render">
                                    <Flame className="w-7 h-7 text-brandRed group-hover:text-white transition-colors duration-500" />
                                </div>
                                <h3 className="text-xl font-bold uppercase text-white mb-3">World Class Gear</h3>
                                <p className="text-gray-400 leading-relaxed text-sm">
                                    Train with the best layout and equipment. From heavy bags to professional grade combat mats, we got it all covered.
                                </p>
                            </div>

                            <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl hover:border-brandRed hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(211,47,47,0.15)] transition-all duration-500 ease-out smooth-render group">
                                <div className="w-14 h-14 bg-zinc-950 rounded-xl flex items-center justify-center mb-6 group-hover:bg-brandRed group-hover:rotate-12 transition-all duration-500 smooth-render">
                                    <Trophy className="w-7 h-7 text-brandRed group-hover:text-white transition-colors duration-500" />
                                </div>
                                <h3 className="text-xl font-bold uppercase text-white mb-3">Tournament Exposure</h3>
                                <p className="text-gray-400 leading-relaxed text-sm">
                                    We actively prepare and sponsor students for district, state, and national level championships to build real-world confidence.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Courses Section */}
            <section id="courses" className="py-24 px-4 bg-zinc-950">
                <div className="max-w-7xl mx-auto reveal-on-scroll">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-tight mb-4">Elite <span className="text-brandRed">Programs</span></h2>
                        <div className="w-20 h-1 bg-brandRed rounded-full mx-auto"></div>
                        <p className="text-gray-400 mt-6 max-w-2xl mx-auto">Choose your path to mastery. We offer specialized training customized for different age brackets and goals.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {(showAllCourses ? courses : courses.slice(0, 3)).map((course, i) => (
                            <div key={i} className="group bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 hover:border-brandRed transition-all duration-500 hover:-translate-y-3 hover:shadow-[0_0_40px_rgba(211,47,47,0.4)]">
                                <div className="h-64 overflow-hidden relative">
                                    <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-all z-10"></div>
                                    <img src={course.img} alt={course.title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                                    <div className="absolute top-4 right-4 z-20 bg-brandRed text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                                        {course.age}
                                    </div>
                                </div>
                                <div className="p-8">
                                    <h3 className="text-2xl font-black uppercase mb-4">{course.title}</h3>
                                    <p className="text-gray-400 mb-8 min-h-[80px] leading-relaxed">{course.desc}</p>
                                    <a href="#admission" className="inline-flex items-center justify-center w-full py-4 bg-zinc-800 group-hover:bg-brandRed text-white font-bold rounded-xl transition-colors">
                                        Enroll Now <ChevronRight className="ml-2 w-5 h-5" />
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* View All / Show Less Button */}
                    <div className="text-center mt-12">
                        <button
                            onClick={() => setShowAllCourses(!showAllCourses)}
                            className="bg-transparent border-2 border-brandRed hover:bg-brandRed text-white px-8 py-3 rounded-xl font-bold uppercase tracking-widest transition-all"
                        >
                            {showAllCourses ? 'Show Less' : 'View All Programs'}
                        </button>
                    </div>
                </div>
            </section>


            {/* Trainers Section */}
            <section id="trainers" className="py-24 px-4 relative overflow-hidden bg-brandDark">
                {/* Background Styling for Trainers */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(211,47,47,0.08)_0%,transparent_70%)] pointer-events-none"></div>
                <div className="absolute inset-0 bg-black/40 pointer-events-none"></div>

                <div className="max-w-5xl mx-auto relative z-10 reveal-on-scroll">
                    <div className="text-center mb-16 flex flex-col items-center">
                        <span className="text-brandRed font-bold tracking-[0.2em] uppercase text-sm mb-2">Expert Instructors</span>
                        <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-6">
                            <span className="text-white">Our</span> <span className="text-brandRed">Coaches</span>
                        </h2>
                        <div className="w-20 h-1 bg-brandRed rounded-full mb-6"></div>
                        <p className="text-gray-400 max-w-2xl mx-auto md:text-lg leading-relaxed font-light">
                            Meet our expert trainers who lead our martial arts programs with dedication and skill.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4 md:px-0">
                        {trainers.map((trainer, i) => (
                            <div key={i} className="group flex flex-col bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 shadow-2xl hover:border-brandRed/50 transition-all duration-500 hover:-translate-y-2">
                                {/* Image Header */}
                                <div className="h-[380px] w-full overflow-hidden relative bg-zinc-950">
                                    <img src={trainer.img} alt={trainer.name} className={`w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-transform duration-700 ${trainer.imgClass || 'object-top'}`} />
                                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent z-10"></div>
                                </div>

                                {/* Content Body */}
                                <div className="flex-grow flex flex-col pt-2 pb-8 px-6 relative z-30 -mt-16 bg-gradient-to-b from-transparent to-zinc-900">
                                    <div className="text-center mb-5">
                                        <h3 className="text-2xl font-black uppercase text-white tracking-wide drop-shadow-lg">{trainer.name}</h3>
                                        <p className="text-brandRed font-bold tracking-widest uppercase text-sm mt-1">{trainer.role}</p>
                                    </div>

                                    <div className="w-full h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent mb-5"></div>

                                    <div className="flex-grow flex flex-col justify-center gap-2 text-center mb-5 min-h-[70px]">
                                        {trainer.features.map((feature, idx) => (
                                            <p key={idx} className="text-gray-300 text-[14px] whitespace-pre-line leading-relaxed font-light">
                                                {feature}
                                            </p>
                                        ))}
                                    </div>

                                    <div className="flex items-center justify-center gap-2 bg-black/30 w-max mx-auto px-5 py-2 rounded-full border border-zinc-800">
                                        <svg className="w-4 h-4 text-brandRed fill-current" viewBox="0 0 24 24">
                                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                        </svg>
                                        <span className="text-brandRed font-bold text-sm tracking-wider uppercase">{trainer.exp}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Section (Option 2) */}
            <section id="testimonials" className="py-24 px-4 bg-brandDark">
                <div className="max-w-7xl mx-auto reveal-on-scroll">
                    <div className="text-center mb-16">
                        <span className="text-brandRed font-bold tracking-[0.2em] uppercase text-sm md:text-base">Real Results</span>
                        <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-tight mt-2 mb-4">Student <span className="text-brandRed">Reviews</span></h2>
                        <div className="w-20 h-1 bg-brandRed rounded-full mx-auto"></div>
                    </div>

                    <div className="relative w-full overflow-hidden">
                        {/* Gradient masks for smooth fading at the corners */}
                        <div className="absolute inset-y-0 left-0 w-8 md:w-32 bg-gradient-to-r from-brandDark to-transparent z-10 pointer-events-none"></div>
                        <div className="absolute inset-y-0 right-0 w-8 md:w-32 bg-gradient-to-l from-brandDark to-transparent z-10 pointer-events-none"></div>

                        <div className="animate-marquee flex gap-6 lg:gap-8 py-4">
                            {[...testimonials, ...testimonials].map((t, i) => (
                                <div key={i} className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl hover:border-brandRed transition-colors relative flex-shrink-0 w-[300px] md:w-[400px]">
                                    <div className="text-brandRed text-4xl font-serif absolute -top-4 right-8 opacity-50">"</div>
                                    <div className="flex gap-1 mb-4">
                                        {[...Array(5)].map((_, idx) => (
                                            <svg key={idx} className={`w-5 h-5 ${idx < t.rating ? 'text-yellow-500' : 'text-zinc-700'}`} fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                    </div>
                                    <p className="text-gray-300 mb-6 italic min-h-[80px]">"{t.text}"</p>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center font-bold text-brandRed">
                                            {t.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white uppercase">{t.name}</h4>
                                            <p className="text-brandRed text-sm tracking-wider uppercase">{t.role}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Gallery Section with Hall of Fame */}
            <section id="gallery" className="py-24 px-4 bg-brandDark border-t border-zinc-900">
                <div className="max-w-7xl mx-auto reveal-on-scroll">
                    <div className="text-center mb-16">
                        <span className="text-brandRed font-bold tracking-[0.2em] uppercase text-sm flex items-center justify-center gap-2 mb-2">
                            <Trophy className="w-5 h-5" /> Student Achievements
                        </span>
                        <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-tight mb-4"><span className="text-brandRed">Hall of Fame</span> & Gallery</h2>
                        <div className="w-20 h-1 bg-brandRed rounded-full mx-auto"></div>
                        <p className="text-gray-400 mt-6 max-w-2xl mx-auto">Meet our champions and check out the action from our training facility.</p>
                    </div>

                    {/* Unified Gallery Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {(() => {
                            const allItems = [
                                ...hallOfFame.map(student => ({ ...student, isHof: true })),
                                ...gallery.map(img => ({ img, isGallery: true }))
                            ];

                            if (allItems.length === 0) {
                                return <p className="text-zinc-500 col-span-full text-center mt-8">Gallery images are managed from the Admin Dashboard.</p>;
                            }

                            return (showAllGallery ? allItems : allItems.slice(0, 4)).map((item, i) => (
                                <div key={i} className="group relative overflow-hidden rounded-lg aspect-square bg-zinc-950 cursor-pointer flex items-center justify-center" onClick={() => item.isHof ? setSelectedHallOfFame(item) : setSelectedImage(item.img)}>
                                    <img src={item.img} alt={item.name || "Gallery"} className="max-w-full max-h-full object-contain transform group-hover:scale-110 transition-transform duration-500" />
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
                                        <span className="text-white font-medium tracking-widest uppercase border border-white px-4 py-2">View</span>
                                    </div>
                                    {item.isHof && (
                                        <div className="absolute top-2 left-2 z-20 bg-brandRed text-white px-2 py-0.5 text-[10px] font-black uppercase tracking-widest rounded-sm shadow-lg flex items-center gap-1">
                                            <Award className="w-3 h-3" /> HOF
                                        </div>
                                    )}
                                </div>
                            ));
                        })()}
                    </div>

                    {/* View All / Show Less Button for Gallery */}
                    {(hallOfFame.length + gallery.length) > 4 && (
                        <div className="text-center mt-12">
                            <button
                                onClick={() => setShowAllGallery(!showAllGallery)}
                                className="bg-transparent border-2 border-brandRed hover:bg-brandRed text-white px-8 py-3 rounded-xl font-bold uppercase tracking-widest transition-all"
                            >
                                {showAllGallery ? 'Show Less' : 'View All Images'}
                            </button>
                        </div>
                    )}
                </div>
            </section>


            {/* Admission Section */}
            <section id="admission" className="py-24 px-4 bg-brandDark relative overflow-hidden border-t border-zinc-900">
                {/* Abstract Background Shapes */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-brandRed rounded-full blur-[150px] opacity-20 transform translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
                <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 relative z-10 reveal-on-scroll">

                    <div className="space-y-8 flex flex-col justify-center">
                        <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-tight">Ready to <br /><span className="text-brandRed">Join Us?</span></h2>
                        <p className="text-gray-400 text-lg">Leave your details below and our team will get in touch to schedule your first trial class.</p>

                        <div className="space-y-6 pt-4">
                            <div className="flex items-center gap-4 bg-zinc-900/50 p-4 rounded-xl border border-zinc-800">
                                <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center text-brandRed">
                                    <span className="font-black">1</span>
                                </div>
                                <div>
                                    <h4 className="font-bold">Register Online</h4>
                                    <p className="text-sm text-gray-400">Fill out this quick form</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 bg-zinc-900/50 p-4 rounded-xl border border-zinc-800">
                                <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center text-brandRed">
                                    <span className="font-black">2</span>
                                </div>
                                <div>
                                    <h4 className="font-bold">Get a Call</h4>
                                    <p className="text-sm text-gray-400">We discuss your goals</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 bg-zinc-900/50 p-4 rounded-xl border border-zinc-800">
                                <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center text-brandRed">
                                    <span className="font-black">3</span>
                                </div>
                                <div>
                                    <h4 className="font-bold">Start Training</h4>
                                    <p className="text-sm text-gray-400">Hit the mats and train</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-zinc-900 border border-zinc-800 p-8 md:p-10 rounded-2xl shadow-2xl relative group hover:border-brandRed/50 transition-colors duration-500 hover:shadow-[0_0_50px_rgba(211,47,47,0.15)]">
                        <form onSubmit={handleAdmissionSubmit} className="space-y-6 relative z-10">
                            <h3 className="text-2xl font-black uppercase text-center mb-8 border-b border-zinc-800 pb-4">Admission Form</h3>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2 col-span-2">
                                    <label className="text-xs uppercase tracking-widest text-gray-400 font-bold">Full Name</label>
                                    <input required type="text" name="name" value={formData.name} onChange={handleInputChange} minLength={3} maxLength={50} pattern="[A-Za-z\s]+" title="Please enter a valid name using alphabets" className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brandRed transition-colors" placeholder="Enter Full Name" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs uppercase tracking-widest text-gray-400 font-bold">Age</label>
                                    <input required type="number" name="age" value={formData.age} onChange={handleInputChange} min={4} max={60} title="Age must be between 4 and 60" className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brandRed transition-colors" placeholder="Enter Age" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs uppercase tracking-widest text-gray-400 font-bold">Phone Number</label>
                                    <input required type="text" name="phone" value={formData.phone} onChange={handleInputChange} minLength={10} maxLength={10} pattern="[0-9]{10}" title="Please enter a valid digit mobile number" className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brandRed transition-colors" placeholder="Mobile Number" />
                                </div>
                                <div className="space-y-2 col-span-2">
                                    <label className="text-xs uppercase tracking-widest text-gray-400 font-bold">Select Program</label>
                                    <select name="selectedCourse" value={formData.selectedCourse} onChange={handleInputChange} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brandRed transition-colors appearance-none">
                                        {courses.map(c => <option key={c.title} value={c.title}>{c.title}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2 col-span-2">
                                    <label className="text-xs uppercase tracking-widest text-gray-400 font-bold">Any Message (Optional)</label>
                                    <textarea name="message" value={formData.message} onChange={handleInputChange} rows="3" className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brandRed transition-colors" placeholder="Tell us about your prior experience..."></textarea>
                                </div>
                            </div>

                            <button disabled={loading} type="submit" className="w-full bg-brandRed hover:bg-red-700 text-white font-black uppercase tracking-widest py-4 rounded-lg transition-all shadow-[0_0_15px_rgba(211,47,47,0.3)] hover:shadow-[0_0_25px_rgba(211,47,47,0.6)] disabled:opacity-50 mt-4">
                                {loading ? 'Submitting...' : 'Submit Registration'}
                            </button>
                        </form>
                    </div>

                </div>
            </section>

            <Footer />

            {/* Fixed WhatsApp Button (Option 6) */}
            <a href="https://wa.me/917417730440" target="_blank" rel="noreferrer" className="fixed bottom-8 right-8 bg-[#25D366] text-white p-4 rounded-full shadow-[0_0_20px_rgba(37,211,102,0.4)] hover:bg-[#20bd5a] hover:scale-110 transition-all hover:shadow-[0_0_30px_rgba(37,211,102,0.6)] z-50 flex items-center justify-center animate-bounce-slight group">
                <span className="w-3 h-3 bg-red-500 rounded-full absolute top-0 right-0 animate-ping"></span>
                <span className="w-3 h-3 bg-red-500 rounded-full absolute top-0 right-0"></span>
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c-.003 1.396.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z" />
                </svg>
                {/* Tooltip on hover */}
                <div className="absolute right-20 bg-white text-black text-sm font-bold px-4 py-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                    Chat with Us!
                    <div className="absolute right-[-6px] top-1/2 transform -translate-y-1/2 w-3 h-3 bg-white rotate-45"></div>
                </div>
            </a>

            {/* Image Fullscreen Modal */}
            {selectedImage && (
                <div
                    className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex justify-center items-center p-4 cursor-pointer"
                    onClick={() => setSelectedImage(null)}
                >
                    <button
                        className="absolute top-6 right-6 text-white bg-zinc-800 hover:bg-brandRed transition-colors rounded-full w-12 h-12 flex justify-center items-center text-2xl font-bold cursor-pointer"
                        onClick={(e) => { e.stopPropagation(); setSelectedImage(null); }}
                    >
                        &times;
                    </button>
                    <img
                        src={selectedImage}
                        alt="Fullscreen"
                        className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-[0_0_50px_rgba(0,0,0,0.8)] animate-zoom-in"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}

            {/* Hall of Fame Fullscreen Modal */}
            {selectedHallOfFame && (
                <div
                    className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex justify-center items-center p-4 cursor-pointer"
                    onClick={() => setSelectedHallOfFame(null)}
                >
                    <button
                        className="absolute top-6 right-6 text-white bg-zinc-800 hover:bg-brandRed transition-colors rounded-full w-12 h-12 flex justify-center items-center text-2xl font-bold cursor-pointer z-[110]"
                        onClick={(e) => { e.stopPropagation(); setSelectedHallOfFame(null); }}
                    >
                        &times;
                    </button>
                    <div
                        className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] animate-zoom-in max-w-4xl w-full flex flex-col md:flex-row cursor-default"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="md:w-1/2 p-4 bg-zinc-950 flex items-center justify-center">
                            <img src={selectedHallOfFame.img} alt={selectedHallOfFame.studentName || selectedHallOfFame.name} className="max-w-full max-h-[70vh] object-contain rounded-lg" />
                        </div>
                        <div className="md:w-1/2 p-8 flex flex-col justify-center">
                            <span className="text-brandRed font-bold tracking-[0.2em] uppercase text-sm mb-2">
                                {selectedHallOfFame.sport ? `${selectedHallOfFame.sport} • ` : ''}{selectedHallOfFame.year}
                            </span>
                            <h3 className="text-4xl font-black uppercase tracking-tight text-white mb-4">
                                {selectedHallOfFame.studentName || selectedHallOfFame.name}
                            </h3>
                            <div className="w-16 h-1 bg-brandRed rounded-full mb-6"></div>
                            <p className="text-xl text-gray-300 leading-relaxed font-light italic">
                                "{selectedHallOfFame.title}"
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
