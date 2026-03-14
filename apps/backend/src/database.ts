import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(__dirname, '../hotel.db');

const db = new Database(dbPath);

db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        nombre TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        passwordHash TEXT NOT NULL,
        role TEXT NOT NULL,
        createdAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS rooms (
        id TEXT PRIMARY KEY,
        number TEXT UNIQUE NOT NULL,
        type TEXT NOT NULL,
        price REAL NOT NULL,
        description TEXT NOT NULL,
        status TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS reservations (
        id TEXT PRIMARY KEY,
        userId TEXT NOT NULL,
        roomId TEXT NOT NULL,
        startDate TEXT NOT NULL,
        endDate TEXT NOT NULL,
        status TEXT NOT NULL,
        totalPrice REAL NOT NULL,
        createdAt TEXT NOT NULL
    );
`);

export default db;