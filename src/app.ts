import express, { Application } from 'express';
import cors from 'cors';

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

export default app;
