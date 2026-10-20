ALTER TABLE RentalListings
    ADD COLUMN MapURL VARCHAR(500) NULL;

CREATE TABLE RentalListingPhotos (
    ListingID BIGINT UNSIGNED PRIMARY KEY,
    RoomPhoto MEDIUMBLOB NOT NULL,
    RoomPhotoMime ENUM('image/jpeg', 'image/png', 'image/webp') NOT NULL,
    BathroomPhoto MEDIUMBLOB NULL,
    BathroomPhotoMime ENUM('image/jpeg', 'image/png', 'image/webp') NULL,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_rental_listing_photo
        FOREIGN KEY (ListingID) REFERENCES RentalListings(ListingID) ON DELETE CASCADE
);
