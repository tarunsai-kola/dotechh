const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../.env') });

const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/doltec');
        console.log('MongoDB Connected');
    } catch (err) {
        console.error('Error connecting to DB:', err);
        process.exit(1);
    }
};

const createIndexes = async () => {
    await connectDB();

    try {
        console.log('Creating User Index...');
        await User.collection.createIndex({ email: 1 }, { unique: true });
        console.log('User Index Created');

        console.log('Creating Job Indexes...');
        try { await Job.collection.dropIndexes(); } catch (e) { console.log('No existing Job indexes to drop'); }
        await Job.collection.createIndex({ companyId: 1, titleLower: 1 }, { unique: false });
        await Job.collection.createIndex({ titleLower: "text", description: "text", skills: "text" });
        console.log('Job Indexes Created');

        console.log('Creating Application Index...');
        try { await Application.collection.dropIndexes(); } catch (e) { console.log('No existing Application indexes to drop'); }
        await Application.collection.createIndex({ profileId: 1, jobId: 1 }, { unique: true });
        console.log('Application Index Created');

    } catch (err) {
        console.error('Error creating indexes:', err);
    }

    process.exit();
};

createIndexes();
