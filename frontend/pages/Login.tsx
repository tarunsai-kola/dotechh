import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserRole } from '../types';
import { Briefcase, GraduationCap, Loader2, Shield, Users } from 'lucide-react';
import { login, register, registerCompany, fetchMyProfile } from '../services';

interface LoginProps {
  onLogin: (role: UserRole) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = React.useState<UserRole>(UserRole.STUDENT);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let data;
      if (isLoginMode) {
        data = await login(email, password);
      } else {
        if (activeTab === UserRole.COMPANY) {
          data = await registerCompany(email, password, companyName, phone);
        } else {
          data = await register(email, password, activeTab);
        }
      }

      onLogin(data.role as UserRole);

      if (data.role === UserRole.STUDENT) {
        if (!isLoginMode && data.profileExists === false) {
          navigate('/student/profile');
        } else if (isLoginMode) {
          try {
            await fetchMyProfile();
            navigate('/student/dashboard');
          } catch (err) {
            navigate('/student/profile');
          }
        } else {
          navigate('/student/dashboard');
        }
      } else if (data.role === UserRole.ADMIN) {
        navigate('/admin/dashboard');
      } else if (data.role === UserRole.HR) {
        navigate('/hr/dashboard');
      } else if (data.role === UserRole.COMPANY) {
        if (!isLoginMode) {
          navigate('/company/wizard');
        } else {
          navigate('/company/dashboard');
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-900">{isLoginMode ? 'Welcome Back' : 'Join Doltec'}</h2>
          <p className="text-slate-500 mt-2">{isLoginMode ? 'Sign in to your account' : 'Create your account today'}</p>
        </div>

        {/* Role Toggles */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <button
            type="button"
            onClick={() => setActiveTab(UserRole.STUDENT)}
            className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${activeTab === UserRole.STUDENT
              ? 'border-brand-600 bg-brand-50 text-brand-700'
              : 'border-slate-100 hover:border-slate-200 text-slate-500'
              }`}
          >
            <GraduationCap size={28} className="mb-2" />
            <span className="font-semibold text-sm">Student</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab(UserRole.COMPANY)}
            className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${activeTab === UserRole.COMPANY
              ? 'border-brand-600 bg-brand-50 text-brand-700'
              : 'border-slate-100 hover:border-slate-200 text-slate-500'
              }`}
          >
            <Briefcase size={28} className="mb-2" />
            <span className="font-semibold text-sm">Company</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab(UserRole.HR)}
            className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${activeTab === UserRole.HR
              ? 'border-brand-600 bg-brand-50 text-brand-700'
              : 'border-slate-100 hover:border-slate-200 text-slate-500'
              }`}
          >
            <Users size={28} className="mb-2" />
            <span className="font-semibold text-sm">HR</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab(UserRole.ADMIN)}
            className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${activeTab === UserRole.ADMIN
              ? 'border-brand-600 bg-brand-50 text-brand-700'
              : 'border-slate-100 hover:border-slate-200 text-slate-500'
              }`}
          >
            <Shield size={28} className="mb-2" />
            <span className="font-semibold text-sm">Admin</span>
          </button>
        </div>

        {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLoginMode && activeTab === UserRole.COMPANY && (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Company Name</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
                  placeholder="Acme Corp"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Contact Phone</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
                  placeholder="+91 9876543210"
                  required
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-600 text-white py-3 rounded-lg font-semibold hover:bg-brand-700 transition-colors shadow-lg shadow-brand-200 disabled:opacity-70 flex justify-center items-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" /> : (isLoginMode ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          {isLoginMode ? "Don't have an account?" : "Already have an account?"}
          <span
            onClick={() => setIsLoginMode(!isLoginMode)}
            className="text-brand-600 font-medium cursor-pointer hover:underline ml-1"
          >
            {isLoginMode ? 'Sign up for free' : 'Login here'}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
