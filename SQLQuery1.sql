-- use dummy_db

create table Practices(
PracticeId int identity(1,1) primary key,
PracticeName varchar(50) not null,
TaxId varchar(20) not null
)

create table Locations(
LocationId int identity(1,1) primary key,
PracticeId int not null,
PracticeAddress varchar(100) not null,
Email varchar(50) unique not null,
Phone varchar(50) not null,
PlaceOfServicesCode varchar(10) not null,
foreign key (PracticeId) references Practices(PracticeId)
)

create table Roles(
RoleId int identity(1,1) primary key,
RoleName varchar(50) not null
)

Create table Users(
UserId int identity(1,1) primary key,
RoleId int not null,
Title varchar(5),
FullName varchar(50),
DoB date not null,
Gender varchar(20) not null,
AddressLine varchar(100),
Email varchar(50) unique not null,
Phone varchar(50) not null,
Username varchar(100) unique not null,
PasswordHash varchar(100) not null,
IsActive bit default 1,
foreign key (RoleId) references Roles(RoleId) 
)

create table Providers(
ProviderId int identity(1,1) primary key,
ProviderName varchar(100) not null,
SSN varchar(50) not null unique,
NPI varchar(50) not null unique,
LicenseType varchar(50) not null,
ProviderAddress varchar(100) not null,
Email varchar(50) unique not null,
Phone varchar(50) not null,
Speciality varchar(50) not null,
ProviderType varchar(50),
ProviderSignature varchar(50) not null
)

create table ProviderSchedule(
ScheduleId int identity(1,1) primary key,
ProviderId int not null,
Day_Of_Week varchar(10) not null,
StartTime time not null,
EndTime time not null,
SlotDuration int not null,
foreign key (ProviderId) references Providers(ProviderId)
)

create table Resources(
ResourceId int identity(1,1) primary key,
LocationId int not null,
ResourcesName varchar(50) not null,
ResourceType varchar(50),
foreign key (LocationId) references Locations(LocationId)
)

Create table Patients(
PatientId int identity(1,1) primary key,
Title varchar(20),
FullName varchar(50),
DoB date not null,
Gender varchar(20) not null,
AddressLine varchar(100),
SSN varchar(50) not null unique,
Email varchar(50) unique not null,
Phone varchar(50) not null 
)

create table Appointments(
AppointmentId int identity(1,1) primary key,
PatientId int not null,
ProviderId int not null,
LocationId int not null,
ResourceId int null,
AppointmentDate date not null,
StartTime time not null,
EndTime time not null,
AppointmentStatus varchar(20) not null default 'Scheduled',
Reason varchar(100),
CopayAmount decimal(10,2) not null,
IsPaid bit default 0,
foreign key (LocationId) references Locations(LocationId),
foreign key (ProviderId) references Providers(ProviderId),
foreign key (PatientId) references Patients(PatientId),
foreign key (ResourceId) references Resources(ResourceId)
)

IF NOT EXISTS (SELECT 1 FROM Roles WHERE RoleName = 'Admin')
    INSERT INTO Roles (RoleName) VALUES ('Admin');

IF NOT EXISTS (SELECT 1 FROM Roles WHERE RoleName = 'Provider')
    INSERT INTO Roles (RoleName) VALUES ('Provider');

IF NOT EXISTS (SELECT 1 FROM Roles WHERE RoleName = 'Receptionist')
    INSERT INTO Roles (RoleName) VALUES ('Receptionist');

select * from roles