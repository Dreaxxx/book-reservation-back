import { PrismaClient } from "@prisma/client";
import * as argon2 from 'argon2'

const prisma = new PrismaClient();

async function main() {
    //Default User
    const user = await prisma.user.upsert({
        where: { email: 'test@test.com' },
        update: {},
        create: {
            email: 'test@test.com',
            password: await argon2.hash('password'),
            name: 'John Doe',
        }
    })

    // Authros
    const tolkien = await prisma.author.upsert({
        where: { name: "J.R.R. Tolkien" },
        update: {},
        create: { name: "J.R.R. Tolkien" },
    });
    const asimov = await prisma.author.upsert({
        where: { name: "Isaac Asimov" },
        update: {},
        create: { name: "Isaac Asimov" },
    });

    // Books
    const book = await prisma.book.upsert({
        where: { id: "1" },
        update: {},
        create: {
            title: "Le Seigneur des Anneaux",
            year: 1954,
            authors: { connect: [{ id: tolkien.id }] },
            genres: ['Fantasy', 'Adventure'],
        },
    });

    await prisma.book.upsert({
        where: { id: "2" },
        update: {},
        create: {
            title: "Fondation",
            year: 1951,
            authors: { connect: [{ id: asimov.id }] },
            genres: ['Science Fiction'],
        },
    });

    // Reservations
    await prisma.reservation.upsert({
        where: { id: "3" },
        update: {},
        create: {
            book: { connect: { id: book.id } },
            reservedBy: { connect: { id: user.id } },
            dueDate: new Date('2025-12-31'),
        },
    });
}

main()
    .then(async () => await prisma.$disconnect())
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
