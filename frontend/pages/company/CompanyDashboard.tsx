import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Users, FileText, CheckCircle, TrendingUp, Plus, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fetchJobs, getApplicationStats } from '../../services';

const CompanyDashboard = () => {
   const navigate = useNavigate();
   const [loading, setLoading] = useState(true);
   const [jobs, setJobs] = useState<any[]>([]);
   const [chartData, setChartData] = useState<any[]>([]);
   const [stats, setStats] = useState({
      activeJobs: 0,
      totalApplicants: 0,
      interviews: 0,
      timeToHire: '18d'
   });

   const user = JSON.parse(localStorage.getItem('user') || '{}');
   const companyId = user.user?.companyId || user.companyId;

   useEffect(() => {
      const loadData = async () => {
         try {
            if (companyId) {
               // Load jobs
               const jobsData = await fetchJobs({ companyId });
               console.log('Jobs loaded:', jobsData);
               const jobsList = jobsData.data || [];
               setJobs(jobsList);

               // Update active jobs count
               const activeCount = jobsList.length;
               console.log('Active jobs count:', activeCount);
               setStats(prev => ({
                  ...prev,
                  activeJobs: activeCount
               }));

               // Load application stats for chart (optional, might fail)
               try {
                  const statsData = await getApplicationStats(companyId);
                  setChartData(statsData.data || []);
               } catch (statsError) {
                  console.log('Stats endpoint not available yet, using empty data');
                  setChartData([]);
               }
            }
         } catch (error) {
            console.error("Failed to load dashboard data", error);
         } finally {
            setLoading(false);
         }
      };
      loadData();
   }, [companyId]);

   console.log('Current stats:', stats);
   console.log('Current jobs:', jobs);

   if (loading) {
      return <div className="h-96 flex items-center justify-center"><Loader2 className="animate-spin text-brand-600" size={32} /></div>;
   }

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
            <StatCard title="Active Jobs" value={stats.activeJobs} icon={FileText} trend="+2 this week" color="blue" />
            <StatCard title="Total Applicants" value={stats.totalApplicants} icon={Users} trend="+12% vs last month" color="purple" />
            <StatCard title="Interviews" value={stats.interviews} icon={CheckCircle} trend="Scheduled for this week" color="green" />
            <StatCard title="Time to Hire" value={stats.timeToHire} icon={TrendingUp} trend="-2d improvement" color="orange" />
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Chart */}
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
               <h3 className="font-bold text-slate-900 mb-6">Applicant Velocity</h3>
               <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                     <LineChart data={chartData}>
                        <XAxis dataKey="name" stroke="#cbd5e1" />
                        <YAxis stroke="#cbd5e1" />
                        <Tooltip
                           contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Line type="monotone" dataKey="applicants" stroke="#7c3aed" strokeWidth={3} dot={{ r: 4, fill: '#7c3aed' }} />
                     </LineChart>
                  </ResponsiveContainer>
               </div>
            </div>

            {/* Recent Activity List */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col">
               <h3 className="font-bold text-slate-900 mb-6">Recent Jobs</h3>
               <div className="flex-1 space-y-4 overflow-y-auto max-h-[300px]">
                  {jobs.length > 0 ? jobs.slice(0, 5).map((job) => (
                     <div
                        key={job._id}
                        onClick={() => navigate(`/company/jobs/${job._id}/manage`)}
                        className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors border border-transparent hover:border-slate-100"
                     >
                        <div className="p-2 bg-brand-50 text-brand-600 rounded-lg">
                           <FileText size={20} />
                        </div>
                        <div className="flex-1 min-w-0">
                           <div className="flex justify-between items-baseline">
                              <h4 className="font-semibold text-slate-900 text-sm truncate">{job.title}</h4>
                              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${job.status === 'published' ? 'bg-green-50 text-green-600' : 'bg-slate-100 text-slate-500'}`}>
                                 {job.status}
                              </span>
                           </div>
                           <p className="text-xs text-slate-500 truncate">{job.location} • {job.employmentType}</p>
                        </div>
                     </div>
                  )) : (
                     <div className="text-center text-slate-400 py-8">No jobs posted yet</div>
                  )}
               </div>
               <button onClick={() => navigate('/company/jobs')} className="w-full mt-4 py-2 text-sm text-brand-600 font-medium hover:bg-brand-50 rounded-lg transition-colors">
                  View All Jobs
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