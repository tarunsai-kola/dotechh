
const fs = require('fs');
const path = require('path');

const resultsPath = path.join(__dirname, 'duplicates_found.json');

if (!fs.existsSync(resultsPath)) {
    console.error('duplicates_found.json not found. Run detect_duplicates.js first.');
    process.exit(1);
}

const results = JSON.parse(fs.readFileSync(resultsPath, 'utf8'));

const jsonToCsv = (items, fields) => {
    if (items.length === 0) return '';
    const header = fields.join(',') + '\n';
    const rows = items.map(item => {
        return fields.map(field => {
            let val = item[field] || '';
            if (typeof val === 'object') val = JSON.stringify(val).replace(/"/g, '""'); // Escape quotes
            return `"${val}"`;
        }).join(',');
    }).join('\n');
    return header + rows;
};

const exportGroup = (groupName, data, fields) => {
    const flattened = [];
    data.forEach(group => {
        group.docs.forEach(doc => {
            flattened.push({
                groupKey: JSON.stringify(group._id),
                duplicateCount: group.count,
                ...doc
            });
        });
    });

    const csv = jsonToCsv(flattened, ['groupKey', 'duplicateCount', ...fields]);
    fs.writeFileSync(path.join(__dirname, `duplicates_${groupName}.csv`), csv);
    console.log(`Exported duplicates_${groupName}.csv`);
};

// Export Users
if (results.users) {
    exportGroup('users_by_email', results.users, ['_id', 'email', 'createdAt']);
}

// Export Profiles
if (results.profiles) {
    exportGroup('profiles_by_userId', results.profiles, ['_id', 'userId', 'fullName']);
}

// Export Jobs
if (results.jobs) {
    exportGroup('jobs_by_company_title', results.jobs, ['_id', 'title', 'companyId', 'postedAt']);
}

// Export Applications
if (results.applications) {
    exportGroup('applications_by_profile_job', results.applications, ['_id', 'candidateId', 'jobId', 'appliedAt']);
}
