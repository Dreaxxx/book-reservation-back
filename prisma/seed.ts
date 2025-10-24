import { PrismaClient } from "@prisma/client";
import * as argon2 from 'argon2'

const prisma = new PrismaClient();

async function main() {
    //Default User
    await prisma.user.create({
        data: {
            email: 'test@test.com',
            password: await argon2.hash('password'),
            name: 'John Doe',
        },
    })

    // Genres
    const fiction = await prisma.genre.upsert({
        where: { name: "Fiction" },
        update: {},
        create: { name: "Fiction" },
    });
    const fantasy = await prisma.genre.upsert({
        where: { name: "Fantasy" },
        update: {},
        create: { name: "Fantasy" },
    });
    const sciFi = await prisma.genre.upsert({
        where: { name: "Science-Fiction" },
        update: {},
        create: { name: "Science-Fiction" },
    });

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
    await prisma.book.upsert({
        where: { id: "1" },
        update: {},
        create: {
            title: "Le Seigneur des Anneaux",
            year: 1954,
            authors: { connect: [{ id: tolkien.id }] },
            genres: { connect: [{ id: fantasy.id }, { id: fiction.id }] },
        },
    });

    await prisma.book.upsert({
        where: { id: "2" },
        update: {},
        create: {
            title: "Fondation",
            year: 1951,
            authors: { connect: [{ id: asimov.id }] },
            genres: { connect: [{ id: sciFi.id }] },
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
