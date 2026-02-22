import { google } from 'better-auth';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

const config = {
  databaseUrl: process.env.DATABASE_URL,
  port: process.env.PORT,
  betterAuthSecret: process.env.BETTER_AUTH_SECRET,
  betterAuthUrl: process.env.BETTER_AUTH_URL,
  appUrl: process.env.APP_URL,
  appUser: process.env.APP_USER,
  appPass: process.env.APP_PASS,
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
};

export default config;
