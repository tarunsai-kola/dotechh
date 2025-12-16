const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config({ path: '../.env' });

const fixRole = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/doltec');
        console.log('Connected to MongoDB');

        const email = 'admin@gmail.com';
        const user = await User.findOne({ email });

        if (user) {
            user.role = 'admin';
            await user.save();
            console.log(`SUCCESS: Updated role for ${email} to 'admin'`);
        } else {
            console.log(`User ${email} not found`);
        }

        const email2 = 'admin2@gmail.com';
        const user2 = await User.findOne({ email: email2 });
        if (user2) {
            user2.role = 'admin';
            await user2.save();
            console.log(`SUCCESS: Updated role for ${email2} to 'admin'`);
        }

        const hrEmail = 'hr@gmail.com';
        const hrUser = await User.findOne({ email: hrEmail });
        if (hrUser) {
            hrUser.role = 'hr';
            await hrUser.save();
            console.log(`SUCCESS: Updated role for ${hrEmail} to 'hr'`);
        }

        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

fixRole();
