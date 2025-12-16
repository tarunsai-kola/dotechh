import React from 'react';

const AdminDashboard = () => {
    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <h3 className="text-xl font-semibold mb-2">User Management</h3>
                    <p className="text-slate-500">Manage Students, Companies, and HR accounts.</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <h3 className="text-xl font-semibold mb-2">Job Assignments</h3>
                    <p className="text-slate-500">Assign HR agents to job postings.</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <h3 className="text-xl font-semibold mb-2">Activity Logs</h3>
                    <p className="text-slate-500">View system-wide audit trails.</p>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
