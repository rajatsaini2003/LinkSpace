import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { config } from './config/env';
import { errorMiddleware } from './middlewares/error.middleware';

import authRoutes from './modules/auth/auth.routes';
import userRoutes from './modules/users/users.routes';
import bookmarkRoutes from './modules/bookmarks/bookmarks.routes';
import collectionRoutes from './modules/collections/collections.routes';
import tagRoutes from './modules/tags/tags.routes';
import commentRoutes from './modules/comments/comments.routes';
import feedRoutes from './modules/feed/feed.routes';
import aiRoutes from './modules/ai/ai.routes';

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: config.clientUrl,
    credentials: true,
  }),
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Global rate limiter: 200 requests per minute per IP
const globalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later' },
});
app.use(globalLimiter);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/bookmarks', bookmarkRoutes);
app.use('/collections', collectionRoutes);
app.use('/tags', tagRoutes);
app.use('/comments', commentRoutes);
app.use('/feed', feedRoutes);
app.use('/ai', aiRoutes);

app.use(errorMiddleware);

export default app;
