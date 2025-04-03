// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');


// console.log(process.env.STRIPE_SECRET_KEY); // For debugging only!

// Import all router modules
const userRoutes = require('./routes/userRoutes');
const jobRoutes = require('./routes/jobRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const chatRoutes = require('./routes/chatRoutes');

const app = express();

app.use(express.json()); // Parse JSON bodies
app.use(cors());         // Enable CORS for all routes

connectDB(); // Connect to MongoDB

// Mount routers on their base paths
app.use('/api/users', userRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/chat', chatRoutes);

// Root endpoint for testing
app.get('/', (req, res) => res.send('API is running'));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
