-- Name: Ali Hassan
-- Date: 2025-08-10
-- Description: Create tables and schema for with all entities with their attributes


CREATE TABLE Patient (
    PatientID INT IDENTITY(1,1) PRIMARY KEY,
    FullName VARCHAR(50) NOT NULL,
    DOB DATE,
    Gender VARCHAR(10),
    Phone VARCHAR(20),
    Email VARCHAR(100)
);


CREATE TABLE Doctor (
    DoctorID INT IDENTITY(1,1) PRIMARY KEY,
    FullName VARCHAR(50) NOT NULL,
    Specialty VARCHAR(100),
    Phone VARCHAR(20),
    Email VARCHAR(100)
);

CREATE TABLE VisitType (
    TypeID INT IDENTITY(1,1) PRIMARY KEY,
    TypeName VARCHAR(50) NOT NULL UNIQUE
);


CREATE TABLE FeeSchedule (
    FeeID INT IDENTITY(1,1) PRIMARY KEY,
    TypeID INT NOT NULL,
    FeeAmount DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (TypeID) REFERENCES VisitType(TypeID)
);


CREATE TABLE Visit (
    VisitID INT IDENTITY(1,1) PRIMARY KEY,
    PatientID INT NOT NULL,
    DoctorID INT NOT NULL,
    VisitDate DATETIME NOT NULL,
    TypeID INT NOT NULL,
    Description TEXT,
    FeeID INT NOT NULL,
    FOREIGN KEY (PatientID) REFERENCES Patient(PatientID),
    FOREIGN KEY (DoctorID) REFERENCES Doctor(DoctorID),
    FOREIGN KEY (TypeID) REFERENCES VisitType(TypeID),
    FOREIGN KEY (FeeID) REFERENCES FeeSchedule(FeeID)
);


CREATE TABLE UserRole (
    RoleID INT IDENTITY(1,1) PRIMARY KEY,
    RoleName VARCHAR(50) NOT NULL UNIQUE
);


CREATE TABLE [User] (
    UserID INT IDENTITY(1,1) PRIMARY KEY,
    Username VARCHAR(50) NOT NULL UNIQUE,
    Password VARCHAR(255) NOT NULL,
    RoleID INT NOT NULL,
    FOREIGN KEY (RoleID) REFERENCES UserRole(RoleID)
);


CREATE TABLE ActivityLog (
    LogID INT IDENTITY(1,1) PRIMARY KEY,
    Action VARCHAR(50) NOT NULL,
    EntityAffected VARCHAR(50) NOT NULL,
    DateTime DATETIME NOT NULL DEFAULT GETDATE(),
    UserID INT NOT NULL,
    FOREIGN KEY (UserID) REFERENCES [User](UserID)
);

