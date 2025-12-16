import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import About from './pages/About';
import Services from './pages/Services';
import Contact from './pages/Contact';
import Pricing from './pages/Pricing';
import PrivacyPolicy from './pages/PrivacyPolicy';
import RefundPolicy from './pages/RefundPolicy';
import TermsAndConditions from './pages/TermsAndConditions';
import StudentDashboard from './pages/student/StudentDashboard';
import ProfileWizard from './pages/student/ProfileWizard';
import ProfilePage from './pages/student/ProfilePage';
import PublicProfilePage from './pages/student/PublicProfilePage';
import JobSearch from './pages/student/JobSearch';
import MyApplications from './pages/student/MyApplications';
import CompanyDashboard from './pages/company/CompanyDashboard';
import ApplicantReview from './pages/company/ApplicantReview';
import CompanyProfileWizard from './pages/company/CompanyProfileWizard';
import JobCreate from './pages/company/JobCreate';
import JobManage from './pages/company/JobManage';
import CompanyProfile from './pages/company/CompanyProfile';
import AdminDashboard from './pages/AdminDashboard';
import HRDashboard from './pages/HRDashboard';
import { UserRole } from './types';

const App = () => {
  const [userRole, setUserRole] = useState<UserRole | null>(() => {
    const user = localStorage.getItem('user');
    console.log('App Init - LocalStorage User:', user);
    if (user) {
      try {
        const parsed = JSON.parse(user);
        console.log('App Init - Parsed Role:', parsed.role);
        return parsed.role;
      } catch (e) {
        console.error('App Init - JSON Parse Error:', e);
        return null;
      }
    }
    return null;
  });

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
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/refund" element={<RefundPolicy />} />
          <Route path="/terms" element={<TermsAndConditions />} />

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
            path="/student/my-profile"
            element={userRole === UserRole.STUDENT ? <ProfilePage /> : <Navigate to="/login" />}
          />
          <Route
            path="/student/jobs"
            element={userRole === UserRole.STUDENT ? <JobSearch /> : <Navigate to="/login" />}
          />
          <Route
            path="/student/applications"
            element={userRole === UserRole.STUDENT ? <MyApplications /> : <Navigate to="/login" />}
          />

          {/* Company Routes */}
          <Route
            path="/company/dashboard"
            element={userRole === UserRole.COMPANY ? <CompanyDashboard /> : <Navigate to="/login" />}
          />
          <Route
            path="/company/wizard"
            element={userRole === UserRole.COMPANY ? <CompanyProfileWizard /> : <Navigate to="/login" />}
          />
          <Route
            path="/company/post-job"
            element={userRole === UserRole.COMPANY ? <JobCreate /> : <Navigate to="/login" />}
          />
          <Route
            path="/company/jobs/:jobId/manage"
            element={userRole === UserRole.COMPANY ? <JobManage /> : <Navigate to="/login" />}
          />
          <Route
            path="/company/applicants"
            element={userRole === UserRole.COMPANY ? <ApplicantReview /> : <Navigate to="/login" />}
          />
          <Route
            path="/company/profile"
            element={userRole === UserRole.COMPANY ? <CompanyProfile /> : <Navigate to="/login" />}
          />

          {/* Shared/Public Profile Route (Accessible to Company) */}
          <Route
            path="/student/profile/:id"
            element={userRole === UserRole.COMPANY ? <PublicProfilePage /> : <Navigate to="/login" />}
          />

          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={userRole === UserRole.ADMIN ? <AdminDashboard /> : <Navigate to="/login" />}
          />

          {/* HR Routes */}
          <Route
            path="/hr/dashboard"
            element={userRole === UserRole.HR ? <HRDashboard /> : <Navigate to="/login" />}
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;