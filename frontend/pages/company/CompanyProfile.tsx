import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Mail, Phone, Globe, MapPin, Users, Edit2, Save, X, Loader2 } from 'lucide-react';
import axios from 'axios';

const CompanyProfile = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [company, setCompany] = useState<any>(null);
    const [formData, setFormData] = useState<any>({});

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const companyId = user.companyId || user.user?.companyId;
    const token = user.token;

    useEffect(() => {
        loadCompany();
    }, []);

    const loadCompany = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:5000/api/companies/${companyId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCompany(response.data.data);
            setFormData({
                name: response.data.data.name || '',
                description: response.data.data.description || '',
                website: response.data.data.website || '',
                industry: response.data.data.industry || '',
                size: response.data.data.size || '',
                location: response.data.data.location || '',
                email: response.data.data.email || '',
                phone: response.data.data.phone || ''
            });
        } catch (error) {
            console.error('Failed to load company:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            await axios.put(`http://localhost:5000/api/companies/${companyId}`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            await loadCompany();
            setEditing(false);
            alert('Company profile updated successfully!');
        } catch (error: any) {
            console.error('Failed to update company:', error);
            alert(`Failed to update: ${error.response?.data?.message || error.message}`);
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setEditing(false);
        if (company) {
            setFormData({
                name: company.name || '',
                description: company.description || '',
                website: company.website || '',
                industry: company.industry || '',
                size: company.size || '',
                location: company.location || '',
                email: company.email || '',
                phone: company.phone || ''
            });
        }
    };

    if (loading) {
        return (
            <div className="h-96 flex items-center justify-center">
                <Loader2 className="animate-spin text-brand-600" size={32} />
            </div>
        );
    }

    if (!company) {
        return (
            <div className="max-w-4xl mx-auto py-8 px-4text-center">
                <p className="text-slate-600">Company not found</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            {/* Header */}
            <div className="bg-gradient-to-r from-brand-600 to-purple-600 rounded-2xl p-8 mb-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-32 -mt-32"></div>
                <div className="relative z-10">
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-4">
                            <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-lg">
                                <Building2 size={40} className="text-brand-600" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold mb-2">{company.name}</h1>
                                <p className="text-brand-100 flex items-center gap-2">
                                    <MapPin size={16} />
                                    {company.location || 'Location not specified'}
                                </p>
                            </div>
                        </div>
                        {!editing && (
                            <button
                                onClick={() => setEditing(true)}
                                className="bg-white text-brand-600 px-4 py-2 rounded-lg font-medium hover:bg-brand-50 transition-colors flex items-center gap-2"
                            >
                                <Edit2 size={18} /> Edit Profile
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                {editing ? (
                    // Edit Mode
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Company Name</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                            <textarea
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 outline-none h-32"
                                placeholder="Tell us about your company..."
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Website</label>
                                <input
                                    type="url"
                                    value={formData.website}
                                    onChange={e => setFormData({ ...formData, website: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 outline-none"
                                    placeholder="https://example.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Industry</label>
                                <input
                                    type="text"
                                    value={formData.industry}
                                    onChange={e => setFormData({ ...formData, industry: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 outline-none"
                                    placeholder="e.g., Technology, Healthcare"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Company Size</label>
                                <select
                                    value={formData.size}
                                    onChange={e => setFormData({ ...formData, size: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 outline-none"
                                >
                                    <option value="">Select size</option>
                                    <option value="1-10">1-10 employees</option>
                                    <option value="11-50">11-50 employees</option>
                                    <option value="51-200">51-200 employees</option>
                                    <option value="201-500">201-500 employees</option>
                                    <option value="501-1000">501-1000 employees</option>
                                    <option value="1000+">1000+ employees</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Location</label>
                                <input
                                    type="text"
                                    value={formData.location}
                                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 outline-none"
                                    placeholder="City, Country"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 outline-none"
                                    placeholder="contact@company.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Phone</label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 outline-none"
                                    placeholder="+1 (555) 123-4567"
                                />
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-4">
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="flex-1 bg-brand-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-brand-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                                {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                            <button
                                onClick={handleCancel}
                                className="flex-1 bg-slate-100 text-slate-600 px-6 py-3 rounded-xl font-medium hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
                            >
                                <X size={18} /> Cancel
                            </button>
                        </div>
                    </div>
                ) : (
                    // View Mode
                    <div className="space-y-8">
                        <div>
                            <h3 className="text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wide">About</h3>
                            <p className="text-slate-600 leading-relaxed">
                                {company.description || 'No description provided yet.'}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-8">
                            <div>
                                <h3 className="text-sm font-semibold text-slate-700 mb-4 uppercase tracking-wide">Company Info</h3>
                                <div className="space-y-3">
                                    {company.industry && (
                                        <div className="flex items-center gap-3 text-slate-600">
                                            <Building2 size={18} className="text-slate-400" />
                                            <span>{company.industry}</span>
                                        </div>
                                    )}
                                    {company.size && (
                                        <div className="flex items-center gap-3 text-slate-600">
                                            <Users size={18} className="text-slate-400" />
                                            <span>{company.size} employees</span>
                                        </div>
                                    )}
                                    {company.location && (
                                        <div className="flex items-center gap-3 text-slate-600">
                                            <MapPin size={18} className="text-slate-400" />
                                            <span>{company.location}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-semibold text-slate-700 mb-4 uppercase tracking-wide">Contact</h3>
                                <div className="space-y-3">
                                    {company.email && (
                                        <div className="flex items-center gap-3 text-slate-600">
                                            <Mail size={18} className="text-slate-400" />
                                            <a href={`mailto:${company.email}`} className="hover:text-brand-600 transition-colors">
                                                {company.email}
                                            </a>
                                        </div>
                                    )}
                                    {company.phone && (
                                        <div className="flex items-center gap-3 text-slate-600">
                                            <Phone size={18} className="text-slate-400" />
                                            <a href={`tel:${company.phone}`} className="hover:text-brand-600 transition-colors">
                                                {company.phone}
                                            </a>
                                        </div>
                                    )}
                                    {company.website && (
                                        <div className="flex items-center gap-3 text-slate-600">
                                            <Globe size={18} className="text-slate-400" />
                                            <a href={company.website} target="_blank" rel="noopener noreferrer" className="hover:text-brand-600 transition-colors">
                                                {company.website}
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CompanyProfile;
