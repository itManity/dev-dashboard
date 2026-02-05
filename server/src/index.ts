import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

import express from 'express';
import session from 'express-session';
import passport from 'passport';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import { configurePassport } from './config/passport';
import { connectDatabase } from './config/database';
import authRoutes from './routes/auth';
import apiRoutes from './routes/api';

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(helmet({ contentSecurityPolicy: false }));
app.use(morgan('dev'));
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session
app.use(session({
  secret: process.env.SESSION_SECRET || 'dragon-nest-admin-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  },
}));

// Passport
configurePassport();
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/auth', authRoutes);
app.use('/api', apiRoutes);

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'Dragon Nest Admin API' });
});

// Start server
async function start() {
  try {
    await connectDatabase();
    console.log('[DB] Connected to Dragon Nest database');
  } catch (err) {
    console.warn('[DB] Database connection failed - running without DB:', (err as Error).message);
  }

  app.listen(PORT, () => {
    console.log(`[Server] Dragon Nest Admin API running on port ${PORT}`);
  });
}

start();
