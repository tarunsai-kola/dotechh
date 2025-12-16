const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/doltec')
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });

async function setupIndexes() {
    try {
        const db = mongoose.connection.db;

        console.log('Setting up database indexes...\n');

        // Users collection - email unique index
        console.log('Creating index on users.email...');
        await db.collection('users').createIndex({ email: 1 }, { unique: true });
        console.log('✓ users.email index created\n');

        // Profiles collection - userId unique index
        console.log('Creating index on profiles.userId...');
        await db.collection('profiles').createIndex({ userId: 1 }, { unique: true });
        console.log('✓ profiles.userId index created\n');

        // Jobs collection - text index for search
        console.log('Creating text index on jobs...');
        await db.collection('jobs').createIndex(
            { titleLower: 'text', description: 'text', skills: 'text' }
        );
        console.log('✓ jobs text index created\n');

        // Jobs collection - companyId and titleLower compound index
        console.log('Creating index on jobs.companyId + titleLower...');
        await db.collection('jobs').createIndex({ companyId: 1, titleLower: 1 });
        console.log('✓ jobs compound index created\n');

        // Applications collection - unique index to prevent duplicate applications
        console.log('Creating unique index on applications (profileId + jobId)...');
        await db.collection('applications').createIndex(
            { profileId: 1, jobId: 1 },
            { unique: true }
        );
        console.log('✓ applications unique index created\n');

        console.log('All indexes created successfully!');
        console.log('\nListing all indexes:');

        // List all indexes
        const collections = ['users', 'profiles', 'jobs', 'applications'];
        for (const collName of collections) {
            const indexes = await db.collection(collName).indexes();
            console.log(`\n${collName}:`);
            indexes.forEach(idx => {
                console.log(`  -`, JSON.stringify(idx.key), idx.unique ? '(unique)' : '');
            });
        }

        process.exit(0);
    } catch (error) {
        console.error('Error setting up indexes:', error);
        process.exit(1);
    }
}

setupIndexes();
