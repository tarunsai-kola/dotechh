import React, { useEffect, useState } from 'react';
import { MapPin, Briefcase, GraduationCap, Edit2, Loader2, Plus } from 'lucide-react';
import { fetchMyProfile, updateProfile } from '../../services';
import AvatarUpload from '../../components/AvatarUpload';
import ExperienceSection from '../../components/ExperienceSection';
import EducationSection from '../../components/EducationSection';
import SkillInput from '../../components/SkillInput';

const ProfilePage = () => {
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);

    // Edit Form State
    const [displayName, setDisplayName] = useState('');
    const [headline, setHeadline] = useState('');
    const [about, setAbout] = useState('');
    const [location, setLocation] = useState({ city: '', country: '' });
    const [skills, setSkills] = useState<any[]>([]);

    const loadProfile = async () => {
        try {
            const data = await fetchMyProfile();
            setProfile(data.profile);

            // Init form state
            setDisplayName(data.profile.displayName);
            setHeadline(data.profile.headline || '');
            setAbout(data.profile.about || '');
            setLocation(data.profile.location || { city: '', country: '' });
            setSkills(data.profile.skills || []);
        } catch (err: any) {
            if (err.response?.status === 404) {
                window.location.href = '#/student/profile'; // Redirect to wizard
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProfile();
    }, []);

    const handleAvatarUpdate = (newUrl: string) => {
        setProfile((prev: any) => ({ ...prev, avatarUrl: newUrl }));
    };

    const handleSave = async () => {
        try {
            await updateProfile({
                displayName,
                headline,
                about,
                location,
                skills
            });
            setEditing(false);
            loadProfile(); // Refresh
        } catch (err) {
            alert('Failed to save profile');
        }
    };

    if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin" /></div>;
    if (!profile) return null;

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            {/* Header Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 relative">
                <div className="absolute top-6 right-6">
                    {!editing ? (
                        <button
                            onClick={() => setEditing(true)}
                            className="p-2 text-gray-400 hover:text-brand-600 hover:bg-brand-50 rounded-full transition-colors"
                        >
                            <Edit2 size={20} />
                        </button>
                    ) : (
                        <div className="flex gap-2">
                            <button onClick={() => setEditing(false)} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                            <button onClick={handleSave} className="px-4 py-2 text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 rounded-lg">Save Changes</button>
                        </div>
                    )}
                </div>

                <div className="flex flex-col md:flex-row gap-8 items-start">
                    <AvatarUpload
                        currentAvatarUrl={profile.avatarUrl}
                        onUploadSuccess={handleAvatarUpdate}
                    />

                    <div className="flex-1 w-full">
                        {editing ? (
                            <div className="space-y-4 max-w-lg">
                                <input
                                    value={displayName}
                                    onChange={e => setDisplayName(e.target.value)}
                                    className="text-2xl font-bold w-full border-b border-gray-300 focus:border-brand-500 outline-none py-1"
                                    placeholder="Full Name"
                                />
                                <input
                                    value={headline}
                                    onChange={e => setHeadline(e.target.value)}
                                    className="text-lg text-gray-600 w-full border-b border-gray-300 focus:border-brand-500 outline-none py-1"
                                    placeholder="Headline (e.g. Student at XYZ)"
                                />
                                <div className="flex gap-2">
                                    <input
                                        value={location.city}
                                        onChange={e => setLocation({ ...location, city: e.target.value })}
                                        className="text-sm text-gray-500 w-1/2 border-b border-gray-300 focus:border-brand-500 outline-none py-1"
                                        placeholder="City"
                                    />
                                    <input
                                        value={location.country}
                                        onChange={e => setLocation({ ...location, country: e.target.value })}
                                        className="text-sm text-gray-500 w-1/2 border-b border-gray-300 focus:border-brand-500 outline-none py-1"
                                        placeholder="Country"
                                    />
                                </div>
                            </div>
                        ) : (
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">{profile.displayName}</h1>
                                <p className="text-xl text-gray-600 mt-1">{profile.headline}</p>
                                <div className="flex items-center gap-2 text-gray-500 mt-2 text-sm">
                                    <MapPin size={16} />
                                    <span>{profile.location?.city || 'No City'}, {profile.location?.country || 'No Country'}</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* About Section */}
                <div className="mt-8 pt-8 border-t border-gray-100">
                    <h3 className="text-lg font-semibold mb-3">About</h3>
                    {editing ? (
                        <textarea
                            value={about}
                            onChange={e => setAbout(e.target.value)}
                            className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                            placeholder="Tell us about yourself..."
                        />
                    ) : (
                        <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                            {profile.about || "No description provided."}
                        </p>
                    )}
                </div>
            </div>

            {/* Skills Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <h3 className="text-lg font-semibold mb-6">Skills</h3>
                {editing ? (
                    <SkillInput
                        initialSkills={skills}
                        onSkillsChange={setSkills}
                        persist={false} // We save all at once
                    />
                ) : (
                    <div className="flex flex-wrap gap-2">
                        {profile.skills?.map((skill: any, i: number) => (
                            <span key={i} className="px-3 py-1 bg-brand-50 text-brand-700 rounded-full text-sm font-medium">
                                {skill.name}
                            </span>
                        ))}
                        {(!profile.skills || profile.skills.length === 0) && (
                            <p className="text-gray-400 italic">No skills added yet.</p>
                        )}
                    </div>
                )}
            </div>

            {/* Experience Section - Always editable via its own component */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <h3 className="text-lg font-semibold mb-6">Experience</h3>
                <ExperienceSection />
            </div>

            {/* Education Section - Always editable via its own component */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                    <GraduationCap size={24} className="text-brand-600" />
                    Education
                </h3>
                <EducationSection />
            </div>
        </div>
    );
};

export default ProfilePage;
