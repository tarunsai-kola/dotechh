import React from 'react';
import {
    Briefcase,
    Users,
    FileText,
    Calendar,
    Megaphone,
    Layout,
    Shield,
    MessageSquare,
    BarChart3,
    Search,
    Bell,
    Server,
    Globe,
    CheckCircle,
    UserCheck
} from 'lucide-react';

const Services = () => {
    return (
        <div className="bg-white pb-20">
            {/* Hero Section */}
            <section className="bg-slate-900 text-white py-20 relative overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-brand-900 rounded-full blur-[120px] opacity-20"></div>
                    <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-900 rounded-full blur-[100px] opacity-20"></div>
                </div>
                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
                        Our <span className="text-brand-400">Services</span>
                    </h1>
                    <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                        Comprehensive solutions for modern recruitment, designed for both employers and talent.
                    </p>
                </div>
            </section>

            {/* Section 1: What We Offer */}
            <section className="py-20 max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-slate-900 mb-4">What We Offer</h2>
                    <p className="text-slate-600 max-w-2xl mx-auto">
                        A complete suite of tools to streamline your hiring process.
                    </p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[
                        { icon: Briefcase, title: "Job Posting & Talent Discovery", desc: "Instantly publish jobs and connect with top-tier candidates using intelligent matching." },
                        { icon: Layout, title: "End-to-End Hiring Workflow", desc: "From screening to offer letter—run your full recruitment lifecycle in one place." },
                        { icon: FileText, title: "AI-Powered Resume Parsing", desc: "Eliminate manual screening with smart filters and scoring models." },
                        { icon: Calendar, title: "Interview Management System", desc: "Schedule, conduct, and evaluate interviews with in-platform tools and integrations." },
                        { icon: Megaphone, title: "Employer Branding Tools", desc: "Create branded company pages, promote your culture, and attract passive talent." },
                        { icon: UserCheck, title: "Candidate Experience Optimization", desc: "Personalized dashboards, real-time updates, and smart notifications for applicants." }
                    ].map((item, index) => (
                        <div key={index} className="bg-white p-8 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
                            <div className="w-12 h-12 bg-brand-50 text-brand-600 rounded-lg flex items-center justify-center mb-6 group-hover:bg-brand-600 group-hover:text-white transition-colors">
                                <item.icon size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                            <p className="text-slate-600">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Section 2: For Recruiters & Hiring Teams */}
            <section className="py-20 bg-slate-50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">For Recruiters & Hiring Teams</h2>
                        <p className="text-slate-600 max-w-2xl mx-auto">
                            Collaborate effectively and make data-driven decisions.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { icon: Shield, title: "Role-Based Access", desc: "Assign permissions to recruiters, HR, and managers within one unified system." },
                            { icon: Users, title: "Collaboration Tools", desc: "Share feedback, compare candidates, and align decisions through one platform." },
                            { icon: BarChart3, title: "Analytics & Reporting", desc: "Track hiring performance, candidate activity, and pipeline metrics in real time." }
                        ].map((item, index) => (
                            <div key={index} className="bg-white p-8 rounded-xl border border-slate-200 text-center">
                                <div className="w-14 h-14 mx-auto bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-6">
                                    <item.icon size={28} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                                <p className="text-slate-600">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Section 3: Empower Job Success */}
            <section className="py-20 max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-slate-900 mb-4">Empower Job Success</h2>
                    <p className="text-slate-600 max-w-2xl mx-auto">
                        Tools designed to help candidates find their dream job faster.
                    </p>
                </div>
                <div className="grid md:grid-cols-5 gap-6">
                    {[
                        { icon: Search, title: "Smart Job Recommendations", sub: "Jobs tailored to you" },
                        { icon: CheckCircle, title: "Application Tracking", sub: "Track status instantly" },
                        { icon: FileText, title: "Resume Builder & Templates", sub: "Build resumes effortlessly" },
                        { icon: Calendar, title: "Interview Scheduling", sub: "Book slots with ease" },
                        { icon: Bell, title: "Notifications & Alerts", sub: "Never miss updates" }
                    ].map((item, index) => (
                        <div key={index} className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm text-center hover:border-brand-200 transition-colors">
                            <div className="w-12 h-12 mx-auto bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-4">
                                <item.icon size={24} />
                            </div>
                            <h3 className="font-bold text-slate-900 mb-1">{item.title}</h3>
                            <p className="text-sm text-slate-500">{item.sub}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Section 4: Advanced Services & Integrations */}
            <section className="py-20 bg-slate-900 text-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4">Advanced Services & Integrations</h2>
                        <p className="text-slate-400 max-w-2xl mx-auto">
                            Enterprise-grade capabilities for large-scale recruitment needs.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-4 gap-8">
                        {[
                            { icon: Server, title: "API Access for Enterprise Systems" },
                            { icon: Globe, title: "White-labeled Career Portals" },
                            { icon: MessageSquare, title: "Third-party Assessment Integrations" },
                            { icon: Shield, title: "Background Verification Partners" }
                        ].map((item, index) => (
                            <div key={index} className="bg-slate-800 p-8 rounded-xl border border-slate-700 hover:bg-slate-750 transition-colors flex flex-col items-center text-center">
                                <div className="w-16 h-16 bg-brand-900/50 text-brand-400 rounded-2xl flex items-center justify-center mb-6">
                                    <item.icon size={32} />
                                </div>
                                <h3 className="text-lg font-bold">{item.title}</h3>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Services;
