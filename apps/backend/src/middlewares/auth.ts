import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { UserRole } from '@hotel/domain/src/entities/User';

export interface AuthRequest extends Request {
    user?: { id: string; role: UserRole };
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No autenticado' });
    }
    try {
        const token = authHeader.split(' ')[1];
        const payload = jwt.verify(token, process.env.JWT_SECRET!) as { id: string; role: UserRole };
        req.user = payload;
        next();
    } catch {
        return res.status(401).json({ error: 'Token inválido o expirado' });
    }
}

export function requireAdmin(req: AuthRequest, res: Response, next: NextFunction) {
    if (req.user?.role !== 'admin') {
        return res.status(403).json({ error: 'No tenes permisos para esta acción' });
    }
    next();
}