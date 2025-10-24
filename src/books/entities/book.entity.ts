import { Reservation } from "../../reservations/entities/reservation.entity";

export class Book {
    id: string;
    name: string;
    authorNames: string[];
    genreNames: string[];
    year?: number;
    reservation?: Reservation;
    createdAt: Date;
    updatedAt: Date;
}
