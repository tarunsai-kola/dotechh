import React, { useState } from 'react';
import { FileText, User, Briefcase, GraduationCap, Loader2, Upload, CheckCircle } from 'lucide-react';
import { updateProfile } from '../../services';
import SkillInput from '../../components/SkillInput';
import ExperienceSection from '../../components/ExperienceSection';
import EducationSection from '../../components/EducationSection';

const ProfileWizard = () => {
  const [step, setStep] = useState(1);
  const [isUploading, setIsUploading] = useState(false);
  const [resumeName, setResumeName] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form State
  const [fullName, setFullName] = useState('');
  const [headline, setHeadline] = useState('');
  const [bio, setBio] = useState('');
  const [skills, setSkills] = useState<{ name: string, slug: string }[]>([]);

  React.useEffect(() => {
    const loadProfile = async () => {
      try {
        const { fetchMyProfile } = await import('../../services');
        const data = await fetchMyProfile();
        if (data.profile) {
          // Restore state from profile
          setFullName(data.profile.fullName || '');
          setHeadline(data.profile.headline || '');
          setBio(data.profile.bio || '');
          setSkills(data.profile.skills || []);
          setStep(data.profile.onboardingStep || 1);

          if (data.profile.resumeUrl) {
            // Extract filename from URL
            const fileName = data.profile.resumeUrl.split('/').pop();
            setResumeName(fileName || null);
          }

          // If profile is already complete, redirect (optional, maybe check a flag)
          if (data.profile.profileCompleteness >= 100) {
            // window.location.href = '#/student/dashboard';
          }
        }
      } catch (err) {
        console.error("Failed to load profile", err);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const saveProgress = async (nextStep: number, dataOverride?: any) => {
    setSaving(true);
    try {
      // Save current state and update step
      const payload = {
        fullName,
        headline,
        bio,
        skills,
        resumeUrl: resumeName ? `/uploads/${resumeName}` : undefined,
        onboardingStep: nextStep,
        ...dataOverride
      };

      await updateProfile(payload);
      setStep(nextStep);
    } catch (err: any) {
      console.error("Failed to save progress", err);
      alert('Failed to save progress. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleResumeUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      const mockResumeName = "alex_rivera_cv_2024.pdf";
      setResumeName(mockResumeName);

      const newData = {
        fullName: 'Alex Rivera',
        headline: 'Full Stack Developer',
        skills: [
          { name: 'React', slug: 'react' },
          { name: 'Node.js', slug: 'node-js' },
          { name: 'Python', slug: 'python' }
        ],
        resumeUrl: `/uploads/${mockResumeName}`
      };

      setFullName(newData.fullName);
      setHeadline(newData.headline);
      setSkills(newData.skills);

      // Auto-save after upload simulation with new data
      saveProgress(2, newData);
    }, 1500);
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      await updateProfile({
        fullName,
        headline,
        bio,
        skills,
        resumeUrl: resumeName ? `/uploads/${resumeName}` : undefined,
        onboardingStep: 4 // Ensure we stay on last step or mark complete
      });
      alert('Profile saved successfully!');
      window.location.href = '#/student/dashboard';
    } catch (err: any) {
      alert('Failed to save: ' + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  const steps = [
    { id: 1, title: 'Upload Resume', icon: FileText },
    { id: 2, title: 'Basic Info', icon: User },
    { id: 3, title: 'Experience', icon: Briefcase },
    { id: 4, title: 'Education', icon: GraduationCap },
  ];

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen"><Loader2 className="animate-spin text-brand-600" size={48} /></div>;
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Stepper */}
      <div className="mb-12">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200 -z-10"></div>
          {steps.map((s) => {
            const isActive = s.id === step;
            const isCompleted = s.id < step;
            return (
              <div key={s.id} className="flex flex-col items-center bg-gray-50 px-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all 
                  ${isActive ? 'border-brand-600 bg-white text-brand-600 shadow-lg shadow-brand-100' : ''}
                  ${isCompleted ? 'border-brand-600 bg-brand-600 text-white' : ''}
                  ${!isActive && !isCompleted ? 'border-gray-300 bg-white text-gray-300' : ''}`}>
                  {isCompleted ? <CheckCircle size={20} /> : <s.icon size={20} />}
                </div>
                <span className={`text-xs mt-2 font-medium ${isActive ? 'text-brand-600' : 'text-gray-500'}`}>{s.title}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        {/* Step 1: Resume Upload */}
        {step === 1 && (
          <div className="text-center py-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Let's start with your resume</h2>
            <p className="text-slate-500 mb-8 max-w-md mx-auto">We'll parse your PDF or DOCX to auto-fill your profile details.</p>
            <div className="border-2 border-dashed border-brand-200 rounded-2xl p-12 bg-brand-50/50 hover:bg-brand-50 transition-colors cursor-pointer group" onClick={handleResumeUpload}>
              {isUploading ? (
                <div className="flex flex-col items-center">
                  <Loader2 className="animate-spin text-brand-600 mb-4" size={48} />
                  <p className="text-brand-700 font-medium">Analyzing document...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Upload size={32} />
                  </div>
                  <p className="text-slate-900 font-semibold mb-1">Click to upload or drag and drop</p>
                  <p className="text-slate-500 text-sm">PDF, DOCX up to 10MB</p>
                </div>
              )}
            </div>
            <button onClick={() => saveProgress(2)} className="mt-8 text-slate-400 text-sm hover:text-slate-600">Skip upload and fill manually</button>
          </div>
        )}

        {/* Step 2: Basic Info */}
        {step === 2 && (
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Review your details</h2>
            <form className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                  <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Headline</label>
                  <input type="text" value={headline} onChange={e => setHeadline(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500 outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Bio / Summary</label>
                <textarea rows={4} value={bio} onChange={e => setBio(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Skills</label>
                <SkillInput initialSkills={skills} onSkillsChange={setSkills} persist={false} />
              </div>
              <div className="flex justify-end pt-4">
                <button type="button" onClick={() => saveProgress(3)} disabled={saving} className="bg-brand-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-brand-700 flex items-center gap-2">
                  {saving && <Loader2 className="animate-spin" size={16} />}
                  Next: Experience
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Step 3: Experience */}
        {step === 3 && (
          <div>
            <ExperienceSection />
            <div className="flex justify-between pt-8 border-t border-slate-100 mt-8">
              <button type="button" onClick={() => saveProgress(2)} disabled={saving} className="text-slate-500 px-6 py-2 font-medium">Back</button>
              <button type="button" onClick={() => saveProgress(4)} disabled={saving} className="bg-brand-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-brand-700 flex items-center gap-2">
                {saving && <Loader2 className="animate-spin" size={16} />}
                Next: Education
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Education */}
        {step === 4 && (
          <div>
            <EducationSection />
            <div className="flex justify-between pt-8 border-t border-slate-100 mt-8">
              <button type="button" onClick={() => saveProgress(3)} disabled={saving} className="text-slate-500 px-6 py-2 font-medium">Back</button>
              <button type="button" onClick={handleSaveProfile} disabled={saving} className="bg-brand-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-brand-700 flex items-center gap-2">
                {saving && <Loader2 className="animate-spin" size={16} />}
                Finish Profile
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileWizard;
