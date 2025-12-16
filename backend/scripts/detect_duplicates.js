
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

// Models (Assuming standard paths, adjust if needed)
const User = require('../models/User');
const Profile = require('../models/Profile');
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

const detectDuplicates = async () => {
  await connectDB();

  const results = {};

  console.log('--- Detecting User Duplicates (Email) ---');
  results.users = await User.aggregate([
    {
      $group: {
        _id: { $toLower: "$email" },
        count: { $sum: 1 },
        docs: { $push: { _id: "$_id", email: "$email", createdAt: "$createdAt" } }
      }
    },
    { $match: { count: { $gt: 1 } } }
  ]);
  console.log(`Found ${results.users.length} groups of duplicate users.`);

  console.log('--- Detecting Profile Duplicates (UserId) ---');
  results.profiles = await Profile.aggregate([
    {
      $group: {
        _id: "$userId",
        count: { $sum: 1 },
        docs: { $push: { _id: "$_id", userId: "$userId", fullName: "$fullName" } } // Profile might not have createdAt, using _id for sorting later
      }
    },
    { $match: { count: { $gt: 1 } } }
  ]);
  console.log(`Found ${results.profiles.length} groups of duplicate profiles.`);

  console.log('--- Detecting Job Duplicates (CompanyId + Title) ---');
  results.jobs = await Job.aggregate([
    {
      $addFields: { titleLower: { $toLower: "$title" } }
    },
    {
      $group: {
        _id: { companyId: "$companyId", title: "$titleLower" },
        count: { $sum: 1 },
        docs: { $push: { _id: "$_id", title: "$title", companyId: "$companyId", postedAt: "$postedAt" } }
      }
    },
    { $match: { count: { $gt: 1 } } }
  ]);
  console.log(`Found ${results.jobs.length} groups of duplicate jobs.`);

  console.log('--- Detecting Application Duplicates (ProfileId + JobId) ---');
  results.applications = await Application.aggregate([
    {
      $group: {
        _id: { candidateId: "$candidateId", jobId: "$jobId" },
        count: { $sum: 1 },
        docs: { $push: { _id: "$_id", candidateId: "$candidateId", jobId: "$jobId", appliedAt: "$appliedAt" } }
      }
    },
    { $match: { count: { $gt: 1 } } }
  ]);
  console.log(`Found ${results.applications.length} groups of duplicate applications.`);

  // Save results to file for other scripts to use
  fs.writeFileSync(path.join(__dirname, 'duplicates_found.json'), JSON.stringify(results, null, 2));
  console.log('Results saved to duplicates_found.json');

  process.exit();
};

detectDuplicates();
