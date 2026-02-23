import express from 'express';
import cors from 'cors';
import { auth } from './lib/auth';
import { toNodeHandler } from 'better-auth/node';
import { UserRouter } from './modules/user/user.route';
import errorHandler from './middleware/globalErrorHandler';
import { notFound } from './middleware/notFound';
import { TutorRoutes } from './modules/tutor/tutor.route';
import { CategoryRouter } from './modules/category/category.route';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Welcome to the SkillBridge Backend API!');
});

// better auth
app.all('/api/auth/*splat', toNodeHandler(auth));

app.use('/api/users', UserRouter);

app.use('/api/tutors', TutorRoutes);

app.use('/api/categories', CategoryRouter);
// Global error handling and 404 not found middleware

app.use(errorHandler);
app.use(notFound);

export default app;
