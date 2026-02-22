import express from 'express';
import cors from 'cors';
import { auth } from './lib/auth';
import { toNodeHandler } from 'better-auth/node';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Welcome to the SkillBridge Backend API!');
});

// better auth
app.all('/api/auth/*splat', toNodeHandler(auth));

export default app;
