import { Prisma } from "@prisma/client";

export const RESERVATION_SELECT = {
    id: true,
    reservedAt: true,
    dueDate: true,
    createdAt: true,
    updatedAt: true,
    book: {
        select: {
            id: true,
            title: true,
            year: true,
            genres: true,
            createdAt: true,
            updatedAt: true,
        },
    },
    reservedBy: {
        select: {
            id: true,
            email: true,
            name: true,
            createdAt: true,
            updatedAt: true,
        },
    },
} satisfies Prisma.ReservationSelect;