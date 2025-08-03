import express from 'express';
import multer from 'multer';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import noteRoutes from './routes/noteRoutes.js';
import uploadRoute from './routes/pdfUploadRoute.js';
import pdfUploadRoute from './routes/pdfUploadRoute.js';
import dotenv from 'dotenv';

dotenv.config(); // Load env variables

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Ensure uploads folder exists
const UPLOADS_FOLDER = path.resolve('uploads');
if (!fs.existsSync(UPLOADS_FOLDER)) {
  fs.mkdirSync(UPLOADS_FOLDER);
}

// ✅ Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_FOLDER),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

// ✅ Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads')); // This exposes files publicly // Expose uploads
app.use('/api/notes', noteRoutes);
app.use('/api/upload', pdfUploadRoute);


// ✅ Test Route
app.get('/', (req, res) => {
  res.send('Server is running');
});


// ✅ MongoDB connection
const MONGODB_URI = process.env.MONGO_URI;
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ Connected to MongoDB');
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
})
.catch((error) => {
  console.error('❌ MongoDB connection error:', error);
});
