import 'dotenv/config';
import { PrismaClient, Role } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import bcrypt from 'bcryptjs';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

async function main() {
  const existingAdmin = await prisma.user.findFirst({
    where: { role: Role.admin },
  });

  if (existingAdmin) {
    console.log('Admin already exists');
    return;
  }

  const hashedPassword = await bcrypt.hash('Admin@123', 10);

  await prisma.user.create({
    data: {
      name: 'Super Admin',
      email: 'admin@pickyo.com',
      phone: '9999999999',
      password: hashedPassword,
      role: Role.admin,
      wallet: {
        create: {},
      },
    },
  });

  console.log('Admin seeded successfully');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
