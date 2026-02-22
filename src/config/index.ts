import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

const config = {
  databaseUrl: process.env.DATABASE_URL,
  port: process.env.PORT,
  betterAuthSecret: process.env.BETTER_AUTH_SECRET,
  betterAuthUrl: process.env.BETTER_AUTH_URL,
  appUrl: process.env.APP_URL,
};

export default config;
