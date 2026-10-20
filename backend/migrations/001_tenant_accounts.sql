CREATE TABLE TenantAccounts (
    TenantID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Email VARCHAR(254) NOT NULL UNIQUE,
    Phone VARCHAR(20) NOT NULL,
    PasswordHash VARCHAR(255) NOT NULL,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE RentalBookings
    ADD COLUMN TenantID INT NULL,
    ADD INDEX idx_rental_bookings_tenant (TenantID, CreatedAt),
    ADD CONSTRAINT fk_rental_booking_tenant
        FOREIGN KEY (TenantID) REFERENCES TenantAccounts(TenantID) ON DELETE SET NULL;
