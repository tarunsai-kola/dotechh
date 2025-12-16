
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../.env') });

const User = require('../models/User');
const Profile = require('../models/Profile');
const Job = require('../models/Job');
const Application = require('../models/Application');

const resultsPath = path.join(__dirname, 'duplicates_found.json');

if (!fs.existsSync(resultsPath)) {
    console.error('duplicates_found.json not found. Run detect_duplicates.js first.');
    process.exit(1);
}

const results = JSON.parse(fs.readFileSync(resultsPath, 'utf8'));

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/doltec');
        console.log('MongoDB Connected');
    } catch (err) {
        console.error('Error connecting to DB:', err);
        process.exit(1);
    }
};

const cleanCollection = async (model, archiveCollectionName, groups, dateField = 'createdAt') => {
    if (!groups || groups.length === 0) return;

    const ArchiveModel = mongoose.model(archiveCollectionName, new mongoose.Schema({}, { strict: false }), archiveCollectionName);

    let totalArchived = 0;
    let totalDeleted = 0;

    for (const group of groups) {
        // Sort docs by date (oldest first)
        // If dateField is missing, fallback to _id (which has timestamp embedded)
        const sortedDocs = group.docs.sort((a, b) => {
            const dateA = a[dateField] ? new Date(a[dateField]) : new Date(parseInt(a._id.substring(0, 8), 16) * 1000);
            const dateB = b[dateField] ? new Date(b[dateField]) : new Date(parseInt(b._id.substring(0, 8), 16) * 1000);
            return dateA - dateB;
        });

        // Keep the first one (oldest), archive/delete the rest
        const [keeper, ...duplicates] = sortedDocs;
        const duplicateIds = duplicates.map(d => d._id);

        if (duplicateIds.length > 0) {
            // Fetch full documents to archive
            const fullDocs = await model.find({ _id: { $in: duplicateIds } });

            if (fullDocs.length > 0) {
                await ArchiveModel.insertMany(fullDocs);
                totalArchived += fullDocs.length;

                await model.deleteMany({ _id: { $in: duplicateIds } });
                totalDeleted += fullDocs.length;
            }
        }
    }
    console.log(`[${model.modelName}] Archived: ${totalArchived}, Deleted: ${totalDeleted}`);
};

const runCleanup = async () => {
    await connectDB();

    console.log('--- Cleaning Users ---');
    await cleanCollection(User, 'users_duplicates_archive', results.users, 'createdAt');

    console.log('--- Cleaning Profiles ---');
    await cleanCollection(Profile, 'profiles_duplicates_archive', results.profiles, '_id'); // Profile might not have createdAt

    console.log('--- Cleaning Jobs ---');
    await cleanCollection(Job, 'jobs_duplicates_archive', results.jobs, 'postedAt');

    console.log('--- Cleaning Applications ---');
    await cleanCollection(Application, 'applications_duplicates_archive', results.applications, 'appliedAt');

    console.log('Cleanup Complete');
    process.exit();
};

runCleanup();
