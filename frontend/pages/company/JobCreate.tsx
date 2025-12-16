import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Briefcase, MapPin, DollarSign, Clock, CheckCircle, Loader2, FileText } from 'lucide-react';
import { createJob } from '../../services';

const JobCreate = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        location: '',
        type: 'Full-time',
        salaryRange: '', // We'll parse this or change UI to min/max
        skills: '', // Comma separated
        experienceMin: 0,
        experienceMax: 5,
        requirements: '', // New line separated
        responsibilities: '' // New line separated
    });

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    // Debug: Check user object structure
    console.log('JobCreate - User from LocalStorage:', user);

    // Handle different user structures (login vs register response might differ)
    const companyId = user.companyId || user.user?.companyId || user.id || user.user?.id;
    console.log('JobCreate - Derived Company ID:', companyId);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        if (!companyId) {
            alert('Error: Company ID not found. Please log out and log in again.');
            setLoading(false);
            return;
        }

        try {
            const skillsArray = formData.skills.split(',').map(s => s.trim()).filter(s => s);
            const reqArray = formData.requirements.split('\n').filter(r => r.trim());
            const respArray = formData.responsibilities.split('\n').filter(r => r.trim());

            await createJob({
                companyId, // Should be handled by backend auth but good to have
                title: formData.title,
                description: formData.description,
                location: formData.location,
                employmentType: formData.type, // Backend expects employmentType
                // salaryRange: formData.salaryRange, // Removed duplicate
                // Schema: salaryRange: { min: Number, max: Number }
                salaryRange: { min: 0, max: 0 }, // Placeholder, need to fix UI
                skills: skillsArray,
                experienceMin: formData.experienceMin,
                experienceMax: formData.experienceMax,
                requirements: reqArray,
                responsibilities: respArray,
                status: 'published'
            });

            navigate('/company/dashboard');
        } catch (error: any) {
            console.error('Failed to create job', error);
            console.error('Error response:', error.response?.data);

            // Extract error message
            let errorMsg = 'Unknown error';
            if (error.response?.data?.errors) {
                // Validation errors from express-validator
                errorMsg = error.response.data.errors.map((e: any) => e.msg).join(', ');
            } else if (error.response?.data?.message) {
                errorMsg = error.response.data.message;
            } else if (error.message) {
                errorMsg = error.message;
            }

            alert(`Failed to create job: ${errorMsg}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <button onClick={() => navigate(-1)} className="flex items-center text-slate-500 hover:text-slate-700 mb-6 transition-colors">
                <ArrowLeft size={20} className="mr-2" /> Back to Dashboard
            </button>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-slate-50">
                    <h1 className="text-2xl font-bold text-slate-900">Post a New Job</h1>
                    <p className="text-slate-500 mt-1">Create a job listing to find your next great hire.</p>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-8">

                    {/* Basic Info */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                            <Briefcase size={20} className="text-brand-600" /> Basic Information
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-1">Job Title</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 outline-none"
                                    placeholder="e.g. Senior Frontend Engineer"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Employment Type</label>
                                <select
                                    value={formData.type}
                                    onChange={e => setFormData({ ...formData, type: e.target.value })}
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

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                                <div className="relative">
                                    <MapPin size={18} className="absolute left-3 top-3.5 text-slate-400" />
                                    <input
                                        type="text"
                                        value={formData.location}
                                        onChange={e => setFormData({ ...formData, location: e.target.value })}
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 outline-none"
                                        placeholder="e.g. New York, NY or Remote"
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Details */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                            <FileText size={20} className="text-brand-600" /> Job Details
                        </h3>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                            <textarea
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 outline-none h-32"
                                placeholder="Describe the role and responsibilities..."
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Requirements (one per line)</label>
                                <textarea
                                    value={formData.requirements}
                                    onChange={e => setFormData({ ...formData, requirements: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 outline-none h-32"
                                    placeholder="- 5+ years of experience&#10;- Strong React skills"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Responsibilities (one per line)</label>
                                <textarea
                                    value={formData.responsibilities}
                                    onChange={e => setFormData({ ...formData, responsibilities: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 outline-none h-32"
                                    placeholder="- Lead the frontend team&#10;- Architect new features"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Requirements */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                            <CheckCircle size={20} className="text-brand-600" /> Requirements
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Min Exp (Years)</label>
                                    <input
                                        type="number"
                                        value={formData.experienceMin}
                                        onChange={e => setFormData({ ...formData, experienceMin: parseInt(e.target.value) })}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Max Exp (Years)</label>
                                    <input
                                        type="number"
                                        value={formData.experienceMax}
                                        onChange={e => setFormData({ ...formData, experienceMax: parseInt(e.target.value) })}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-slate-100 flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="px-6 py-3 rounded-xl font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-brand-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-brand-700 transition-all shadow-lg shadow-brand-200 flex items-center gap-2 disabled:opacity-70"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : 'Post Job'}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default JobCreate;
