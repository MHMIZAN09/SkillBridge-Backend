import express, { Application } from 'express';
import cors from 'cors';
import { auth } from './lib/auth';
import { toNodeHandler } from 'better-auth/node';

const app: Application = express();
app.use(express.json());
app.use(
  cors({
    origin: '*',
    credentials: true,
  }),
);

app.get('/', (req, res) => {
  res.send('Welcome to the SkillBridge API!');
});

app.all('/api/auth/*splat', toNodeHandler(auth));

export default app;
