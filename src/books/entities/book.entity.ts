import { Reservation } from "../../reservations/entities/reservation.entity";

export class Book {
    id: string;
    name: string;
    authorNames: string[];
    genreNames: string[];
    year?: number;
    createdAt: Date;
    updatedAt: Date;
}
