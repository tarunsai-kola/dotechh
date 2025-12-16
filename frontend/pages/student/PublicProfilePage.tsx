import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MapPin, Briefcase, GraduationCap, Loader2, FileText, Mail } from 'lucide-react';
import api from '../../services';

import ChatComponent from '../../components/ChatComponent';

const PublicProfilePage = () => {
    const { id } = useParams<{ id: string }>();
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const isCompany = currentUser.role === 'company';
    const currentUserId = currentUser.user?.id || currentUser.id; // Adjust based on your auth object structure

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data } = await api.get(`/profile/${id}`);
                setProfile(data.profile);
            } catch (err) {
                console.error("Failed to fetch profile", err);
                setError('Profile not found');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProfile();
        }
    }, [id]);

    if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-brand-600" size={32} /></div>;
    if (error) return <div className="text-center p-12 text-red-500">{error}</div>;
    if (!profile) return null;

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6 pb-24">
            {/* Header Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <div className="flex flex-col md:flex-row gap-8 items-start">
                    <div className="w-32 h-32 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 text-4xl font-bold border-4 border-white shadow-lg">
                        {profile.photoUrl ? (
                            <img src={profile.photoUrl} alt={profile.displayName} className="w-full h-full rounded-full object-cover" />
                        ) : (
                            profile.displayName?.charAt(0) || profile.fullName?.charAt(0) || 'U'
                        )}
                    </div>

                    <div className="flex-1 w-full">
                        <h1 className="text-3xl font-bold text-gray-900">{profile.displayName || profile.fullName}</h1>
                        <p className="text-xl text-gray-600 mt-1">{profile.headline}</p>

                        <div className="flex flex-wrap gap-4 mt-4">
                            <div className="flex items-center gap-2 text-gray-500 text-sm">
                                <MapPin size={16} />
                                <span>{profile.location?.city || 'No City'}, {profile.location?.country || 'No Country'}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-500 text-sm">
                                <Mail size={16} />
                                <span>{profile.userId?.email}</span>
                            </div>
                        </div>

                        {profile.resumeUrl && (
                            <div className="mt-6">
                                <a
                                    href={profile.resumeUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-brand-50 text-brand-700 rounded-lg font-medium hover:bg-brand-100 transition-colors"
                                >
                                    <FileText size={18} />
                                    View Resume
                                </a>
                            </div>
                        )}
                    </div>
                </div>

                {/* About Section */}
                <div className="mt-8 pt-8 border-t border-gray-100">
                    <h3 className="text-lg font-semibold mb-3">About</h3>
                    <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                        {profile.about || profile.bio || "No description provided."}
                    </p>
                </div>
            </div>

            {/* Skills Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <h3 className="text-lg font-semibold mb-6">Skills</h3>
                <div className="flex flex-wrap gap-2">
                    {profile.skills?.map((skill: any, i: number) => (
                        <span key={i} className="px-3 py-1 bg-brand-50 text-brand-700 rounded-full text-sm font-medium">
                            {skill.name}
                        </span>
                    ))}
                    {(!profile.skills || profile.skills.length === 0) && (
                        <p className="text-gray-400 italic">No skills added.</p>
                    )}
                </div>
            </div>

            {/* Experience Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                    <Briefcase size={24} className="text-brand-600" />
                    Experience
                </h3>
                <div className="space-y-8">
                    {profile.experience?.map((exp: any, i: number) => (
                        <div key={i} className="relative pl-8 border-l-2 border-gray-100 last:border-0">
                            <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-brand-100 border-2 border-brand-600"></div>
                            <h4 className="text-lg font-semibold text-gray-900">{exp.position}</h4>
                            <div className="text-brand-600 font-medium mb-1">{exp.company}</div>
                            <div className="text-sm text-gray-500 mb-3">
                                {exp.startDate} - {exp.currentlyWorking ? 'Present' : exp.endDate} • {exp.location}
                            </div>
                            <p className="text-gray-600 text-sm whitespace-pre-wrap">{exp.description}</p>
                        </div>
                    ))}
                    {(!profile.experience || profile.experience.length === 0) && (
                        <p className="text-gray-400 italic">No experience added.</p>
                    )}
                </div>
            </div>

            {/* Education Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                    <GraduationCap size={24} className="text-brand-600" />
                    Education
                </h3>
                <div className="space-y-8">
                    {profile.education?.map((edu: any, i: number) => (
                        <div key={i} className="relative pl-8 border-l-2 border-gray-100 last:border-0">
                            <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-brand-100 border-2 border-brand-600"></div>
                            <h4 className="text-lg font-semibold text-gray-900">{edu.institution}</h4>
                            <div className="text-brand-600 font-medium mb-1">{edu.degree} in {edu.field}</div>
                            <div className="text-sm text-gray-500 mb-3">
                                {edu.startDate} - {edu.endDate}
                            </div>
                            {edu.grade && <div className="text-sm text-gray-600 mb-2">Grade: {edu.grade}</div>}
                            <p className="text-gray-600 text-sm whitespace-pre-wrap">{edu.description}</p>
                        </div>
                    ))}
                    {(!profile.education || profile.education.length === 0) && (
                        <p className="text-gray-400 italic">No education added.</p>
                    )}
                </div>
            </div>

            {/* Chat Component */}
            {isCompany && profile.userId && (
                <ChatComponent
                    currentUserId={currentUserId}
                    recipientId={profile.userId._id || profile.userId}
                    recipientName={profile.displayName || profile.fullName}
                />
            )}
        </div>
    );
};

export default PublicProfilePage;
