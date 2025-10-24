CREATE EXTENSION IF NOT EXISTS btree_gist;

ALTER TABLE "Reservation"
  ADD CONSTRAINT "reservation_valid_range"
  CHECK ("reservedAt" < "dueDate");

ALTER TABLE "Reservation"
  ADD CONSTRAINT "book_reservation_no_overlap"
  EXCLUDE USING gist (
    "bookId" WITH =,
    tsrange("reservedAt","dueDate",'[)') WITH && -- [) back to back is allowed, user can reserve a book starting the same day another reservation ends
  );
