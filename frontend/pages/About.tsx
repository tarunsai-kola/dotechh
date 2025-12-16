import React from 'react';
import { ArrowRight, Target, Users, Zap, Clock, Shield, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

const About = () => {
    return (
        <div className="bg-white">
            {/* Hero Section */}
            <section className="relative py-20 overflow-hidden bg-slate-900 text-white">
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-brand-900 rounded-full blur-[120px] opacity-20"></div>
                    <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-900 rounded-full blur-[100px] opacity-20"></div>
                </div>

                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                    <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
                        Powering the <span className="text-brand-400">Future of Hiring</span>
                    </h1>
                    <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                        Doltec is a next-generation recruitment platform where talent and opportunities connect seamlessly, efficiently, and at scale. We are the technology-driven solution to modern hiring challenges.
                    </p>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="py-20 max-w-7xl mx-auto px-6">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-sm font-medium">
                            <Target size={16} /> Our Mission
                        </div>
                        <h2 className="text-3xl font-bold text-slate-900">Reimagining Recruitment</h2>
                        <p className="text-lg text-slate-600 leading-relaxed">
                            To reimagine recruitment using technology, transparency, and trust, simplifying the hiring lifecycle for both organizations and applicants.
                        </p>
                    </div>
                    <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium mb-6">
                            <Globe size={16} /> Our Vision
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-4">Bridging Education & Employment</h3>
                        <p className="text-slate-600">
                            To bridge the gap between education and employment by giving students and recruiters intelligent tools and equal access.
                        </p>
                    </div>
                </div>
            </section>

            {/* Problem & Solution */}
            <section className="py-20 bg-slate-50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Solving Real Challenges</h2>
                        <p className="text-slate-600 max-w-2xl mx-auto">
                            Traditional recruitment is broken. We created a single, intelligent platform to remove friction and increase visibility for everyone.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
                            <div className="w-12 h-12 bg-red-50 text-red-600 rounded-lg flex items-center justify-center mb-6">
                                <Zap size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Intelligent</h3>
                            <p className="text-slate-600">
                                Smart matching algorithms that understand skills and potential, not just keywords.
                            </p>
                        </div>
                        <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
                            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center mb-6">
                                <Clock size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Fast</h3>
                            <p className="text-slate-600">
                                Streamlined workflows that reduce time-to-hire from weeks to days.
                            </p>
                        </div>
                        <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
                            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-lg flex items-center justify-center mb-6">
                                <Shield size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Inclusive</h3>
                            <p className="text-slate-600">
                                Bias-free screening tools that ensure equal opportunity for all candidates.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Growth Timeline */}
            <section className="py-20 max-w-7xl mx-auto px-6">
                <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">Our Journey</h2>
                <div className="relative">
                    {/* Vertical Line */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-slate-200 hidden md:block"></div>

                    <div className="space-y-12">
                        {/* Item 1 */}
                        <div className="relative flex items-center justify-between md:flex-row flex-col group">
                            <div className="md:w-5/12 text-right pr-8 order-1 md:order-1">
                                <h3 className="text-xl font-bold text-slate-900">Ideation</h3>
                                <p className="text-slate-600 mt-2">Identifying key hiring bottlenecks and conceptualizing a unified platform.</p>
                            </div>
                            <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white border-4 border-brand-600 rounded-full z-10 hidden md:block group-hover:scale-125 transition-transform"></div>
                            <div className="md:w-5/12 pl-8 order-2 md:order-2"></div>
                        </div>

                        {/* Item 2 */}
                        <div className="relative flex items-center justify-between md:flex-row flex-col group">
                            <div className="md:w-5/12 text-right pr-8 order-1 md:order-1"></div>
                            <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white border-4 border-brand-600 rounded-full z-10 hidden md:block group-hover:scale-125 transition-transform"></div>
                            <div className="md:w-5/12 pl-8 order-2 md:order-2">
                                <h3 className="text-xl font-bold text-slate-900">Prototype Built</h3>
                                <p className="text-slate-600 mt-2">Creating an MVP focused on ATS integration and candidate pipeline transparency.</p>
                            </div>
                        </div>

                        {/* Item 3 */}
                        <div className="relative flex items-center justify-between md:flex-row flex-col group">
                            <div className="md:w-5/12 text-right pr-8 order-1 md:order-1">
                                <h3 className="text-xl font-bold text-slate-900">Beta Launched</h3>
                                <p className="text-slate-600 mt-2">Piloting the platform with early adopter tech hiring teams at startups.</p>
                            </div>
                            <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white border-4 border-brand-600 rounded-full z-10 hidden md:block group-hover:scale-125 transition-transform"></div>
                            <div className="md:w-5/12 pl-8 order-2 md:order-2"></div>
                        </div>

                        {/* Item 4 */}
                        <div className="relative flex items-center justify-between md:flex-row flex-col group">
                            <div className="md:w-5/12 text-right pr-8 order-1 md:order-1"></div>
                            <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white border-4 border-brand-600 rounded-full z-10 hidden md:block group-hover:scale-125 transition-transform"></div>
                            <div className="md:w-5/12 pl-8 order-2 md:order-2">
                                <h3 className="text-xl font-bold text-slate-900">Live Deployment</h3>
                                <p className="text-slate-600 mt-2">Rolling out full features across enterprise-scale clients.</p>
                            </div>
                        </div>

                        {/* Item 5 */}
                        <div className="relative flex items-center justify-between md:flex-row flex-col group">
                            <div className="md:w-5/12 text-right pr-8 order-1 md:order-1">
                                <h3 className="text-xl font-bold text-brand-600">Future Vision</h3>
                                <p className="text-slate-600 mt-2">Planning AI-driven matching and predictive hiring analytics.</p>
                            </div>
                            <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white border-4 border-brand-600 rounded-full z-10 hidden md:block group-hover:scale-125 transition-transform"></div>
                            <div className="md:w-5/12 pl-8 order-2 md:order-2"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 bg-brand-600 text-white text-center">
                <div className="max-w-4xl mx-auto px-6">
                    <h2 className="text-3xl font-bold mb-6">Ready to join the future of hiring?</h2>
                    <div className="flex justify-center gap-4">
                        <Link to="/login" className="px-8 py-3 bg-white text-brand-600 rounded-lg font-semibold hover:bg-brand-50 transition-colors">
                            Get Started
                        </Link>
                        <Link to="/contact" className="px-8 py-3 bg-transparent border border-white text-white rounded-lg font-semibold hover:bg-white/10 transition-colors">
                            Contact Us
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
