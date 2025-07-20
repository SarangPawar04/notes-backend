import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import noteRoutes from './routes/noteRoutes.js';

// Load environment variables from .env file
dotenv.config();

const app = express();

// Middleware to parse JSON
app.use(express.json());

// Routes
app.use('/api/notes', noteRoutes);

// Root route (optional)
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Connect to MongoDB and start the server
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('DB connection error:', err);
    process.exit(1);
  });
