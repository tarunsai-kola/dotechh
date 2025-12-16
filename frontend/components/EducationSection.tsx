import React, { useState, useEffect } from 'react';
import { GraduationCap, Plus, Trash2, Loader2 } from 'lucide-react';
import { fetchEducation, addEducation, deleteEducation } from '../services';

interface Education {
    _id?: string;
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
    grade?: string;
}

const EducationSection = () => {
    const [education, setEducation] = useState<Education[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState<Education>({
        institution: '',
        degree: '',
        field: '',
        startDate: '',
        endDate: '',
        grade: ''
    });

    useEffect(() => {
        loadEducation();
    }, []);

    const loadEducation = async () => {
        try {
            const data = await fetchEducation();
            setEducation(data.data || []);
        } catch (err) {
            console.error('Failed to load education', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAdd = async () => {
        if (formData.institution && formData.degree && formData.field) {
            setIsSaving(true);
            try {
                const data = await addEducation(formData);
                setEducation(data.profile?.education || []);
                setFormData({
                    institution: '',
                    degree: '',
                    field: '',
                    startDate: '',
                    endDate: '',
                    grade: ''
                });
                setShowForm(false);
            } catch (err) {
                console.error('Failed to add education', err);
                alert('Failed to add education');
            } finally {
                setIsSaving(false);
            }
        }
    };

    const handleDelete = async (index: number) => {
        // Since we don't have IDs for local items yet (unless fetched), we might need to handle this carefully.
        // But fetched items will have _id.
        // For now, if we don't have DELETE endpoint, we can't delete from backend easily without replacing the whole array.
        // Let's assume we will add DELETE endpoint or just warn user.
        // Actually, let's just update local state for now if no ID, but if ID exists, call backend.
        // Wait, the backend schema adds _id automatically to subdocuments.

        const item = education[index];
        if (item._id) {
            if (!window.confirm('Are you sure you want to delete this education?')) return;
            try {
                const data = await deleteEducation(item._id);
                setEducation(data.profile?.education || data.data || []);
            } catch (err) {
                console.error('Failed to delete education', err);
                alert('Failed to delete education');
            }
        } else {
            setEducation(education.filter((_, i) => i !== index));
        }
    };

    if (isLoading) {
        return <div className="flex justify-center p-8"><Loader2 className="animate-spin text-brand-500" /></div>;
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <GraduationCap className="text-brand-600" size={24} />
                    <h3 className="text-xl font-bold text-slate-900">Education</h3>
                </div>
                {!showForm && (
                    <button
                        type="button"
                        onClick={() => setShowForm(true)}
                        className="flex items-center gap-2 px-4 py-2 text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                    >
                        <Plus size={16} />
                        Add Education
                    </button>
                )}
            </div>

            {/* Education List */}
            <div className="space-y-4 mb-6">
                {education.map((edu, index) => (
                    <div
                        key={index}
                        className="p-4 bg-slate-50 rounded-xl border border-slate-200 hover:border-brand-300 transition-colors"
                    >
                        <div className="flex justify-between items-start">
                            <div className="flex-1">
                                <h4 className="font-semibold text-slate-900">{edu.degree} in {edu.field}</h4>
                                <p className="text-sm text-slate-600 mt-1">{edu.institution}</p>
                                <p className="text-xs text-slate-500 mt-1">
                                    {edu.startDate} - {edu.endDate}
                                    {edu.grade && ` • Grade: ${edu.grade}`}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => handleDelete(index)}
                                className="text-red-500 hover:text-red-700 p-2"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Education Form */}
            {showForm && (
                <div className="p-6 bg-white border-2 border-brand-200 rounded-xl space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Institution *
                            </label>
                            <input
                                type="text"
                                value={formData.institution}
                                onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                                placeholder="e.g., MIT, Stanford University"
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Degree *
                            </label>
                            <input
                                type="text"
                                value={formData.degree}
                                onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                                placeholder="e.g., Bachelor's, Master's, Ph.D."
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Field of Study *
                            </label>
                            <input
                                type="text"
                                value={formData.field}
                                onChange={(e) => setFormData({ ...formData, field: e.target.value })}
                                placeholder="e.g., Computer Science, Data Science"
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Grade/GPA (Optional)
                            </label>
                            <input
                                type="text"
                                value={formData.grade}
                                onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                                placeholder="e.g., 3.8 GPA, First Class"
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Start Date *
                            </label>
                            <input
                                type="month"
                                value={formData.startDate}
                                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                End Date *
                            </label>
                            <input
                                type="month"
                                value={formData.endDate}
                                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    <div className="flex gap-3 justify-end pt-4 border-t border-slate-200">
                        <button
                            type="button"
                            onClick={() => setShowForm(false)}
                            className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleAdd}
                            disabled={isSaving}
                            className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 flex items-center gap-2"
                        >
                            {isSaving && <Loader2 size={14} className="animate-spin" />}
                            Add Education
                        </button>
                    </div>
                </div>
            )}

            {education.length === 0 && !showForm && (
                <div className="text-center py-8 text-slate-500">
                    <GraduationCap size={48} className="mx-auto mb-3 text-slate-300" />
                    <p>No education added yet. Click "Add Education" to get started.</p>
                </div>
            )}
        </div>
    );
};

export default EducationSection;
