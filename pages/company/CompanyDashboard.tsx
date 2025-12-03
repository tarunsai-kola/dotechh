import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Users, FileText, CheckCircle, TrendingUp, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CompanyDashboard = () => {
  const navigate = useNavigate();

  const data = [
    { name: 'Mon', applicants: 12 },
    { name: 'Tue', applicants: 19 },
    { name: 'Wed', applicants: 15 },
    { name: 'Thu', applicants: 25 },
    { name: 'Fri', applicants: 32 },
    { name: 'Sat', applicants: 10 },
    { name: 'Sun', applicants: 8 },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
         <div>
            <h2 className="text-2xl font-bold text-slate-900">Dashboard</h2>
            <p className="text-slate-500">Overview of your hiring pipeline</p>
         </div>
         <button onClick={() => navigate('/company/post-job')} className="flex items-center gap-2 bg-brand-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-brand-700 transition-colors shadow-lg shadow-brand-200">
            <Plus size={18} /> Post New Job
         </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         <StatCard title="Active Jobs" value="8" icon={FileText} trend="+2 this week" color="blue" />
         <StatCard title="Total Applicants" value="1,284" icon={Users} trend="+12% vs last month" color="purple" />
         <StatCard title="Interviews" value="24" icon={CheckCircle} trend="Scheduled for this week" color="green" />
         <StatCard title="Time to Hire" value="18d" icon={TrendingUp} trend="-2d improvement" color="orange" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Main Chart */}
         <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="font-bold text-slate-900 mb-6">Applicant Velocity</h3>
            <div className="h-80 w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data}>
                     <XAxis dataKey="name" stroke="#cbd5e1" />
                     <YAxis stroke="#cbd5e1" />
                     <Tooltip 
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                     />
                     <Line type="monotone" dataKey="applicants" stroke="#7c3aed" strokeWidth={3} dot={{r: 4, fill: '#7c3aed'}} />
                  </LineChart>
               </ResponsiveContainer>
            </div>
         </div>

         {/* Recent Activity List */}
         <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col">
            <h3 className="font-bold text-slate-900 mb-6">Recent Applicants</h3>
            <div className="flex-1 space-y-4 overflow-y-auto">
               {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors border border-transparent hover:border-slate-100">
                     <img src={`https://picsum.photos/id/${100+i}/40/40`} className="w-10 h-10 rounded-full object-cover" alt="User" />
                     <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline">
                            <h4 className="font-semibold text-slate-900 text-sm truncate">Candidate {i}</h4>
                            <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">9{i}% Match</span>
                        </div>
                        <p className="text-xs text-slate-500 truncate">Applied for AI Ethics Specialist</p>
                     </div>
                  </div>
               ))}
            </div>
            <button onClick={() => navigate('/company/applicants')} className="w-full mt-4 py-2 text-sm text-brand-600 font-medium hover:bg-brand-50 rounded-lg transition-colors">
               View All Candidates
            </button>
         </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon, trend, color }: any) => {
    const colors: any = {
        blue: 'bg-blue-50 text-blue-600',
        purple: 'bg-purple-50 text-purple-600',
        green: 'bg-green-50 text-green-600',
        orange: 'bg-orange-50 text-orange-600',
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${colors[color]}`}>
                    <Icon size={24} />
                </div>
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-1">{value}</div>
            <div className="text-sm text-slate-500 font-medium">{title}</div>
            <div className="text-xs text-slate-400 mt-2">{trend}</div>
        </div>
    );
}

export default CompanyDashboard;