import app from './app';
import { config } from './config/env';
import prisma from './lib/prisma';

async function main() {
  await prisma.$connect();
  console.log('✅ Database connected');

  app.listen(config.port, () => {
    console.log(`🚀 Server running on http://localhost:${config.port} in ${config.nodeEnv} mode`);
  });
}

main().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  console.log('Database disconnected');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  console.log('Database disconnected');
  process.exit(0);
});
