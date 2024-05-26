const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const app = express();

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://cooklet:cooklet123@cooklet.ijzhinl.mongodb.net/cooklet?retryWrites=true&w=majority');
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('Error connecting to MongoDB', err);
        process.exit(1); // Exit the process with failure
    }
};

module.exports = connectDB;
