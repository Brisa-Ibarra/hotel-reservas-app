import { Reservation } from '@hotel/domain/src/entities/Reservation';
import { ReservationRepository } from '@hotel/domain/src/repositories/ReservationRepository';
import db from '../database';

export class ReservationRepo implements ReservationRepository {
    async save(reservation: Reservation): Promise<void> {
        const existing = db.prepare('SELECT id FROM reservations WHERE id = ?').get(reservation.id);
        if (existing) {
            db.prepare(`
                UPDATE reservations SET status = ?, totalPrice = ? WHERE id = ?
            `).run(reservation.status, reservation.totalPrice, reservation.id);
        } else {
            db.prepare(`
                INSERT INTO reservations (id, userId, roomId, startDate, endDate, status, totalPrice, createdAt)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `).run(
                reservation.id,
                reservation.userId,
                reservation.roomId,
                reservation.startDate.toISOString(),
                reservation.endDate.toISOString(),
                reservation.status,
                reservation.totalPrice,
                reservation.createdAt.toISOString()
            );
        }
    }

    async findById(id: string): Promise<Reservation | null> {
        const row = db.prepare('SELECT * FROM reservations WHERE id = ?').get(id) as any;
        if (!row) return null;
        return new Reservation({
            id: row.id,
            userId: row.userId,
            roomId: row.roomId,
            startDate: new Date(row.startDate),
            endDate: new Date(row.endDate),
            status: row.status,
            totalPrice: row.totalPrice,
            createdAt: new Date(row.createdAt)
        });
    }

    async findByUserId(userId: string): Promise<Reservation[]> {
        const rows = db.prepare('SELECT * FROM reservations WHERE userId = ?').all(userId) as any[];
        return rows.map(row => new Reservation({
            id: row.id,
            userId: row.userId,
            roomId: row.roomId,
            startDate: new Date(row.startDate),
            endDate: new Date(row.endDate),
            status: row.status,
            totalPrice: row.totalPrice,
            createdAt: new Date(row.createdAt)
        }));
    }

    async findAll(): Promise<Reservation[]> {
        const rows = db.prepare('SELECT * FROM reservations').all() as any[];
        return rows.map(row => new Reservation({
            id: row.id,
            userId: row.userId,
            roomId: row.roomId,
            startDate: new Date(row.startDate),
            endDate: new Date(row.endDate),
            status: row.status,
            totalPrice: row.totalPrice,
            createdAt: new Date(row.createdAt)
        }));
    }

    async findOverlapping(roomId: string, startDate: Date, endDate: Date): Promise<Reservation[]> {
        const rows = db.prepare(`
            SELECT * FROM reservations
            WHERE roomId = ? AND status = 'confirmed'
            AND startDate < ? AND endDate > ?
        `).all(roomId, endDate.toISOString(), startDate.toISOString()) as any[];
        return rows.map(row => new Reservation({
            id: row.id,
            userId: row.userId,
            roomId: row.roomId,
            startDate: new Date(row.startDate),
            endDate: new Date(row.endDate),
            status: row.status,
            totalPrice: row.totalPrice,
            createdAt: new Date(row.createdAt)
        }));
    }
}