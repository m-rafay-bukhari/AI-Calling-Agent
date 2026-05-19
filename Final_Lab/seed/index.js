const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../../.env') });

// Import Models
const User = require('../../AI_calling_agent_complete/models/User');
const Product = require('../../AI_calling_agent_complete/models/Product');
const Script = require('../../AI_calling_agent_complete/models/Script');

// Import Seed Data
const usersData = require('./usersSeed');
const packagesData = require('./packagesSeed');
const scriptsData = require('./scriptsSeed');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        process.exit(1);
    }
};

const seedData = async () => {
    try {
        await connectDB();

        // 1. Clean Collections (Optional but recommended for clean seed)
        console.log('Cleaning existing data...');
        await User.deleteMany({ role: { $ne: 'admin' } }); // Keep admins or wipe all? Let's wipe all for fresh start.
        await User.deleteMany({});
        await Product.deleteMany({});
        await Script.deleteMany({});

        // 2. Insert Packages (Products)
        console.log('Seeding AI Packages...');
        const createdPackages = await Product.insertMany(packagesData);
        console.log(`${createdPackages.length} packages seeded.`);

        // 3. Insert Users
        console.log('Seeding Users...');
        // We use create instead of insertMany to trigger the password hashing hook in the model
        const createdUsers = [];
        for (const user of usersData) {
            const newUser = await User.create(user);
            createdUsers.push(newUser);
        }
        console.log(`${createdUsers.length} users seeded.`);

        // 4. Insert Scripts
        console.log('Seeding Script History...');
        const scriptsToInsert = [];
        const customers = createdUsers.filter(u => u.role === 'customer');

        scriptsData.forEach((script, index) => {
            // Assign random user to each script
            const randomUser = customers[index % customers.length];
            scriptsToInsert.push({
                ...script,
                user: randomUser._id,
                createdAt: new Date(Date.now() - Math.floor(Math.random() * 1000000000)) // Random past dates
            });
        });

        // Add more random scripts to make dashboard look busy
        for (let i = 0; i < 20; i++) {
            const randomUser = customers[Math.floor(Math.random() * customers.length)];
            const baseScript = scriptsData[Math.floor(Math.random() * scriptsData.length)];
            scriptsToInsert.push({
                ...baseScript,
                businessName: `${baseScript.businessName} ${i}`,
                user: randomUser._id,
                createdAt: new Date(Date.now() - Math.floor(Math.random() * 500000000))
            });
        }

        await Script.insertMany(scriptsToInsert);
        console.log(`${scriptsToInsert.length} script generations seeded.`);

        // 5. Setup Favorites (Randomly)
        console.log('Setting up User Favorites...');
        for (const user of customers) {
            const randomPackages = createdPackages
                .sort(() => 0.5 - Math.random())
                .slice(0, 2)
                .map(p => p._id);
            
            user.favorites = randomPackages;
            await user.save();
        }

        console.log('Data Seeding Completed Successfully! 🚀');
        process.exit();
    } catch (error) {
        console.error('Seeding Error:', error);
        process.exit(1);
    }
};

// Check if cleanup only was requested
if (process.argv[2] === '-d') {
    // Logic for deletion only could go here
} else {
    seedData();
}
