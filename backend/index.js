
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Routes
const authRoutes = require('./routes/auth');
const jobRoutes = require('./routes/jobs');
const profileRoutes = require('./routes/profile');
const applicationRoutes = require('./routes/applications');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');

// Middleware
app.use(helmet());
app.use(cors({
  origin: true, // Allow all origins for now (or specify specific ones)
  credentials: true // Important for Cookies
}));
app.use(express.json({ limit: '10kb' }));
app.use(require('cookie-parser')()); // Parse cookies
app.use(mongoSanitize());
app.use(xss());
app.use('/uploads', express.static('uploads'));

// Global Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs
  message: 'Too many requests from this IP, please try again later'
});
app.use('/api', limiter);

// Database Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/doltec')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Route Middleware
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/companies', require('./routes/companies'));
app.use('/api/skills', require('./routes/skills'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/notifications', require('./routes/notifications'));

// Health Check
app.get('/', (req, res) => {
  res.send('Doltec API is running');
});

const http = require('http');
const { initSocket } = require('./socket');

const server = http.createServer(app);

// Only initialize Socket.io in non-production environments
// Vercel serverless doesn't support WebSocket connections
if (process.env.NODE_ENV !== 'production') {
  initSocket(server);
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export for Vercel serverless function
module.exports = app;
