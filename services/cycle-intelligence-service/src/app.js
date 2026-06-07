import express from 'express';
import cors from 'cors';
import 'dotenv/config';

import cycleIntelligenceRoutes from './routes/cycleIntelligenceRoutes.js';
import userRoutes from './routes/userRoutes.js';
import externalRoutes from './routes/externalRoutes.js';
const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/cycle-intelligence', cycleIntelligenceRoutes);
app.use('/api/user', userRoutes);
app.use('/api/phases', externalRoutes)
// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

export default app;
