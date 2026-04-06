CREATE TABLE Users (
    iduser INTEGER PRIMARY KEY,
    email TEXT UNIQUE,
    name TEXT,
    passwd TEXT,
    alert INTEGER DEFAULT 0,
    active INTEGER DEFAULT 1,
    facebook TEXT,
    google TEXT,
    twitter TEXT,
    createdon TEXT,
    createdAt TEXT,
    updatedAt TEXT
);

CREATE TABLE AccountTypes (
    idtype INTEGER PRIMARY KEY,
    description TEXT,
    icon TEXT,
    inactive INTEGER DEFAULT 0
);

CREATE TABLE Accounts (
    idaccount INTEGER PRIMARY KEY,
    iduser INTEGER,
    idtype INTEGER,
    description TEXT,
    creditlimit REAL DEFAULT 0,
    balance REAL DEFAULT 0,
    openingdate TEXT,
    duedate INTEGER,
    createdAt TEXT,
    updatedAt TEXT,
    FOREIGN KEY (iduser) REFERENCES Users(iduser),
    FOREIGN KEY (idtype) REFERENCES AccountTypes(idtype)
);

CREATE TABLE Categories (
    idcategory INTEGER PRIMARY KEY,
    iduser INTEGER,
    description TEXT,
    budget REAL DEFAULT 0,
    createdAt TEXT,
    updatedAt TEXT,
    FOREIGN KEY (iduser) REFERENCES Users(iduser)
);

CREATE TABLE Transactions (
    idtransaction INTEGER PRIMARY KEY,
    iduser INTEGER,
    idaccount INTEGER,
    idparent INTEGER,
    idstatus INTEGER,
    description TEXT,
    instalment TEXT,
    amount REAL DEFAULT 0,
    type TEXT,
    startdate TEXT,
    duedate TEXT,
    tag TEXT,
    origin TEXT,
    createdAt TEXT,
    updatedAt TEXT,
    FOREIGN KEY (iduser) REFERENCES Users(iduser),
    FOREIGN KEY (idaccount) REFERENCES Accounts(idaccount)
);
