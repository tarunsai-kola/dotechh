import React, { useState, useEffect } from 'react';
import { fetchStudentApplications } from '../../services';
import { Loader2, Briefcase, MapPin, Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';

const MyApplications = () => {
    const [loading, setLoading] = useState(true);
    const [applications, setApplications] = useState<any[]>([]);

    useEffect(() => {
        const loadApplications = async () => {
            try {
                const { data } = await fetchStudentApplications();
                setApplications(data || []);
            } catch (error) {
                console.error("Failed to fetch applications", error);
            } finally {
                setLoading(false);
            }
        };
        loadApplications();
    }, []);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-brand-600" size={32} /></div>;
    }

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <h1 className="text-2xl font-bold text-slate-900 mb-2">My Applications</h1>
            <p className="text-slate-500 mb-8">Track the status of your job applications</p>

            <div className="space-y-4">
                {applications.length > 0 ? (
                    applications.map((app) => (
                        <div key={app._id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
                            <div className="flex flex-col md:flex-row justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-start justify-between mb-2">
                                        <h3 className="text-lg font-bold text-slate-900">{app.jobId?.title || 'Unknown Job'}</h3>
                                        <StatusBadge status={app.status} />
                                    </div>
                                    <p className="text-slate-600 font-medium mb-4">{app.jobId?.companyId?.name || 'Unknown Company'}</p>

                                    <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                                        <div className="flex items-center gap-1">
                                            <MapPin size={16} /> {app.jobId?.location || 'N/A'}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Briefcase size={16} /> {app.jobId?.type || 'N/A'}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Calendar size={16} /> Applied: {new Date(app.appliedAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Timeline / History could go here */}
                            {app.history && app.history.length > 0 && (
                                <div className="mt-6 pt-4 border-t border-slate-50">
                                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Activity</h4>
                                    <div className="space-y-3">
                                        {app.history.map((event: any, idx: number) => (
                                            <div key={idx} className="flex items-start gap-3 text-sm">
                                                <div className="mt-0.5 w-2 h-2 rounded-full bg-slate-300"></div>
                                                <div>
                                                    <p className="text-slate-700"><span className="font-medium capitalize">{event.status}</span> - {event.note}</p>
                                                    <p className="text-xs text-slate-400">{new Date(event.at).toLocaleString()}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-300">
                        <Briefcase className="mx-auto text-slate-300 mb-4" size={48} />
                        <h3 className="text-lg font-medium text-slate-900">No applications yet</h3>
                        <p className="text-slate-500 mb-6">Start exploring jobs and apply to your dream roles.</p>
                        <a href="#/student/jobs" className="text-brand-600 font-medium hover:underline">Browse Jobs</a>
                    </div>
                )}
            </div>
        </div>
    );
};

const StatusBadge = ({ status }: { status: string }) => {
    // Masking Logic
    let displayStatus = status;
    let styleKey = status;

    if (status === 'pending_hr') {
        displayStatus = 'Under Review';
        styleKey = 'applied';
    } else if (status === 'hr_rejected') {
        displayStatus = 'Not Selected';
        styleKey = 'rejected';
    } else if (status === 'forwarded_to_company') {
        displayStatus = 'Shortlisted'; // Positive reinforcement or "Under Review"
        styleKey = 'interview';
    } else if (status === 'company_accepted') {
        displayStatus = 'Interview';
        styleKey = 'accepted';
    } else if (status === 'company_rejected') {
        displayStatus = 'Not Selected';
        styleKey = 'rejected';
    }

    const styles: any = {
        applied: 'bg-blue-50 text-blue-700 border-blue-100',
        seen: 'bg-purple-50 text-purple-700 border-purple-100',
        interview: 'bg-orange-50 text-orange-700 border-orange-100',
        accepted: 'bg-green-50 text-green-700 border-green-100',
        rejected: 'bg-red-50 text-red-700 border-red-100',
    };

    const icons: any = {
        applied: Clock,
        seen: CheckCircle,
        interview: Calendar,
        accepted: CheckCircle,
        rejected: XCircle,
    };

    const Icon = icons[styleKey] || Clock;

    return (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1.5 capitalize ${styles[styleKey] || 'bg-slate-50 text-slate-600 border-slate-100'}`}>
            <Icon size={14} />
            {displayStatus}
        </span>
    );
};

export default MyApplications;
