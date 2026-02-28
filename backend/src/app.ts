import express from 'express';
import 'dotenv/config';
import passport from './config/passport';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes';
import oauthRoutes from './routes/oauth.routes';
import userRoutes from './routes/user.route';
import { logger } from './utils/logger';
import { globalLimiter, authLimiter } from './middleware/rateLimit.middleware';

const app = express();

app.use(helmet());
app.use(cookieParser());
app.use(globalLimiter);
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);
app.use(express.json({ limit: '10kb' }));
app.use(passport.initialize());

// Morgan setup to use winston for logging
app.use(
  morgan('combined', {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  }),
);

// Routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/oauth', oauthRoutes);
app.use('/api/users', authLimiter, userRoutes);

export default app;
