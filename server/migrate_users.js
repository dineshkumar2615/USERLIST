const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

const migrate = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB for migration');

        const result = await User.updateMany(
            { $or: [{ role: { $exists: false } }, { status: { $exists: false } }] },
            { $set: { role: 'User', status: 'Active' } }
        );

        console.log(`📊 Migration complete: Modified ${result.modifiedCount} users.`);
        process.exit(0);
    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
};

migrate();
