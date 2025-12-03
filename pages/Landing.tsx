import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Search, TrendingUp, ShieldCheck } from 'lucide-react';

const Landing = () => {
  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
           <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-brand-200 rounded-full blur-[120px] opacity-40"></div>
           <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-200 rounded-full blur-[100px] opacity-40"></div>
        </div>
        
        <div className="max-w-5xl mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-100 text-brand-600 text-sm font-medium mb-8 animate-fade-in-up">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
            </span>
            The Future of Hiring is Here
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-8 leading-[1.1]">
            Find your place in the <br/>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-600 to-blue-600">Economy of Tomorrow</span>
          </h1>
          <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Doltec connects forward-thinking companies with student talent ready for the next 20 years. AI-driven matching, skill-gap analysis, and bias-free hiring.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/login" className="w-full sm:w-auto px-8 py-4 bg-brand-600 text-white rounded-lg font-semibold hover:bg-brand-700 transition-all shadow-lg shadow-brand-200 flex items-center justify-center gap-2">
              Get Started <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-lg font-semibold hover:bg-slate-50 transition-all flex items-center justify-center">
              Post a Job
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6">
              <Search size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Smart Matching</h3>
            <p className="text-slate-600 leading-relaxed">
              Stop keyword stuffing. Our semantic engine matches potential, not just history. We understand transferable skills for jobs that didn't exist 5 years ago.
            </p>
          </div>
          <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mb-6">
              <ShieldCheck size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Bias-Free Hiring</h3>
            <p className="text-slate-600 leading-relaxed">
              Anonymized initial screenings and skill-based assessments ensure you hire the best talent, regardless of background or pedigree.
            </p>
          </div>
          <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-6">
              <TrendingUp size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Career Pathing</h3>
            <p className="text-slate-600 leading-relaxed">
              Don't just find a job, find a trajectory. We analyze skill gaps and suggest micro-credentials to unlock your dream role.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-slate-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-12">Trusted by the innovators</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 items-center opacity-70">
            {/* Simple Text Placeholders for Logos */}
            <div className="text-2xl font-bold">NeuralFrontier</div>
            <div className="text-2xl font-bold">SpaceX2</div>
            <div className="text-2xl font-bold">GreenGen</div>
            <div className="text-2xl font-bold">QuantumLeap</div>
          </div>
          <div className="mt-16 pt-16 border-t border-slate-800 grid md:grid-cols-3 gap-8">
             <div>
                <div className="text-4xl font-bold text-brand-400 mb-2">93%</div>
                <div className="text-slate-400">Match Accuracy</div>
             </div>
             <div>
                <div className="text-4xl font-bold text-brand-400 mb-2">48h</div>
                <div className="text-slate-400">Average Time to Interview</div>
             </div>
             <div>
                <div className="text-4xl font-bold text-brand-400 mb-2">10k+</div>
                <div className="text-slate-400">Future-Ready Candidates</div>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;