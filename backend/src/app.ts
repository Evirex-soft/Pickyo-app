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
import rideRoutes from './routes/ride.route';
import driverRoutes from './routes/driver.routes';
import { logger } from './utils/logger';
import { globalLimiter, authLimiter } from './middleware/rateLimit.middleware';

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);
app.use(helmet());
app.use(cookieParser());
app.use(express.json({ limit: '10kb' }));
app.use(passport.initialize());
app.use(globalLimiter);

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
app.use('/api/users', userRoutes);
app.use('/api/rides', rideRoutes);
app.use('/api/driver', driverRoutes);

export default app;
