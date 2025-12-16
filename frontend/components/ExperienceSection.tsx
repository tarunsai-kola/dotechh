import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Briefcase, Calendar, Loader2 } from 'lucide-react';
import { fetchExperience, addExperience, updateExperience, deleteExperience } from '../services';

interface Experience {
    _id: string;
    title: string;
    company: string;
    startDate: string;
    endDate: string | null;
    description: string;
}

const ExperienceSection: React.FC = () => {
    const [experiences, setExperiences] = useState<Experience[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentExp, setCurrentExp] = useState<Partial<Experience>>({});
    const [error, setError] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        loadExperience();
    }, []);

    const loadExperience = async () => {
        try {
            const data = await fetchExperience();
            // Backend returns { status: "success", data: [...] }
            setExperiences(data.data || []);
        } catch (err) {
            console.error('Failed to load experience', err);
            setExperiences([]); // Ensure it's always an array
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddNew = () => {
        setCurrentExp({
            title: '',
            company: '',
            startDate: '',
            endDate: '',
            description: ''
        });
        setIsEditing(true);
        setError(null);
    };

    const handleEdit = (exp: Experience) => {
        setCurrentExp({
            ...exp,
            startDate: exp.startDate ? new Date(exp.startDate).toISOString().split('T')[0] : '',
            endDate: exp.endDate ? new Date(exp.endDate).toISOString().split('T')[0] : ''
        });
        setIsEditing(true);
        setError(null);
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this position?')) return;

        try {
            const data = await deleteExperience(id);
            // Backend should return updated profile or experience list
            setExperiences(data.profile?.experience || data.data || []);
        } catch (err) {
            console.error('Failed to delete experience', err);
            alert('Failed to delete experience');
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setError(null);

        try {
            if (currentExp._id) {
                // Update
                const data = await updateExperience(currentExp._id, currentExp);
                setExperiences(data.profile?.experience || []);
            } else {
                // Create
                const data = await addExperience(currentExp);
                setExperiences(data.profile?.experience || []);
            }
            setIsEditing(false);
        } catch (err: any) {
            console.error('Failed to save experience', err);
            setError(err.response?.data?.message || 'Failed to save experience');
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setCurrentExp({});
        setError(null);
    };

    if (isLoading) {
        return <div className="flex justify-center p-8"><Loader2 className="animate-spin text-brand-500" /></div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                    <Briefcase size={20} className="text-brand-500" />
                    Experience
                </h3>
                {!isEditing && (
                    <button
                        onClick={handleAddNew}
                        className="flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700"
                    >
                        <Plus size={16} /> Add Position
                    </button>
                )}
            </div>

            {isEditing ? (
                <form onSubmit={handleSave} className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Title *</label>
                            <input
                                type="text"
                                required
                                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-brand-500 focus:border-brand-500"
                                value={currentExp.title || ''}
                                onChange={e => setCurrentExp({ ...currentExp, title: e.target.value })}
                                placeholder="e.g. Software Engineer"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Company *</label>
                            <input
                                type="text"
                                required
                                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-brand-500 focus:border-brand-500"
                                value={currentExp.company || ''}
                                onChange={e => setCurrentExp({ ...currentExp, company: e.target.value })}
                                placeholder="e.g. Acme Corp"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Start Date</label>
                            <input
                                type="date"
                                required
                                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-brand-500 focus:border-brand-500"
                                value={currentExp.startDate || ''}
                                onChange={e => setCurrentExp({ ...currentExp, startDate: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">End Date</label>
                            <input
                                type="date"
                                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-brand-500 focus:border-brand-500"
                                value={currentExp.endDate || ''}
                                onChange={e => setCurrentExp({ ...currentExp, endDate: e.target.value })}
                            />
                            <p className="text-xs text-slate-500 mt-1">Leave blank if currently working here</p>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                        <textarea
                            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-brand-500 focus:border-brand-500"
                            rows={3}
                            value={currentExp.description || ''}
                            onChange={e => setCurrentExp({ ...currentExp, description: e.target.value })}
                            placeholder="Describe your responsibilities and achievements..."
                        />
                    </div>

                    {error && <div className="text-sm text-red-600 bg-red-50 p-2 rounded">{error}</div>}

                    <div className="flex justify-end gap-2 pt-2">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="px-4 py-2 text-sm font-medium text-white bg-brand-600 rounded-md hover:bg-brand-700 disabled:opacity-50 flex items-center gap-2"
                        >
                            {isSaving && <Loader2 size={14} className="animate-spin" />}
                            Save Position
                        </button>
                    </div>
                </form>
            ) : (
                <div className="space-y-4">
                    {experiences.length === 0 ? (
                        <div className="text-center py-8 bg-slate-50 rounded-lg border border-dashed border-slate-300">
                            <p className="text-slate-500 mb-2">No experience added yet</p>
                            <button
                                onClick={handleAddNew}
                                className="text-brand-600 font-medium hover:underline"
                            >
                                Add your first position
                            </button>
                        </div>
                    ) : (
                        experiences.map((exp) => (
                            <div key={exp._id} className="flex gap-4 p-4 bg-white border border-slate-200 rounded-lg hover:shadow-sm transition-shadow">
                                <div className="mt-1">
                                    <div className="w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center text-brand-600">
                                        <Briefcase size={20} />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-semibold text-slate-900">{exp.title}</h4>
                                            <p className="text-slate-600">{exp.company}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEdit(exp)}
                                                className="p-1 text-slate-400 hover:text-brand-600 transition-colors"
                                                title="Edit"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(exp._id)}
                                                className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                                        <Calendar size={14} />
                                        <span>
                                            {new Date(exp.startDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })} -
                                            {exp.endDate ? new Date(exp.endDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }) : 'Present'}
                                        </span>
                                    </div>
                                    {exp.description && (
                                        <p className="text-sm text-slate-600 mt-2 whitespace-pre-line">{exp.description}</p>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default ExperienceSection;
