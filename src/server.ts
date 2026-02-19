import app from './app';
import config from './config';
import { prisma } from './lib/prisma';

const port = config.port || 8080;
async function main() {
  try {
    await prisma.$connect();
    console.log('Database connection successfully...');
    // Start the server
    app.listen(port, () => {
      console.log(`Server running on port http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Error starting the server:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

main();
