export class CreateReservationDto {
    id!: string;
    bookId!: string;
    reservedBy!: string;
    reservedAt!: Date;
    dueDate!: Date;
    createdAt?: Date;
    updatedAt?: Date;
}
