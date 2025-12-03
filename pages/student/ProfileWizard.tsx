
import React, { useState } from 'react';
import { Upload, FileText, Check, Loader2, User, Briefcase, Video, XCircle } from 'lucide-react';
import { updateProfile } from '../../api';

const ProfileWizard = () => {
  const [step, setStep] = useState(1);
  const [isUploading, setIsUploading] = useState(false);
  const [resumeName, setResumeName] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Form State
  const [fullName, setFullName] = useState('');
  const [headline, setHeadline] = useState('');
  const [bio, setBio] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [experience, setExperience] = useState<any[]>([]);

  // Simulation of resume parsing
  const handleResumeUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      setResumeName("alex_rivera_cv_2024.pdf");
      // Simulated parsing results
      setFullName('Alex Rivera');
      setHeadline('Full Stack Developer');
      setSkills(['React', 'Node.js', 'Python']);
      setStep(2); // Auto advance
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
            experience,
            completeness: 100 // Mock value
        });
        window.location.href='#/student/dashboard';
    } catch (err) {
        alert('Failed to save profile');
    } finally {
        setSaving(false);
    }
  };

  const steps = [
    { id: 1, title: 'Upload Resume', icon: FileText },
    { id: 2, title: 'Basic Info', icon: User },
    { id: 3, title: 'Experience', icon: Briefcase },
    { id: 4, title: 'Video Intro', icon: Video },
  ];

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
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all 
                  ${isActive ? 'border-brand-600 bg-white text-brand-600 shadow-lg shadow-brand-100' : ''}
                  ${isCompleted ? 'border-brand-600 bg-brand-600 text-white' : ''}
                  ${!isActive && !isCompleted ? 'border-gray-300 bg-white text-gray-300' : ''}
                  `}
                >
                  {isCompleted ? <Check size={20} /> : <s.icon size={20} />}
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
            <p className="text-slate-500 mb-8 max-w-md mx-auto">We'll parse your PDF or DOCX to auto-fill your profile details. Don't worry, you can edit them later.</p>
            
            <div 
              className="border-2 border-dashed border-brand-200 rounded-2xl p-12 bg-brand-50/50 hover:bg-brand-50 transition-colors cursor-pointer group"
              onClick={handleResumeUpload}
            >
              {isUploading ? (
                <div className="flex flex-col items-center">
                  <Loader2 className="animate-spin text-brand-600 mb-4" size={48} />
                  <p className="text-brand-700 font-medium">Analyzing document structure...</p>
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
            <button 
                onClick={() => setStep(2)}
                className="mt-8 text-slate-400 text-sm hover:text-slate-600"
            >
                Skip upload and fill manually
            </button>
          </div>
        )}

        {/* Step 2: Parsed Info */}
        {step === 2 && (
          <div>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-900">Review your details</h2>
                {resumeName && <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full flex items-center gap-1"><Check size={12}/> Auto-filled from {resumeName}</span>}
            </div>
            
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
                 <label className="block text-sm font-medium text-slate-700 mb-2">Detected Skills</label>
                 <div className="flex flex-wrap gap-2">
                    {skills.map(skill => (
                        <span key={skill} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm flex items-center gap-1">
                            {skill} <button type="button" onClick={() => setSkills(skills.filter(s => s !== skill))} className="hover:text-red-500"><XCircle size={14}/></button>
                        </span>
                    ))}
                    <button type="button" onClick={() => setSkills([...skills, "New Skill"])} className="px-3 py-1 border border-dashed border-slate-300 text-slate-500 rounded-full text-sm hover:border-brand-500 hover:text-brand-600">
                        + Add Skill
                    </button>
                 </div>
               </div>
               
               <div className="flex justify-end pt-4">
                  <button type="button" onClick={() => setStep(3)} className="bg-brand-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-brand-700">Next: Experience</button>
               </div>
            </form>
          </div>
        )}

        {/* Step 3: Experience (Simplified) */}
        {step === 3 && (
            <div>
                 <h2 className="text-2xl font-bold text-slate-900 mb-6">Experience & Education</h2>
                 <div className="space-y-4 mb-8">
                    {/* Placeholder Logic */}
                    <div className="p-4 border border-slate-200 rounded-lg flex justify-between items-start">
                        <div>
                            <h4 className="font-bold text-slate-900">Junior Developer</h4>
                            <p className="text-slate-600">TechStart Inc • 2021 - Present</p>
                        </div>
                        <button className="text-brand-600 text-sm font-medium">Edit</button>
                    </div>
                    <button className="w-full py-3 border-2 border-dashed border-slate-200 rounded-lg text-slate-500 font-medium hover:border-brand-500 hover:text-brand-600 transition-colors">
                        + Add Position
                    </button>
                 </div>
                 <div className="flex justify-between pt-4 border-t border-slate-100">
                    <button type="button" onClick={() => setStep(2)} className="text-slate-500 px-6 py-2 font-medium">Back</button>
                    <button type="button" onClick={() => setStep(4)} className="bg-brand-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-brand-700">Next: Video Intro</button>
               </div>
            </div>
        )}

        {/* Step 4: Video Intro */}
        {step === 4 && (
            <div className="text-center">
                <div className="w-20 h-20 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Video size={32} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Stand out with a video</h2>
                <p className="text-slate-500 mb-8 max-w-md mx-auto">Candidates with a 30-second intro video are 3x more likely to get an interview.</p>
                
                <div className="w-full max-w-md mx-auto aspect-video bg-slate-900 rounded-xl flex items-center justify-center text-white mb-8 relative overflow-hidden group cursor-pointer">
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors"></div>
                    <div className="z-10 flex flex-col items-center">
                        <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mb-2">
                             <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[18px] border-l-white border-b-[10px] border-b-transparent ml-1"></div>
                        </div>
                        <span className="font-medium">Record or Upload</span>
                    </div>
                </div>

                <div className="flex justify-between pt-4 border-t border-slate-100 max-w-md mx-auto">
                    <button type="button" onClick={() => setStep(3)} className="text-slate-500 px-6 py-2 font-medium">Back</button>
                    <button 
                        type="button" 
                        onClick={handleSaveProfile} 
                        className="bg-brand-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-brand-700 flex items-center gap-2"
                        disabled={saving}
                    >
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
