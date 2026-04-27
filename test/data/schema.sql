DROP TABLE IF EXISTS accounts;

CREATE TABLE IF NOT EXISTS accounts (
	idaccount TEXT PRIMARY KEY,    -- GUID/UUID stored as TEXT (use UUID type in Postgres)
	iduser TEXT,                   -- GUID/UUID for user id
	idtype INTEGER,                -- integer foreign key referencing accounttypes(idtype)
	description TEXT,
	creditlimit REAL,
	balance REAL,
	openingdate DATETIME,
	duedate INTEGER,
	createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
	updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO accounts (idaccount, iduser, idtype, description, creditlimit, balance, openingdate, duedate, createdAt, updatedAt) VALUES
('7b9f3e1a-3c2d-4f5a-9d1b-2e0f6a7b8c9d','d4f8e6b2-1c3a-4b5d-9e6f-0a1b2c3d4e5f',1,'Alfreds Futterkiste — Maria Anders', NULL, NULL, NULL, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('a1b2c3d4-e5f6-7a89-b012-3456789abcde','e2e4e6e8-9a0b-4c5d-9f1a-b2c3d4e5f6a7',2,'Around the Horn — Thomas Hardy', NULL, NULL, NULL, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('123e4567-e89b-12d3-a456-426614174000','f1e2d3c4-b5a6-7890-1234-56789abcdef0',3,'Bs Beverages — Victoria Ashworth', NULL, NULL, NULL, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('9f8e7d6c-5b4a-3f21-0e9d-8c7b6a5d4e3f','0f1e2d3c-4b5a-6789-0abc-def123456789',3,'Bs Beverages — Random Name', NULL, NULL, NULL, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- accounttypes table (mapped from lib/models/accounttype.js)
DROP TABLE IF EXISTS accounttypes;

CREATE TABLE IF NOT EXISTS accounttypes (
	idtype INTEGER PRIMARY KEY,    -- numeric id for account type
	description TEXT,
	icon TEXT,
	inactive INTEGER DEFAULT 0  -- SQLite uses INTEGER 0/1 for booleans
);

INSERT INTO accounttypes (idtype, description, icon, inactive) VALUES
(1, 'Checking Account', 'bank', 0),
(2, 'Savings Account', 'piggy-bank', 0),
(3, 'Credit Card', 'credit-card', 1);
