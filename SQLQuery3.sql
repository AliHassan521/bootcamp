-- Name: Ali Hassan
-- Date: 2025-08-10
-- Description: Stored procedures for required tables - CRUD operations with parameter validation and error handling.


-- Patient

CREATE PROCEDURE stp_GetAllPatients
AS
BEGIN
    SET NOCOUNT ON;
    SELECT * FROM Patient;
END;
go


CREATE PROCEDURE stp_AddPatient
    @FullName VARCHAR(50),
    @DOB DATE,
    @Gender VARCHAR(10),
    @Phone VARCHAR(20),
    @Email VARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        IF @FullName IS NULL OR LEN(@FullName) = 0
            THROW 50001, 'FullName is required.', 1;

        INSERT INTO Patient (FullName, DOB, Gender, Phone, Email)
        VALUES (@FullName, @DOB, @Gender, @Phone, @Email);

		 SELECT SCOPE_IDENTITY() AS NewPatientID;
    END TRY
    BEGIN CATCH
        THROW;
    END CATCH
END;
GO




CREATE PROCEDURE stp_GetPatient
    @PatientID INT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        IF @PatientID IS NULL
            THROW 50003, 'PatientID is required.', 1;

        SELECT * FROM Patient WHERE PatientID = @PatientID;
    END TRY
    BEGIN CATCH
        THROW;
    END CATCH
END;
GO



ALTER PROCEDURE stp_UpdatePatient
    @PatientID INT,
    @FullName VARCHAR(50),
    @DOB DATE,
    @Gender VARCHAR(10),
    @Phone VARCHAR(20),
    @Email VARCHAR(100)
AS
BEGIN
    SET NOCOUNT OFF;  -- Important: allow row count to be returned

    BEGIN TRY
        IF @PatientID IS NULL OR @FullName IS NULL OR LEN(@FullName) = 0
            THROW 50004, 'PatientID and FullName are required.', 1;

        IF NOT EXISTS (SELECT 1 FROM Patient WHERE PatientID = @PatientID)
            THROW 50005, 'Patient not found.', 1;

        UPDATE Patient
        SET FullName = @FullName,
            DOB = @DOB,
            Gender = @Gender,
            Phone = @Phone,
            Email = @Email
        WHERE PatientID = @PatientID;

        -- Return number of rows affected
        SELECT @@ROWCOUNT AS RowsAffected;
    END TRY
    BEGIN CATCH
        THROW;
    END CATCH
END;
GO

ALTER PROCEDURE stp_DeletePatient
    @PatientID INT
AS
BEGIN
    SET NOCOUNT OFF;

    BEGIN TRY
        IF @PatientID IS NULL
            THROW 50006, 'PatientID is required.', 1;

        IF NOT EXISTS (SELECT 1 FROM Patient WHERE PatientID = @PatientID)
            THROW 50007, 'Patient not found.', 1;

        DELETE FROM Patient WHERE PatientID = @PatientID;

        SELECT @@ROWCOUNT AS RowsAffected;
    END TRY
    BEGIN CATCH
        THROW;
    END CATCH
END;
GO

-- Doctor
CREATE PROCEDURE stp_GetAllDoctors
AS
BEGIN
    SET NOCOUNT ON;
    SELECT * FROM Doctor;
END;
go

CREATE PROCEDURE stp_AddDoctor
    @FullName VARCHAR(50),
    @Specialty VARCHAR(100),
    @Phone VARCHAR(20),
    @Email VARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        IF @FullName IS NULL OR LEN(@FullName) = 0
            THROW 51001, 'FullName is required.', 1;

        INSERT INTO Doctor (FullName, Specialty, Phone, Email)
        VALUES (@FullName, @Specialty, @Phone, @Email);

        -- Return the new DoctorID to the application
        SELECT SCOPE_IDENTITY() AS NewDoctorID;
    END TRY
    BEGIN CATCH
        THROW;
    END CATCH
END;
GO



CREATE PROCEDURE stp_GetDoctor
    @DoctorID INT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        IF @DoctorID IS NULL
            THROW 51003, 'DoctorID is required.', 1;

        SELECT * FROM Doctor WHERE DoctorID = @DoctorID;
    END TRY
    BEGIN CATCH
        THROW;
    END CATCH
END;
GO


CREATE PROCEDURE stp_UpdateDoctor
    @DoctorID INT,
    @FullName VARCHAR(50),
    @Specialty VARCHAR(100),
    @Phone VARCHAR(20),
    @Email VARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        IF @DoctorID IS NULL OR @FullName IS NULL OR LEN(@FullName) = 0
            THROW 51004, 'DoctorID and FullName are required.', 1;

        IF NOT EXISTS (SELECT 1 FROM Doctor WHERE DoctorID = @DoctorID)
            THROW 51005, 'Doctor not found.', 1;

        UPDATE Doctor
        SET FullName = @FullName,
            Specialty = @Specialty,
            Phone = @Phone,
            Email = @Email
        WHERE DoctorID = @DoctorID;
    END TRY
    BEGIN CATCH
        THROW;
    END CATCH
END;
GO


CREATE PROCEDURE stp_DeleteDoctor
    @DoctorID INT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        IF @DoctorID IS NULL
            THROW 51006, 'DoctorID is required.', 1;

        IF NOT EXISTS (SELECT 1 FROM Doctor WHERE DoctorID = @DoctorID)
            THROW 51007, 'Doctor not found.', 1;

        DELETE FROM Doctor WHERE DoctorID = @DoctorID;
    END TRY
    BEGIN CATCH
        THROW;
    END CATCH
END;
GO


-- Visit
CREATE PROCEDURE stp_AddVisit
    @VisitID INT,
    @PatientID INT,
    @DoctorID INT,
    @VisitDate DATETIME,
    @TypeID INT,
    @Description TEXT = NULL,
    @FeeID INT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        
        IF @VisitID IS NULL OR @PatientID IS NULL OR @DoctorID IS NULL OR 
           @VisitDate IS NULL OR @TypeID IS NULL OR @FeeID IS NULL
            THROW 54001, 'All required fields except Description must be provided.', 1;

        IF EXISTS (SELECT 1 FROM Visit WHERE VisitID = @VisitID)
            THROW 54002, 'VisitID already exists.', 1;

        IF NOT EXISTS (SELECT 1 FROM Patient WHERE PatientID = @PatientID)
            THROW 54003, 'Patient not found.', 1;

        IF NOT EXISTS (SELECT 1 FROM Doctor WHERE DoctorID = @DoctorID)
            THROW 54004, 'Doctor not found.', 1;

        IF NOT EXISTS (SELECT 1 FROM VisitType WHERE TypeID = @TypeID)
            THROW 54005, 'VisitType not found.', 1;

        IF NOT EXISTS (SELECT 1 FROM FeeSchedule WHERE FeeID = @FeeID)
            THROW 54006, 'FeeSchedule not found.', 1;

        INSERT INTO Visit (VisitID, PatientID, DoctorID, VisitDate, TypeID, Description, FeeID)
        VALUES (@VisitID, @PatientID, @DoctorID, @VisitDate, @TypeID, @Description, @FeeID);
    END TRY
    BEGIN CATCH
        THROW;
    END CATCH
END;
GO


CREATE PROCEDURE stp_GetVisit
    @VisitID INT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        IF @VisitID IS NULL
            THROW 54007, 'VisitID is required.', 1;

        SELECT * FROM Visit WHERE VisitID = @VisitID;
    END TRY
    BEGIN CATCH
        THROW;
    END CATCH
END;
GO


CREATE PROCEDURE stp_UpdateVisit
    @VisitID INT,
    @PatientID INT,
    @DoctorID INT,
    @VisitDate DATETIME,
    @TypeID INT,
    @Description TEXT = NULL,
    @FeeID INT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        IF @VisitID IS NULL OR @PatientID IS NULL OR @DoctorID IS NULL OR
           @VisitDate IS NULL OR @TypeID IS NULL OR @FeeID IS NULL
            THROW 54008, 'All required fields except Description must be provided.', 1;

        IF NOT EXISTS (SELECT 1 FROM Visit WHERE VisitID = @VisitID)
            THROW 54009, 'Visit not found.', 1;

        IF NOT EXISTS (SELECT 1 FROM Patient WHERE PatientID = @PatientID)
            THROW 54010, 'Patient not found.', 1;

        IF NOT EXISTS (SELECT 1 FROM Doctor WHERE DoctorID = @DoctorID)
            THROW 54011, 'Doctor not found.', 1;

        IF NOT EXISTS (SELECT 1 FROM VisitType WHERE TypeID = @TypeID)
            THROW 54012, 'VisitType not found.', 1;

        IF NOT EXISTS (SELECT 1 FROM FeeSchedule WHERE FeeID = @FeeID)
            THROW 54013, 'FeeSchedule not found.', 1;

        UPDATE Visit
        SET PatientID = @PatientID,
            DoctorID = @DoctorID,
            VisitDate = @VisitDate,
            TypeID = @TypeID,
            Description = @Description,
            FeeID = @FeeID
        WHERE VisitID = @VisitID;
    END TRY
    BEGIN CATCH
        THROW;
    END CATCH
END;
GO

CREATE PROCEDURE stp_DeleteVisit
    @VisitID INT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        IF @VisitID IS NULL
            THROW 54014, 'VisitID is required.', 1;

        IF NOT EXISTS (SELECT 1 FROM Visit WHERE VisitID = @VisitID)
            THROW 54015, 'Visit not found.', 1;

        DELETE FROM Visit WHERE VisitID = @VisitID;
    END TRY
    BEGIN CATCH
        THROW;
    END CATCH
END;
GO


-- User
CREATE PROCEDURE stp_AddUser
    @UserID INT,
    @Username VARCHAR(50),
    @Password VARCHAR(255),
    @RoleID INT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        IF @UserID IS NULL OR @Username IS NULL OR LTRIM(RTRIM(@Username)) = '' OR
           @Password IS NULL OR LTRIM(RTRIM(@Password)) = '' OR @RoleID IS NULL
            THROW 56001, 'All fields are required.', 1;

        IF EXISTS (SELECT 1 FROM [User] WHERE UserID = @UserID)
            THROW 56002, 'UserID already exists.', 1;

        IF EXISTS (SELECT 1 FROM [User] WHERE Username = @Username)
            THROW 56003, 'Username already exists.', 1;

        IF NOT EXISTS (SELECT 1 FROM UserRole WHERE RoleID = @RoleID)
            THROW 56004, 'RoleID not found.', 1;

        INSERT INTO [User] (UserID, Username, Password, RoleID)
        VALUES (@UserID, @Username, @Password, @RoleID);
    END TRY
    BEGIN CATCH
        THROW;
    END CATCH
END;
GO

CREATE PROCEDURE stp_GetUser
    @UserID INT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        IF @UserID IS NULL
            THROW 56005, 'UserID is required.', 1;

        SELECT UserID, Username, RoleID FROM [User] WHERE UserID = @UserID;
    END TRY
    BEGIN CATCH
        THROW;
    END CATCH
END;
GO

CREATE PROCEDURE stp_UpdateUser
    @UserID INT,
    @Username VARCHAR(50),
    @Password VARCHAR(255),
    @RoleID INT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        IF @UserID IS NULL OR @Username IS NULL OR LTRIM(RTRIM(@Username)) = '' OR
           @Password IS NULL OR LTRIM(RTRIM(@Password)) = '' OR @RoleID IS NULL
            THROW 56006, 'All fields are required.', 1;

        IF NOT EXISTS (SELECT 1 FROM [User] WHERE UserID = @UserID)
            THROW 56007, 'UserID not found.', 1;

        IF EXISTS (SELECT 1 FROM [User] WHERE Username = @Username AND UserID <> @UserID)
            THROW 56008, 'Username already used by another user.', 1;

        IF NOT EXISTS (SELECT 1 FROM UserRole WHERE RoleID = @RoleID)
            THROW 56009, 'RoleID not found.', 1;

        UPDATE [User]
        SET Username = @Username,
            Password = @Password,
            RoleID = @RoleID
        WHERE UserID = @UserID;
    END TRY
    BEGIN CATCH
        THROW;
    END CATCH
END;
GO

CREATE PROCEDURE stp_DeleteUser
    @UserID INT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        IF @UserID IS NULL
            THROW 56010, 'UserID is required.', 1;

        IF NOT EXISTS (SELECT 1 FROM [User] WHERE UserID = @UserID)
            THROW 56011, 'UserID not found.', 1;

        DELETE FROM [User] WHERE UserID = @UserID;
    END TRY
    BEGIN CATCH
        THROW;
    END CATCH
END;
GO

