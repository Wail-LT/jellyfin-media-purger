import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { CREATE_SETTINGS_TABLE, CREATE_OPERATION_LOGS_TABLE, SEED_SETTINGS } from './schema';

const DB_PATH = process.env.DATABASE_PATH
  ? path.resolve(process.env.DATABASE_PATH)
  : path.join(process.cwd(), 'data', 'app.db');

// Ensure the data directory exists
const dbDir = path.dirname(DB_PATH);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Singleton — Next.js hot-reload safe via global
const globalForDb = global as unknown as { db: Database.Database | undefined };

function createDb(): Database.Database {
  const db = new Database(DB_PATH);
  db.pragma('journal_mode = WAL');
  db.exec(CREATE_SETTINGS_TABLE);
  db.exec(CREATE_OPERATION_LOGS_TABLE);
  db.exec(SEED_SETTINGS);
  return db;
}

export const db: Database.Database = globalForDb.db ?? createDb();

if (process.env.NODE_ENV !== 'production') {
  globalForDb.db = db;
}
