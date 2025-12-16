import React from 'react';

const HRDashboard = () => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">HR Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-xl font-semibold mb-2">My Assigned Jobs</h3>
          <p className="text-slate-500">View jobs assigned to you for verification.</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-xl font-semibold mb-2">Pending Applications</h3>
          <p className="text-slate-500">Review and shortlist candidates.</p>
        </div>
      </div>
    </div>
  );
};

export default HRDashboard;
