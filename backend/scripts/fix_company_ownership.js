require('dotenv').config();
const mongoose = require('mongoose');
const Company = require('../models/Company');
const User = require('../models/User');

async function fixCompanyOwnership() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/doltec');
        console.log('Connected to MongoDB');

        // Find all companies with missing createdByUserId
        const companies = await Company.find({
            $or: [
                { createdByUserId: null },
                { createdByUserId: { $exists: false } }
            ]
        });

        console.log(`Found ${companies.length} companies with missing ownership`);

        for (const company of companies) {
            console.log(`\nFixing company: ${company.name} (${company._id})`);

            // Find the user associated with this company
            const user = await User.findOne({ companyId: company._id });

            if (user) {
                console.log(`  Found user: ${user.email} (${user._id})`);

                // Update company
                company.createdByUserId = user._id;

                // Add user to team if not already there
                const existingTeamMember = company.team.find(m => m.userId && m.userId.toString() === user._id.toString());
                if (!existingTeamMember) {
                    company.team.push({ userId: user._id, role: 'admin' });
                    console.log(`  Added user to team as admin`);
                }

                await company.save();
                console.log(`  ✓ Company updated successfully`);
            } else {
                console.log(`  ⚠ No user found for this company`);
            }
        }

        console.log('\n✓ All companies fixed!');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

fixCompanyOwnership();
