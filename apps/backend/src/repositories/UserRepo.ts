import { User } from '@hotel/domain/src/entities/User';
import { UserRepository } from '@hotel/domain/src/repositories/UserRepository';
import db from '../database';

export class UserRepo implements UserRepository {
    async save(user: User): Promise<void> {
        const existing = db.prepare('SELECT id FROM users WHERE id = ?').get(user.id);
        if (existing) {
            db.prepare(`
                UPDATE users SET nombre = ?, email = ?, passwordHash = ?, role = ? WHERE id = ?
            `).run(user.nombre, user.email, user.passwordHash, user.role, user.id);
        } else {
            db.prepare(`
                INSERT INTO users (id, nombre, email, passwordHash, role, createdAt)
                VALUES (?, ?, ?, ?, ?, ?)
            `).run(user.id, user.nombre, user.email, user.passwordHash, user.role, user.createdAt.toISOString());
        }
    }

    async findByEmail(email: string): Promise<User | null> {
        const row = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as any;
        if (!row) return null;
        return new User({
            id: row.id,
            nombre: row.nombre,
            email: row.email,
            passwordHash: row.passwordHash,
            role: row.role,
            createdAt: new Date(row.createdAt)
        });
    }

    async findById(id: string): Promise<User | null> {
        const row = db.prepare('SELECT * FROM users WHERE id = ?').get(id) as any;
        if (!row) return null;
        return new User({
            id: row.id,
            nombre: row.nombre,
            email: row.email,
            passwordHash: row.passwordHash,
            role: row.role,
            createdAt: new Date(row.createdAt)
        });
    }
}