const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');

let prisma;

const createClient = () => {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is required but not set.');
  }
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
};

if (process.env.NODE_ENV === 'production') {
  prisma = createClient();
} else {
  // Prevent multiple instances of Prisma Client in development due to hot reloading
  if (!global.prismaInstance) {
    global.prismaInstance = createClient();
  }
  prisma = global.prismaInstance;
}

module.exports = prisma;
