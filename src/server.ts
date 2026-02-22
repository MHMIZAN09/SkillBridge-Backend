import app from './app';
import config from './config';
import { prisma } from './lib/prisma';

const port = config.port || 3000;

async function startServer() {
  try {
    await prisma.$connect();
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Failed to start the server:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

startServer();
