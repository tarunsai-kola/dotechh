import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Building, Globe, MapPin, Phone, FileText, ArrowRight, Loader2 } from 'lucide-react';
import { updateCompanyProfile, uploadCompanyLogo, getCompanyProfile } from '../../services';

const CompanyProfileWizard = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        website: '',
        phone: '',
        description: '',
        locations: '', // Comma separated for input
        domain: ''
    });

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const companyId = user.user?.companyId || user.companyId; // Handle both structures if needed

    useEffect(() => {
        if (!companyId) {
            // Fallback or error if no companyId
            return;
        }

        const loadData = async () => {
            try {
                const { data } = await getCompanyProfile(companyId);
                if (data) {
                    setFormData({
                        name: data.name || '',
                        website: data.website || '',
                        phone: data.phone || '',
                        description: data.description || '',
                        locations: data.locations ? data.locations.join(', ') : '',
                        domain: data.domain || ''
                    });
                    if (data.logoUrl) setLogoPreview(data.logoUrl);
                }
            } catch (error) {
                console.error("Failed to load company data", error);
            } finally {
                setFetching(false);
            }
        };
        loadData();
    }, [companyId]);

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setLogoFile(file);
            setLogoPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // 1. Upload Logo if changed
            if (logoFile && companyId) {
                const formData = new FormData();
                formData.append('logo', logoFile);
                await uploadCompanyLogo(companyId, formData);
            }

            // 2. Update Profile
            const locationsArray = formData.locations.split(',').map(l => l.trim()).filter(l => l);

            await updateCompanyProfile(companyId, {
                ...formData,
                locations: locationsArray
            });

            navigate('/company/dashboard');
        } catch (error) {
            console.error('Failed to update profile', error);
            // Show error toast/message
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-brand-600" size={40} /></div>;
    }

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-slate-900">Complete Your Company Profile</h1>
                    <p className="mt-2 text-slate-600">Tell us more about your company to attract the best talent.</p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
                    <form onSubmit={handleSubmit} className="space-y-8">

                        {/* Logo Upload */}
                        <div className="flex flex-col items-center justify-center">
                            <div className="relative group cursor-pointer">
                                <div className={`w-32 h-32 rounded-2xl flex items-center justify-center border-2 border-dashed transition-colors overflow-hidden ${logoPreview ? 'border-brand-200 bg-white' : 'border-slate-300 bg-slate-50 hover:bg-slate-100'}`}>
                                    {logoPreview ? (
                                        <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />
                                    ) : (
                                        <Upload className="text-slate-400" size={32} />
                                    )}
                                </div>
                                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleLogoChange} accept="image/*" />
                                <div className="absolute -bottom-8 left-0 right-0 text-center text-sm text-slate-500 font-medium">Upload Logo</div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                    <Building size={16} /> Company Name
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none transition-all"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                    <Globe size={16} /> Website
                                </label>
                                <input
                                    type="url"
                                    value={formData.website}
                                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none transition-all"
                                    placeholder="https://example.com"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                    <Phone size={16} /> Phone
                                </label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none transition-all"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                    <MapPin size={16} /> Locations
                                </label>
                                <input
                                    type="text"
                                    value={formData.locations}
                                    onChange={(e) => setFormData({ ...formData, locations: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none transition-all"
                                    placeholder="New York, London, Remote"
                                />
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                    <Building size={16} /> Industry / Domain
                                </label>
                                <input
                                    type="text"
                                    value={formData.domain}
                                    onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none transition-all"
                                    placeholder="e.g. Fintech, EdTech, Healthcare"
                                />
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                    <FileText size={16} /> Description
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none transition-all h-32 resize-none"
                                    placeholder="Tell us about your company mission and culture..."
                                />
                            </div>
                        </div>

                        <div className="pt-6 flex justify-end">
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-brand-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-brand-700 transition-all shadow-lg shadow-brand-200 flex items-center gap-2 disabled:opacity-70"
                            >
                                {loading ? <Loader2 className="animate-spin" /> : <>Continue to Dashboard <ArrowRight size={20} /></>}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default CompanyProfileWizard;
