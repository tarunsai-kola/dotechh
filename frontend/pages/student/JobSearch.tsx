
import React, { useState, useEffect } from 'react';
import { Search, MapPin, DollarSign, Filter, Briefcase, Bookmark, Sparkles, Loader2 } from 'lucide-react';
import { Job, FUTURE_JOB_CATEGORIES } from '../../types';
import { fetchJobs, applyToJob } from '../../services';

const JobSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  const loadJobs = async () => {
    setLoading(true);
    try {
      // In a real app, pass searchTerm and activeCategory to the API
      const data = await fetchJobs({ q: searchTerm });

      // API returns { status, data: [], pagination }
      const jobsList = data.data || [];

      // Client side filtering for demo purposes since API is basic
      const filtered = jobsList.filter((job: any) =>
        (activeCategory === 'All' || job.title.includes(activeCategory.split(' ')[0]))
      );
      setJobs(filtered);
    } catch (err) {
      console.error("Failed to fetch jobs", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, [activeCategory]); // Re-fetch/filter when category changes

  const handleApply = async (jobId: string) => {
    try {
      await applyToJob(jobId);
      alert('Applied successfully!');
      // Reload to update applied state
      loadJobs();
    } catch (err: any) {
      console.error('Application error:', err);
      const errorMessage = err.response?.data?.message || err.message;

      if (errorMessage.includes('profile')) {
        alert('Please complete your profile before applying. Go to Profile → Complete Profile');
        // Optionally redirect
        // navigate('/student/profile');
      } else if (errorMessage.includes('already applied')) {
        alert('You have already applied to this job!');
      } else {
        alert('Application failed: ' + errorMessage);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search by role, skill, or future category..."
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative md:w-48">
            <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
            <select className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 outline-none appearance-none bg-white">
              <option>Remote</option>
              <option>Hybrid</option>
              <option>On-site</option>
            </select>
          </div>
          <button
            onClick={loadJobs}
            className="px-6 py-3 bg-brand-600 text-white rounded-xl font-medium hover:bg-brand-700 shadow-lg shadow-brand-200"
          >
            Find Jobs
          </button>
        </div>

        {/* Future Category Tags */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-2 flex-shrink-0">Trending:</span>
          <button
            onClick={() => setActiveCategory('All')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${activeCategory === 'All' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            All
          </button>
          {FUTURE_JOB_CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${activeCategory === cat ? 'bg-brand-600 text-white' : 'bg-indigo-50 text-brand-700 border border-indigo-100 hover:bg-indigo-100'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Job List */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            {loading ? 'Loading...' : `${jobs.length} Positions Found`}
            {activeCategory !== 'All' && <span className="text-xs font-normal text-slate-500">(Filtered by {activeCategory})</span>}
          </h3>

          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="animate-spin text-brand-600" size={32} /></div>
          ) : jobs.length > 0 ? (
            jobs.map((job: any) => (
              <JobCard key={job._id} job={job} onApply={() => handleApply(job._id)} />
            ))
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-300">
              <Briefcase className="mx-auto text-slate-300 mb-4" size={48} />
              <h3 className="text-lg font-medium text-slate-900">No jobs found</h3>
              <p className="text-slate-500">Try adjusting your search filters or explore a new category.</p>
            </div>
          )}
        </div>

        {/* Sidebar Filters */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900">Filters</h3>
              <Filter size={16} className="text-slate-400" />
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">Salary Range</label>
                <input type="range" className="w-full accent-brand-600" />
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>$50k</span>
                  <span>$250k+</span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">Experience Level</label>
                <div className="space-y-2">
                  {['Internship', 'Entry Level', 'Senior', 'Executive'].map(lvl => (
                    <label key={lvl} className="flex items-center gap-2">
                      <input type="checkbox" className="rounded border-gray-300 text-brand-600 focus:ring-brand-500" />
                      <span className="text-sm text-slate-600">{lvl}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Upskill Promo */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-2xl text-white">
            <Sparkles className="text-yellow-400 mb-4" />
            <h3 className="font-bold text-lg mb-2">Bridge the gap</h3>
            <p className="text-slate-300 text-sm mb-4">
              You are a 85% match for "Quantum Developer" roles. Take a 4-week crash course to reach 95%.
            </p>
            <button className="w-full py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium transition-colors">
              View Course
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const JobCard: React.FC<{ job: any, onApply: () => void }> = ({ job, onApply }) => (
  <div className="bg-white p-6 rounded-xl border border-slate-200 hover:border-brand-300 hover:shadow-md transition-all group relative">
    <div className="flex justify-between items-start mb-4">
      <div className="flex gap-4">
        <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center font-bold text-slate-400 overflow-hidden">
          {job.companyId?.logoUrl ? (
            <img src={job.companyId.logoUrl} alt={job.companyId.name} className="w-full h-full object-cover" />
          ) : (
            job.companyId?.name?.charAt(0) || 'C'
          )}
        </div>
        <div>
          <h4 className="font-bold text-slate-900 group-hover:text-brand-600 transition-colors">{job.title}</h4>
          <p className="text-sm text-slate-500">{job.companyId?.name || 'Unknown Company'}</p>
        </div>
      </div>
      <button className="text-slate-400 hover:text-brand-600">
        <Bookmark size={20} />
      </button>
    </div>

    <div className="flex flex-wrap gap-2 mb-4">
      {job.skills && job.skills.map((skill: string) => (
        <span key={skill} className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-medium">
          {skill}
        </span>
      ))}
    </div>

    <div className="flex items-center gap-6 text-sm text-slate-500 mb-6">
      <div className="flex items-center gap-1">
        <MapPin size={16} /> {job.location}
      </div>
      <div className="flex items-center gap-1">
        <DollarSign size={16} /> {job.salaryRange?.min ? `$${job.salaryRange.min} - $${job.salaryRange.max}` : 'Competitive'}
      </div>
      <div className="flex items-center gap-1">
        <Briefcase size={16} /> {job.type}
      </div>
    </div>

    <div className="flex items-center justify-between pt-4 border-t border-slate-50">
      <span className="text-xs text-slate-400">Posted {new Date(job.createdAt || job.postedAt).toLocaleDateString()}</span>
      <button
        onClick={onApply}
        className="px-6 py-2 bg-brand-50 text-brand-700 font-medium rounded-lg hover:bg-brand-600 hover:text-white transition-all"
      >
        Quick Apply
      </button>
    </div>
  </div>
);

export default JobSearch;
