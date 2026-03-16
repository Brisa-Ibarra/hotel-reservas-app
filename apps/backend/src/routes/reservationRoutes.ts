import { Router, Request, Response } from 'express';
import { CreateReservation } from '@hotel/domain/src/use-cases/CreateReservation';
import { CancelReservation } from '@hotel/domain/src/use-cases/CancelReservation';
import { ConfirmReservation } from '@hotel/domain/src/use-cases/ConfirmReservation';
import { GetMyReservations } from '@hotel/domain/src/use-cases/GetMyReservations';
import { GetAllReservations } from '@hotel/domain/src/use-cases/GetAllReservations';
import { ReservationRepo } from '../repositories/ReservationRepo';
import { RoomRepo } from '../repositories/RoomRepo';

const router = Router();
const reservationRepo = new ReservationRepo();
const roomRepo = new RoomRepo();
const createReservation = new CreateReservation(reservationRepo, roomRepo);
const cancelReservation = new CancelReservation(reservationRepo);
const confirmReservation = new ConfirmReservation(reservationRepo);
const getMyReservations = new GetMyReservations(reservationRepo);
const getAllReservations = new GetAllReservations(reservationRepo);

router.post('/', async (req: Request, res: Response)=> {
    try {
        const {userId, roomId, startDate, endDate} = req.body;
        const reservation = await createReservation.execute({
            userId,
            roomId,
            startDate: new Date(startDate),
            endDate: new Date(endDate)
        });
        res.status(201).json(reservation)
    } catch (error: any) {
        res.status(400).json({error: error.message})
    }
});

router.put('/:id/cancel', async(req: Request, res: Response)=> {
    try {
        const {userId} = req.body;
        await cancelReservation.execute({reservationId: req.params.id, userId});
        res.status(201).json({message: 'Reserva cancelada correctamente'})
    } catch (error: any) {
        res.status(400).json({error: error.message})
    }
})

router.put('/:id/confirm', async(req: Request, res: Response)=> {
    try {
        const {userRole} = req.body;
        await confirmReservation.execute({reservationId: req.params.id, userRole});
        res.status(201).json({message: 'Reserva confirmada correctamente'})
    } catch(error: any){
        res.status(400).json({error: error.message})
    }
})

router.get('/my/:userId', async(req: Request, res: Response)=> {
    try {
        const reservations = await getMyReservations.execute({userId: req.params.userId});
        res.status(200).json(reservations);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/', async (req: Request, res: Response) => {
    try {
        const { userRole } = req.query;
        const reservations = await getAllReservations.execute({ userRole: userRole as string });
        res.status(200).json(reservations);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

export default router;