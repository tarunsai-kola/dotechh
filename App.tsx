import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import StudentDashboard from './pages/student/StudentDashboard';
import ProfileWizard from './pages/student/ProfileWizard';
import JobSearch from './pages/student/JobSearch';
import CompanyDashboard from './pages/company/CompanyDashboard';
import ApplicantReview from './pages/company/ApplicantReview';
import { UserRole } from './types';

const App = () => {
  const [userRole, setUserRole] = useState<UserRole | null>(null);

  const handleLogin = (role: UserRole) => {
    setUserRole(role);
  };

  const handleLogout = () => {
    setUserRole(null);
  };

  return (
    <HashRouter>
      <Layout userRole={userRole} onLogout={handleLogout}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={!userRole ? <Landing /> : <Navigate to={userRole === UserRole.STUDENT ? "/student/dashboard" : "/company/dashboard"} />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />

          {/* Student Routes */}
          <Route 
            path="/student/dashboard" 
            element={userRole === UserRole.STUDENT ? <StudentDashboard /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/student/profile" 
            element={userRole === UserRole.STUDENT ? <ProfileWizard /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/student/jobs" 
            element={userRole === UserRole.STUDENT ? <JobSearch /> : <Navigate to="/login" />} 
          />
           <Route 
            path="/student/settings" 
            element={userRole === UserRole.STUDENT ? <div className="text-center text-slate-400 mt-20">Settings Placeholder</div> : <Navigate to="/login" />} 
          />

          {/* Company Routes */}
          <Route 
            path="/company/dashboard" 
            element={userRole === UserRole.COMPANY ? <CompanyDashboard /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/company/post-job" 
            element={userRole === UserRole.COMPANY ? <div className="text-center text-slate-400 mt-20">Post Job Form Placeholder</div> : <Navigate to="/login" />} 
          />
          <Route 
            path="/company/applicants" 
            element={userRole === UserRole.COMPANY ? <ApplicantReview /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/company/profile" 
            element={userRole === UserRole.COMPANY ? <div className="text-center text-slate-400 mt-20">Company Profile Placeholder</div> : <Navigate to="/login" />} 
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;