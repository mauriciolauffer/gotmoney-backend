// Types used by the Cloudflare Worker and the D1 database bindings
// Mongoose schemas (lib/models) -> SQL fixtures map the types as follows:
// - idaccount: GUID/UUID (stored as TEXT in SQLite / UUID in Postgres)
// - iduser: GUID/UUID (TEXT)
// - idtype: integer (foreign key to AccountTypes.idtype)
// - creditlimit, balance: number (REAL)
// - openingdate, createdAt, updatedAt: ISO datetime string

// Existing binding for D1 database used by the worker.
export type Bindings = {
  DEV_GOTMONEY_DB: D1Database;
};

export type Account = {
  iduser: User["iduser"];
  idaccount: string; // UUID
  idtype: AccountType["idtype"];
  description?: string;
  creditlimit?: number;
  balance?: number;
  openingdate?: string; // ISO datetime
  duedate?: number;
  createdat: string; // ISO datetime
  updatedat: string; // ISO datetime
};

export type AccountType = {
  idtype: string; // UUID
  description: string;
  icon: string;
  inactive: boolean;
};

export type Category = {
  iduser: User["iduser"];
  idcategory: string; // UUID
  description: string;
  budget: number;
  createdat: string; // ISO datetime
  updatedat: string; // ISO datetime
};

export type Transaction = {
  iduser: User["iduser"];
  idaccount: Account["idaccount"];
  idtransaction: string; // UUID
  idparent: string; // UUID
  idstatus: TransactionStatus["idstatus"];
  description: string;
  idinstalmentgroup?: string; // UUID
  instalment?: number;
  amount: number;
  idtype: TransactionType["idtype"];
  startdate: string; // ISO datetime
  duedate: string; // ISO datetime
  tag: string[];
  origin: string;
  createdat: string; // ISO datetime
  updatedat: string; // ISO datetime
};

export type TransactionStatus = {
  idstatus: number;
  description: string;
};

export type TransactionType = {
  idtype: number;
  description: string;
};

export type User = {
  iduser: string; // UUID
  email: string;
  name: string;
  passwd: string;
  alert: boolean;
  active: boolean;
  facebook?: string;
  google?: string;
  twitter?: string;
  createdat: string; // ISO datetime
  updatedat: string; // ISO datetime
};

// Helper: typed row returned by D1Query (optional)
// Note: D1 returns rows as JS objects where DATE/TIMESTAMP columns are strings.
// If you prefer Date objects in business logic, convert the ISO strings using new Date(...).
