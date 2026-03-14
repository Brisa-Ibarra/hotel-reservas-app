import { Room } from '@hotel/domain/src/entities/Room';
import { RoomRepository } from '@hotel/domain/src/repositories/RoomRepository';
import db from '../database';

export class RoomRepo implements RoomRepository {
    async save(room: Room): Promise<void> {
        const existing = db.prepare('SELECT id FROM rooms WHERE id = ?').get(room.id);
        if (existing) {
            db.prepare(`
                UPDATE rooms SET number = ?, type = ?, price = ?, description = ?, status = ? WHERE id = ?
            `).run(room.number, room.type, room.price, room.description, room.status, room.id);
        } else {
            db.prepare(`
                INSERT INTO rooms (id, number, type, price, description, status)
                VALUES (?, ?, ?, ?, ?, ?)
            `).run(room.id, room.number, room.type, room.price, room.description, room.status);
        }
    }

    async findById(id: string): Promise<Room | null> {
        const row = db.prepare('SELECT * FROM rooms WHERE id = ?').get(id) as any;
        if (!row) return null;
        return new Room({
            id: row.id,
            number: row.number,
            type: row.type,
            price: row.price,
            description: row.description,
            status: row.status
        });
    }

    async findAll(): Promise<Room[]> {
        const rows = db.prepare('SELECT * FROM rooms').all() as any[];
        return rows.map(row => new Room({
            id: row.id,
            number: row.number,
            type: row.type,
            price: row.price,
            description: row.description,
            status: row.status
        }));
    }

    async findAvailable(startDate: Date, endDate: Date): Promise<Room[]> {
        const rows = db.prepare(`
            SELECT * FROM rooms WHERE status = 'available' AND id NOT IN (
                SELECT roomId FROM reservations
                WHERE status = 'confirmed'
                AND startDate < ? AND endDate > ?
            )
        `).all(endDate.toISOString(), startDate.toISOString()) as any[];
        return rows.map(row => new Room({
            id: row.id,
            number: row.number,
            type: row.type,
            price: row.price,
            description: row.description,
            status: row.status
        }));
    }

    async delete(id: string): Promise<void> {
        db.prepare('DELETE FROM rooms WHERE id = ?').run(id);
    }
}