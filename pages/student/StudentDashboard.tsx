import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { MOCK_APPLICATIONS, MOCK_JOBS } from '../../constants';
import { ArrowUpRight, Check, Clock, XCircle, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const completeness = 85; // Mock data
  
  // Chart Data
  const appStatusData = [
    { name: 'Applied', value: 3, color: '#94a3b8' },
    { name: 'Interview', value: 1, color: '#8b5cf6' },
    { name: 'Rejected', value: 1, color: '#ef4444' },
  ];

  const skillGapData = [
    { name: 'Python', score: 90 },
    { name: 'React', score: 85 },
    { name: 'Rust', score: 30 }, // Gap
    { name: 'AI Ethics', score: 40 }, // Gap
  ];

  return (
    <div className="space-y-8">
      {/* Profile Completeness Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-6">
        <div className="relative w-20 h-20 flex-shrink-0">
           <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path className="text-slate-100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
              <path className="text-brand-500" strokeDasharray={`${completeness}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
           </svg>
           <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-slate-700">{completeness}%</div>
        </div>
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-lg font-bold text-slate-900">Your profile is almost complete</h2>
          <p className="text-slate-500 text-sm mt-1">Add a video intro to boost your visibility by 40%.</p>
        </div>
        <button onClick={() => navigate('/student/profile')} className="px-5 py-2.5 bg-brand-50 text-brand-700 font-medium rounded-lg hover:bg-brand-100 transition-colors">
          Complete Profile
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Application Stats */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
           <h3 className="text-slate-900 font-bold mb-4">Application Status</h3>
           <div className="h-48 w-full">
             <ResponsiveContainer width="100%" height="100%">
               <PieChart>
                 <Pie
                   data={appStatusData}
                   innerRadius={60}
                   outerRadius={80}
                   paddingAngle={5}
                   dataKey="value"
                 >
                   {appStatusData.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={entry.color} />
                   ))}
                 </Pie>
               </PieChart>
             </ResponsiveContainer>
           </div>
           <div className="flex justify-center gap-4 mt-2">
              {appStatusData.map((d) => (
                <div key={d.name} className="flex items-center gap-1 text-xs text-slate-500">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }}></div>
                  {d.name}
                </div>
              ))}
           </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
             <h3 className="text-slate-900 font-bold">Recent Applications</h3>
             <span className="text-brand-600 text-sm font-medium cursor-pointer hover:underline">View All</span>
          </div>
          <div className="space-y-4">
            {MOCK_APPLICATIONS.map((app) => (
              <div key={app.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-gray-200 font-bold text-slate-700 text-xs">
                       {app.company.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                       <h4 className="font-semibold text-slate-900">{app.jobTitle}</h4>
                       <p className="text-xs text-slate-500">{app.company} • Applied {app.appliedAt}</p>
                    </div>
                 </div>
                 <div className={`px-3 py-1 rounded-full text-xs font-medium border
                    ${app.status === 'Applied' ? 'bg-slate-100 text-slate-600 border-slate-200' : ''}
                    ${app.status === 'Interview' ? 'bg-purple-50 text-purple-600 border-purple-200' : ''}
                    ${app.status === 'Rejected' ? 'bg-red-50 text-red-600 border-red-200' : ''}
                 `}>
                    {app.status}
                 </div>
              </div>
            ))}
          </div>
        </div>

        {/* Skill Gap Analysis */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-slate-900 font-bold">Market Skill Gaps</h3>
            <span className="text-xs text-slate-400">Based on recent job views</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
               <BarChart data={skillGapData} layout="vertical">
                 <XAxis type="number" domain={[0, 100]} hide />
                 <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 12}} />
                 <Tooltip />
                 <Bar dataKey="score" barSize={20} radius={[0, 4, 4, 0]}>
                    {skillGapData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.score < 50 ? '#fbbf24' : '#8b5cf6'} />
                    ))}
                 </Bar>
               </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex gap-4 overflow-x-auto pb-2">
             <div className="flex-shrink-0 p-3 bg-yellow-50 border border-yellow-100 rounded-lg max-w-[200px]">
                <div className="text-xs font-bold text-yellow-800 mb-1 flex items-center gap-1">
                  <AlertCircle size={12} /> Suggested Course
                </div>
                <div className="text-xs text-slate-700">Rust for Systems Programming (12h)</div>
             </div>
             <div className="flex-shrink-0 p-3 bg-yellow-50 border border-yellow-100 rounded-lg max-w-[200px]">
                <div className="text-xs font-bold text-yellow-800 mb-1 flex items-center gap-1">
                   <AlertCircle size={12} /> Certification
                </div>
                <div className="text-xs text-slate-700">AI Safety & Ethics Fundamentals</div>
             </div>
          </div>
        </div>

        {/* Recommended Jobs */}
        <div className="bg-gradient-to-br from-brand-600 to-indigo-700 p-6 rounded-2xl text-white shadow-lg">
           <h3 className="font-bold text-lg mb-2">Recommended for you</h3>
           <p className="text-indigo-100 text-sm mb-6">Based on your "AI Ethics" skills</p>
           
           <div className="space-y-3">
              <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl border border-white/10 hover:bg-white/20 transition-colors cursor-pointer" onClick={() => navigate('/student/jobs')}>
                 <h4 className="font-semibold text-sm">Junior AI Policy Analyst</h4>
                 <p className="text-xs text-indigo-200 mt-1">OpenAI • $120k - $150k</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl border border-white/10 hover:bg-white/20 transition-colors cursor-pointer" onClick={() => navigate('/student/jobs')}>
                 <h4 className="font-semibold text-sm">Synthetic Data Engineer</h4>
                 <p className="text-xs text-indigo-200 mt-1">Scale AI • $140k+</p>
              </div>
           </div>
           
           <button onClick={() => navigate('/student/jobs')} className="w-full mt-6 py-2 bg-white text-brand-700 font-semibold rounded-lg text-sm hover:bg-brand-50 transition-colors flex items-center justify-center gap-2">
             View All Recommendations <ArrowUpRight size={16} />
           </button>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;