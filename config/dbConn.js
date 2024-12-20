const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        // console.log('MongoDB URI:', process.env.DATABASE_URI);
        await mongoose.connect(process.env.DATABASE_URI, {
            // useNewUrlParser: true,
            // useUnifiedTopology: true
        });
        console.log('Database connected successfully');
    } catch (err) {
        console.error('Database connection error:', err);
    }
};

module.exports = connectDB;
