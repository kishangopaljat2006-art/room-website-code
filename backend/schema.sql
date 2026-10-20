-- Run this file against the target database selected in DATABASE_URL.

CREATE TABLE IF NOT EXISTS Users (
    UserID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(255) NOT NULL,
    Email VARCHAR(255) UNIQUE NOT NULL,
    Phone VARCHAR(20) NOT NULL
);

CREATE TABLE IF NOT EXISTS OwnerAccounts (
    OwnerID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Email VARCHAR(254) NOT NULL UNIQUE,
    Phone VARCHAR(20) NOT NULL,
    PasswordHash VARCHAR(255) NOT NULL,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS TenantAccounts (
    TenantID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Email VARCHAR(254) NOT NULL UNIQUE,
    Phone VARCHAR(20) NOT NULL,
    PasswordHash VARCHAR(255) NOT NULL,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Locations (
    LocationID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(255) NOT NULL,
    Address VARCHAR(255) NOT NULL,
    City VARCHAR(100) NOT NULL,
    Country VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS Services (
    ServiceID INT AUTO_INCREMENT PRIMARY KEY,
    LocationID INT,
    Name VARCHAR(255) NOT NULL,
    Description TEXT,
    Price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (LocationID) REFERENCES Locations(LocationID) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS Bookings (
    BookingID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT NOT NULL,
    ServiceID INT NOT NULL,
    BookingDate DATE NOT NULL,
    Status VARCHAR(50) DEFAULT 'Pending',
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE,
    FOREIGN KEY (ServiceID) REFERENCES Services(ServiceID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Payment (
    PaymentID INT AUTO_INCREMENT PRIMARY KEY,
    BookingID INT UNIQUE NOT NULL,
    Amount DECIMAL(10, 2) NOT NULL,
    PaymentDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PaymentMethod VARCHAR(100) NOT NULL,
    FOREIGN KEY (BookingID) REFERENCES Bookings(BookingID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS RentalListings (
    ListingID BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    OwnerID INT NOT NULL,
    Title VARCHAR(70) NOT NULL,
    PropertyType ENUM('Private room', 'Shared room', '1 BHK flat', '2 BHK flat', 'Studio apartment') NOT NULL,
    City VARCHAR(100) NOT NULL,
    Address VARCHAR(180) NOT NULL,
    MonthlyRent DECIMAL(10, 2) NOT NULL,
    Bedrooms TINYINT UNSIGNED NOT NULL,
    Description VARCHAR(300) NOT NULL,
    PhotoURL VARCHAR(500) NULL,
    IsActive BOOLEAN NOT NULL DEFAULT TRUE,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_rental_listings_public (IsActive, City),
    INDEX idx_rental_listings_owner (OwnerID, CreatedAt),
    CONSTRAINT fk_rental_listing_owner
        FOREIGN KEY (OwnerID) REFERENCES OwnerAccounts(OwnerID) ON DELETE CASCADE,
    CONSTRAINT chk_rental_listing_rent CHECK (MonthlyRent > 0 AND MonthlyRent <= 1000000),
    CONSTRAINT chk_rental_listing_bedrooms CHECK (Bedrooms > 0 AND Bedrooms <= 30)
);

CREATE TABLE IF NOT EXISTS RentalBookings (
    BookingID BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    ListingID BIGINT UNSIGNED NOT NULL,
    TenantID INT NULL,
    TenantName VARCHAR(100) NOT NULL,
    TenantEmail VARCHAR(254) NOT NULL,
    TenantPhone VARCHAR(20) NOT NULL,
    MoveInDate DATE NOT NULL,
    MonthlyRentSnapshot DECIMAL(10, 2) NOT NULL,
    Status ENUM('Requested', 'Accepted', 'Declined', 'Cancelled') NOT NULL DEFAULT 'Requested',
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_rental_bookings_listing (ListingID, CreatedAt),
    INDEX idx_rental_bookings_tenant (TenantID, CreatedAt),
    CONSTRAINT fk_rental_booking_tenant
        FOREIGN KEY (TenantID) REFERENCES TenantAccounts(TenantID) ON DELETE SET NULL,
    CONSTRAINT fk_rental_booking_listing
        FOREIGN KEY (ListingID) REFERENCES RentalListings(ListingID) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS TenantVerification (
    VerificationID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT NOT NULL,
    AadhaarNumberHash VARCHAR(255) NOT NULL,
    ConsentGiven BOOLEAN DEFAULT FALSE NOT NULL,
    PoliceVerificationStatus VARCHAR(50) DEFAULT 'Pending',
    VerificationDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    DocumentURL VARCHAR(500),
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS RentAgreements (
    AgreementID INT AUTO_INCREMENT PRIMARY KEY,
    BookingID INT UNIQUE NOT NULL,
    TenantID INT NOT NULL,
    LandlordID INT NOT NULL,
    DurationMonths INT DEFAULT 11 CHECK (DurationMonths <= 11),
    EStampNumber VARCHAR(100),
    IsTenantSigned BOOLEAN DEFAULT FALSE,
    IsLandlordSigned BOOLEAN DEFAULT FALSE,
    AgreementStatus VARCHAR(50) DEFAULT 'Draft',
    StartDate DATE NOT NULL,
    EndDate DATE NOT NULL,
    AgreementPDFURL VARCHAR(500),
    FOREIGN KEY (BookingID) REFERENCES Bookings(BookingID) ON DELETE CASCADE,
    FOREIGN KEY (TenantID) REFERENCES Users(UserID),
    FOREIGN KEY (LandlordID) REFERENCES Users(UserID)
);
