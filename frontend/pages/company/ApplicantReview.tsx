import React, { useState, useEffect } from 'react';
import { Search, Filter, CheckCircle, XCircle, FileText, User, Loader2 } from 'lucide-react';
import api from '../../services';

const ApplicantReview = () => {
    const [loading, setLoading] = useState(true);
    const [jobs, setJobs] = useState<any[]>([]);
    const [selectedJobId, setSelectedJobId] = useState<string>('');
    const [applicants, setApplicants] = useState<any[]>([]);

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const companyId = user.user?.companyId || user.companyId;

    // Fetch Jobs first to populate dropdown
    useEffect(() => {
        const fetchCompanyJobs = async () => {
            try {
                if (companyId) {
                    const { data } = await api.get(`/companies/${companyId}/jobs`);
                    const jobList = data.data || [];
                    setJobs(jobList);
                    if (jobList.length > 0) {
                        setSelectedJobId(jobList[0]._id);
                    } else {
                        setLoading(false);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch jobs", error);
                setLoading(false);
            }
        };
        fetchCompanyJobs();
    }, [companyId]);

    // Fetch Applicants when selectedJobId changes
    useEffect(() => {
        const fetchApplicants = async () => {
            if (!selectedJobId || !companyId) return;
            setLoading(true);
            try {
                const { data } = await api.get(`/companies/${companyId}/jobs/${selectedJobId}/applications`);
                setApplicants(data.data || []);
            } catch (error) {
                console.error("Failed to fetch applicants", error);
            } finally {
                setLoading(false);
            }
        };
        fetchApplicants();
    }, [selectedJobId, companyId]);

    const handleStatusUpdate = async (appId: string, newStatus: string) => {
        try {
            await api.put(`/applications/${appId}/status`, { status: newStatus });
            // Update local state
            setApplicants(prev => prev.map(app =>
                app._id === appId ? { ...app, status: newStatus } : app
            ));
        } catch (error) {
            console.error("Failed to update status", error);
            alert("Failed to update status");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Applicant Review</h2>
                    <p className="text-slate-500">Manage and track candidate applications</p>
                </div>

                <div className="flex items-center gap-3">
                    <select
                        value={selectedJobId}
                        onChange={(e) => setSelectedJobId(e.target.value)}
                        className="px-4 py-2 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-brand-500 outline-none"
                    >
                        {jobs.map(job => (
                            <option key={job._id} value={job._id}>{job.title}</option>
                        ))}
                        {jobs.length === 0 && <option>No jobs found</option>}
                    </select>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search candidates..."
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                </div>
                <div className="flex gap-2">
                    <button className="px-4 py-2 border border-slate-200 rounded-lg flex items-center gap-2 hover:bg-slate-50">
                        <Filter size={18} /> Filters
                    </button>
                </div>
            </div>

            {/* Applicants List */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                {loading ? (
                    <div className="p-12 flex justify-center"><Loader2 className="animate-spin text-brand-600" size={32} /></div>
                ) : applicants.length > 0 ? (
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Candidate</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Applied Date</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Match Score</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {applicants.map((app) => (
                                <tr key={app._id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-bold">
                                                {app.profileId?.fullName?.charAt(0) || 'U'}
                                            </div>
                                            <div>
                                                <div className="font-semibold text-slate-900">{app.profileId?.fullName || 'Unknown User'}</div>
                                                <div className="text-xs text-slate-500">{app.studentUserId?.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-500">
                                        {new Date(app.appliedAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full ${app.matchScore >= 80 ? 'bg-green-500' : app.matchScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                                    style={{ width: `${app.matchScore}%` }}
                                                />
                                            </div>
                                            <span className="text-sm font-medium text-slate-700">{app.matchScore}%</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <StatusBadge status={app.status} />
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {/* Only show actions if status is 'forwarded_to_company' or 'company_viewed' */}
                                            {['forwarded_to_company', 'company_viewed'].includes(app.status) && (
                                                <>
                                                    <button
                                                        onClick={() => handleStatusUpdate(app._id, 'company_accepted')}
                                                        className="p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                        title="Shortlist / Accept"
                                                    >
                                                        <CheckCircle size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusUpdate(app._id, 'company_rejected')}
                                                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Reject"
                                                    >
                                                        <XCircle size={18} />
                                                    </button>
                                                </>
                                            )}
                                            <a
                                                href={`#/student/profile/${app.profileId?._id}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                                                title="View Profile"
                                            >
                                                <User size={18} />
                                            </a>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="p-12 text-center text-slate-500">No applicants found for this job.</div>
                )}
            </div>
        </div>
    );
};

export default ApplicantReview;

const StatusBadge = ({ status }: { status: string }) => {
    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'company_accepted': return 'bg-green-100 text-green-700 border-green-200';
            case 'company_rejected': return 'bg-red-100 text-red-700 border-red-200';
            case 'forwarded_to_company': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'pending_hr': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            default: return 'bg-slate-100 text-slate-600 border-slate-200';
        }
    };

    const getLabel = (status: string) => {
        switch (status) {
            case 'company_accepted': return 'Shortlisted';
            case 'company_rejected': return 'Rejected';
            case 'forwarded_to_company': return 'Action Required';
            case 'pending_hr': return 'HR Review'; // Should not be seen ideally
            default: return status.replace('_', ' ');
        }
    };

    return (
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusStyle(status)}`}>
            {getLabel(status)}
        </span>
    );
};