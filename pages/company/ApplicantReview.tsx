import React from 'react';
import { MOCK_CANDIDATES } from '../../constants';
import { CandidateProfile } from '../../types';
import { Download, MessageSquare, Calendar, MoreHorizontal, Check, X } from 'lucide-react';

const ApplicantReview = () => {
  const [selectedCandidate, setSelectedCandidate] = React.useState<CandidateProfile | null>(MOCK_CANDIDATES[0]);

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col lg:flex-row gap-6">
      
      {/* List Sidebar */}
      <div className="w-full lg:w-96 bg-white rounded-2xl border border-slate-200 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-slate-100">
            <h3 className="font-bold text-slate-900">Applicants (24)</h3>
            <div className="flex gap-2 mt-2">
                <span className="text-xs px-2 py-1 bg-brand-600 text-white rounded-md">All</span>
                <span className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded-md hover:bg-slate-200 cursor-pointer">Unread</span>
                <span className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded-md hover:bg-slate-200 cursor-pointer">Shortlisted</span>
            </div>
        </div>
        <div className="flex-1 overflow-y-auto">
            {MOCK_CANDIDATES.map(c => (
                <div 
                    key={c.id} 
                    onClick={() => setSelectedCandidate(c)}
                    className={`p-4 border-b border-slate-50 cursor-pointer transition-colors hover:bg-slate-50 ${selectedCandidate?.id === c.id ? 'bg-brand-50 border-l-4 border-l-brand-600' : 'border-l-4 border-l-transparent'}`}
                >
                    <div className="flex justify-between items-start mb-1">
                        <h4 className="font-bold text-slate-900 text-sm">{c.name}</h4>
                        <span className="text-xs font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded">9{c.id === 'c1' ? '2' : '5'}% Match</span>
                    </div>
                    <p className="text-xs text-slate-500 mb-2 truncate">{c.headline}</p>
                    <div className="flex flex-wrap gap-1">
                        {c.skills.slice(0, 3).map(s => (
                            <span key={s} className="text-[10px] px-1.5 py-0.5 bg-white border border-slate-200 rounded text-slate-500">{s}</span>
                        ))}
                    </div>
                </div>
            ))}
             {/* Fake remaining items for scroll demo */}
            {[1,2,3,4,5].map(i => (
                <div key={i} className="p-4 border-b border-slate-50 cursor-pointer hover:bg-slate-50 border-l-4 border-l-transparent opacity-60">
                     <div className="h-4 w-32 bg-slate-200 rounded mb-2"></div>
                     <div className="h-3 w-full bg-slate-100 rounded mb-2"></div>
                     <div className="flex gap-1"><div className="h-4 w-12 bg-slate-100 rounded"></div></div>
                </div>
            ))}
        </div>
      </div>

      {/* Detail View */}
      <div className="flex-1 bg-white rounded-2xl border border-slate-200 overflow-y-auto p-8 relative">
        {selectedCandidate ? (
            <>
                {/* Header */}
                <div className="flex justify-between items-start mb-8">
                    <div className="flex gap-4">
                        <div className="w-20 h-20 bg-slate-200 rounded-xl overflow-hidden">
                             <img src={`https://picsum.photos/seed/${selectedCandidate.id}/200`} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900">{selectedCandidate.name}</h2>
                            <p className="text-slate-600">{selectedCandidate.headline}</p>
                            <div className="flex gap-4 text-sm text-slate-400 mt-2">
                                <span>{selectedCandidate.email}</span>
                                <span>•</span>
                                <span>{selectedCandidate.phone}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button className="p-2 text-slate-400 hover:text-slate-600 border border-slate-200 rounded-lg"><Download size={20}/></button>
                        <button className="p-2 text-slate-400 hover:text-slate-600 border border-slate-200 rounded-lg"><MoreHorizontal size={20}/></button>
                    </div>
                </div>

                {/* Match Score Breakdown */}
                <div className="mb-8 bg-slate-50 p-6 rounded-xl border border-slate-100">
                    <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs">AI</div>
                        Match Analysis
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-slate-600">Skills</span>
                                <span className="font-bold text-slate-900">95%</span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-2"><div className="bg-green-500 h-2 rounded-full" style={{width: '95%'}}></div></div>
                            <p className="text-xs text-slate-400 mt-1">Has all required tech stack</p>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-slate-600">Experience</span>
                                <span className="font-bold text-slate-900">80%</span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-2"><div className="bg-blue-500 h-2 rounded-full" style={{width: '80%'}}></div></div>
                             <p className="text-xs text-slate-400 mt-1">Slightly less senior than requested</p>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-slate-600">Location</span>
                                <span className="font-bold text-slate-900">100%</span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-2"><div className="bg-purple-500 h-2 rounded-full" style={{width: '100%'}}></div></div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-8">
                        {/* Experience */}
                        <section>
                            <h3 className="font-bold text-lg text-slate-900 mb-4">Experience</h3>
                            <div className="space-y-6">
                                {selectedCandidate.experience.map((exp, idx) => (
                                    <div key={idx} className="relative pl-6 border-l-2 border-slate-200">
                                        <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white border-2 border-brand-200"></div>
                                        <h4 className="font-bold text-slate-900">{exp.role}</h4>
                                        <p className="text-brand-600 text-sm font-medium">{exp.company}</p>
                                        <p className="text-slate-400 text-xs mb-2">{exp.duration}</p>
                                        <p className="text-slate-600 text-sm">Implemented scalable microservices and reduced latency by 40%. Led a team of 3 juniors.</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Education */}
                        <section>
                            <h3 className="font-bold text-lg text-slate-900 mb-4">Education</h3>
                            {selectedCandidate.education.map((edu, idx) => (
                                <div key={idx} className="bg-white border border-slate-100 p-4 rounded-xl">
                                    <h4 className="font-bold text-slate-900">{edu.school}</h4>
                                    <p className="text-slate-600 text-sm">{edu.degree}, {edu.year}</p>
                                </div>
                            ))}
                        </section>
                    </div>
                    
                    {/* Skills & Actions Side */}
                    <div className="space-y-8">
                        <section>
                            <h3 className="font-bold text-lg text-slate-900 mb-4">Skills</h3>
                            <div className="flex flex-wrap gap-2">
                                {selectedCandidate.skills.map(s => (
                                    <span key={s} className="bg-slate-100 text-slate-700 px-3 py-1 rounded-lg text-sm font-medium">{s}</span>
                                ))}
                            </div>
                        </section>
                        
                        {/* Video Intro Placeholder */}
                         <section>
                            <h3 className="font-bold text-lg text-slate-900 mb-4">Video Intro</h3>
                            <div className="aspect-video bg-slate-900 rounded-lg flex items-center justify-center text-white relative group cursor-pointer">
                                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                                    <div className="ml-1 border-l-8 border-l-white border-y-4 border-y-transparent"></div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>

                {/* Sticky Action Bar */}
                <div className="sticky bottom-0 bg-white border-t border-slate-100 pt-4 mt-8 pb-0 flex gap-4">
                    <button className="flex-1 bg-brand-600 text-white py-3 rounded-xl font-bold hover:bg-brand-700 transition-colors flex items-center justify-center gap-2">
                        <Calendar size={18} /> Schedule Interview
                    </button>
                    <button className="flex-1 bg-white border border-slate-300 text-slate-700 py-3 rounded-xl font-bold hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
                        <MessageSquare size={18} /> Message
                    </button>
                    <button className="w-12 flex items-center justify-center border border-red-200 text-red-500 rounded-xl hover:bg-red-50">
                        <X size={20} />
                    </button>
                </div>
            </>
        ) : (
            <div className="h-full flex items-center justify-center text-slate-400">
                Select a candidate to view details
            </div>
        )}
      </div>
    </div>
  );
};

export default ApplicantReview;