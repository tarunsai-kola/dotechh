import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Edit2, Trash2, Save, X, Users, Loader2, AlertCircle } from 'lucide-react';
import { getJobDetails, updateJob, deleteJob } from '../../services';

const JobManage = () => {
    const navigate = useNavigate();
    const { jobId } = useParams();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editing, setEditing] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [job, setJob] = useState<any>(null);
    const [formData, setFormData] = useState<any>({});

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const companyId = user.companyId || user.user?.companyId;

    useEffect(() => {
        loadJob();
    }, [jobId]);

    const loadJob = async () => {
        try {
            setLoading(true);
            console.log('Loading job with ID:', jobId);
            console.log('Company ID:', companyId);
            const response = await getJobDetails(jobId!);
            console.log('Job loaded successfully:', response);
            setJob(response.data);
            setFormData({
                title: response.data.title,
                description: response.data.description,
                location: response.data.location,
                employmentType: response.data.employmentType,
                skills: Array.isArray(response.data.skills) ? response.data.skills.join(', ') : '',
                experienceMin: response.data.experienceMin || 0,
                experienceMax: response.data.experienceMax || 5,
                requirements: Array.isArray(response.data.requirements) ? response.data.requirements.join('\n') : '',
                responsibilities: Array.isArray(response.data.responsibilities) ? response.data.responsibilities.join('\n') : '',
                salaryRange: response.data.salaryRange || { min: 0, max: 0 },
                status: response.data.status
            });
        } catch (error) {
            console.error('Failed to load job:', error);
            alert('Failed to load job details');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            const updateData = {
                ...formData,
                skills: formData.skills.split(',').map((s: string) => s.trim()).filter((s: string) => s),
                requirements: formData.requirements.split('\n').filter((r: string) => r.trim()),
                responsibilities: formData.responsibilities.split('\n').filter((r: string) => r.trim())
            };

            await updateJob(companyId!, jobId!, updateData);
            await loadJob();
            setEditing(false);
            alert('Job updated successfully!');
        } catch (error: any) {
            console.error('Failed to update job:', error);
            alert(`Failed to update job: ${error.response?.data?.message || error.message}`);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        try {
            await deleteJob(companyId!, jobId!);
            alert('Job deleted successfully!');
            navigate('/company/dashboard');
        } catch (error: any) {
            console.error('Failed to delete job:', error);
            alert(`Failed to delete job: ${error.response?.data?.message || error.message}`);
        }
    };

    if (loading) {
        return (
            <div className="h-96 flex items-center justify-center">
                <Loader2 className="animate-spin text-brand-600" size={32} />
            </div>
        );
    }

    if (!job) {
        return (
            <div className="max-w-4xl mx-auto py-8 px-4 text-center">
                <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Job Not Found</h2>
                <button onClick={() => navigate('/company/dashboard')} className="text-brand-600 hover:underline">
                    Back to Dashboard
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <button onClick={() => navigate('/company/dashboard')} className="flex items-center text-slate-500 hover:text-slate-700 mb-6 transition-colors">
                <ArrowLeft size={20} className="mr-2" /> Back to Dashboard
            </button>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-start">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">
                            {editing ? 'Edit Job' : job.title}
                        </h1>
                        <p className="text-slate-500 mt-1">
                            {job.location} • {job.employmentType}
                        </p>
                        <span className={`inline-block mt-2 text-xs font-bold px-3 py-1 rounded-full ${job.status === 'published' ? 'bg-green-50 text-green-600' : 'bg-slate-100 text-slate-500'
                            }`}>
                            {job.status}
                        </span>
                    </div>

                    <div className="flex gap-2">
                        {!editing ? (
                            <>
                                <button
                                    onClick={() => setEditing(true)}
                                    className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors"
                                >
                                    <Edit2 size={16} /> Edit
                                </button>
                                <button
                                    onClick={() => setShowDeleteConfirm(true)}
                                    className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                                >
                                    <Trash2 size={16} /> Delete
                                </button>
                                <button
                                    onClick={() => navigate(`/company/applicants?jobId=${jobId}`)}
                                    className="flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors"
                                >
                                    <Users size={16} /> View Applicants
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                                >
                                    {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                                    Save
                                </button>
                                <button
                                    onClick={() => {
                                        setEditing(false);
                                        loadJob();
                                    }}
                                    className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
                                >
                                    <X size={16} /> Cancel
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Content */}
                <div className="p-8 space-y-6">
                    {editing ? (
                        // Edit Mode
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Job Title</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 outline-none h-32"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                                    <input
                                        type="text"
                                        value={formData.location}
                                        onChange={e => setFormData({ ...formData, location: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Employment Type</label>
                                    <select
                                        value={formData.employmentType}
                                        onChange={e => setFormData({ ...formData, employmentType: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 outline-none"
                                    >
                                        <option>Full-time</option>
                                        <option>Part-time</option>
                                        <option>Contract</option>
                                        <option>Internship</option>
                                        <option>Remote</option>
                                        <option>Hybrid</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Skills (comma separated)</label>
                                <input
                                    type="text"
                                    value={formData.skills}
                                    onChange={e => setFormData({ ...formData, skills: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 outline-none"
                                    placeholder="React, Node.js, TypeScript"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Min Experience (Years)</label>
                                    <input
                                        type="number"
                                        value={formData.experienceMin}
                                        onChange={e => setFormData({ ...formData, experienceMin: parseInt(e.target.value) })}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Max Experience (Years)</label>
                                    <input
                                        type="number"
                                        value={formData.experienceMax}
                                        onChange={e => setFormData({ ...formData, experienceMax: parseInt(e.target.value) })}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Requirements (one per line)</label>
                                <textarea
                                    value={formData.requirements}
                                    onChange={e => setFormData({ ...formData, requirements: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 outline-none h-32"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Responsibilities (one per line)</label>
                                <textarea
                                    value={formData.responsibilities}
                                    onChange={e => setFormData({ ...formData, responsibilities: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 outline-none h-32"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                                <select
                                    value={formData.status}
                                    onChange={e => setFormData({ ...formData, status: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 outline-none"
                                >
                                    <option value="draft">Draft</option>
                                    <option value="published">Published</option>
                                </select>
                            </div>
                        </div>
                    ) : (
                        // View Mode
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-sm font-semibold text-slate-700 mb-2">Description</h3>
                                <p className="text-slate-600 whitespace-pre-wrap">{job.description}</p>
                            </div>

                            {job.skills && job.skills.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-semibold text-slate-700 mb-2">Required Skills</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {job.skills.map((skill: string, index: number) => (
                                            <span key={index} className="px-3 py-1 bg-brand-50 text-brand-600 rounded-full text-sm font-medium">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div>
                                <h3 className="text-sm font-semibold text-slate-700 mb-2">Experience Required</h3>
                                <p className="text-slate-600">{job.experienceMin} - {job.experienceMax} years</p>
                            </div>

                            {job.requirements && job.requirements.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-semibold text-slate-700 mb-2">Requirements</h3>
                                    <ul className="list-disc list-inside space-y-1 text-slate-600">
                                        {job.requirements.map((req: string, index: number) => (
                                            <li key={index}>{req}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {job.responsibilities && job.responsibilities.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-semibold text-slate-700 mb-2">Responsibilities</h3>
                                    <ul className="list-disc list-inside space-y-1 text-slate-600">
                                        {job.responsibilities.map((resp: string, index: number) => (
                                            <li key={index}>{resp}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Delete Job?</h3>
                        <p className="text-slate-600 mb-6">
                            Are you sure you want to delete this job posting? This action cannot be undone.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={handleDelete}
                                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                            >
                                Delete
                            </button>
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="flex-1 px-4 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors font-medium"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default JobManage;
