import { Router, Response } from 'express';
import { CreateReservation } from '@hotel/domain/src/use-cases/CreateReservation';
import { CancelReservation } from '@hotel/domain/src/use-cases/CancelReservation';
import { ConfirmReservation } from '@hotel/domain/src/use-cases/ConfirmReservation';
import { GetMyReservations } from '@hotel/domain/src/use-cases/GetMyReservations';
import { GetAllReservations } from '@hotel/domain/src/use-cases/GetAllReservations';
import { ReservationRepo } from '../repositories/ReservationRepo';
import { RoomRepo } from '../repositories/RoomRepo';
import { requireAuth, requireAdmin, AuthRequest } from '../middlewares/auth';

const router = Router();
const reservationRepo = new ReservationRepo();
const roomRepo = new RoomRepo();
const createReservation = new CreateReservation(reservationRepo, roomRepo);
const cancelReservation = new CancelReservation(reservationRepo);
const confirmReservation = new ConfirmReservation(reservationRepo);
const getMyReservations = new GetMyReservations(reservationRepo);
const getAllReservations = new GetAllReservations(reservationRepo);

router.post('/', requireAuth, async (req: AuthRequest, res: Response) => {
    try {
        const { roomId, startDate, endDate } = req.body;
        const reservation = await createReservation.execute({
            userId: req.user!.id,
            roomId,
            startDate: new Date(startDate),
            endDate: new Date(endDate)
        });
        res.status(201).json(reservation);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

router.put('/:id/cancel', requireAuth, async (req: AuthRequest, res: Response) => {
    try {
        await cancelReservation.execute({
            reservationId: req.params.id,
            userId: req.user!.id,
            userRole: req.user!.role
        });
        res.status(200).json({ message: 'Reserva cancelada correctamente' });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

router.put('/:id/confirm', requireAuth, requireAdmin, async (req: AuthRequest, res: Response) => {
    try {
        await confirmReservation.execute({ reservationId: req.params.id, userRole: req.user!.role });
        res.status(200).json({ message: 'Reserva confirmada correctamente' });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/my/:userId', requireAuth, async (req: AuthRequest, res: Response) => {
    try {
        if (req.user!.role !== 'admin' && req.user!.id !== req.params.userId) {
            return res.status(403).json({ error: 'No podes ver reservas de otro usuario' });
        }
        const reservations = await getMyReservations.execute({ userId: req.params.userId });
        const reservationsWithRoom = await Promise.all(
            reservations.map(async (r) => {
                const room = await roomRepo.findById(r.roomId);
                return { ...r, roomNumber: room?.number ?? r.roomId };
            })
        );
        res.status(200).json(reservationsWithRoom);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/', requireAuth, requireAdmin, async (req: AuthRequest, res: Response) => {
    try {
        const reservations = await getAllReservations.execute({ userRole: req.user!.role });
        const reservationsWithRoom = await Promise.all(
            reservations.map(async (r) => {
                const room = await roomRepo.findById(r.roomId);
                return { ...r, roomNumber: room?.number ?? r.roomId };
            })
        );
        res.status(200).json(reservationsWithRoom);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

export default router;