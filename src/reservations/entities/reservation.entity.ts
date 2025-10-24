import { Book } from "../../books/entities/book.entity";
import { User } from "../../users/entities/user.entity";

export class Reservation {
    id: string;
    book: Book;
    reservedBy: User;
    reservedAt: Date;
    dueDate: Date;
    createdAt: Date;
    updatedAt: Date;
}
