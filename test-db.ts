import { PrismaClient } from './generated/prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import 'dotenv/config';

async function test() {
    const adapter = new PrismaMariaDb({
        host: process.env.DATABASE_HOST || "localhost",
        port: Number(process.env.DATABASE_PORT) || 3306,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        connectionLimit: 10,
    });

    console.log('Connecting to:', process.env.DATABASE_HOST || "localhost");
    const prisma = new PrismaClient({ adapter });

    try {
        const count = await prisma.user.count();
        console.log('Connection successful! User count:', count);
    } catch (error) {
        console.error('Connection failed:', error);
    } finally {
        await prisma.$disconnect();
        process.exit(0);
    }
}

test();
