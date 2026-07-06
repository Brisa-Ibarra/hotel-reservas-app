import { Router, Response } from 'express';
import { CreateRoom } from '@hotel/domain/src/use-cases/CreateRoom';
import { UpdateRoom } from '@hotel/domain/src/use-cases/UpdateRoom';
import { DeleteRoom } from '@hotel/domain/src/use-cases/DeleteRoom';
import { GetAllRooms } from '@hotel/domain/src/use-cases/GetAllRooms';
import { SearchAvailableRooms } from '@hotel/domain/src/use-cases/SearchAvailableRooms';
import { RoomRepo } from '../repositories/RoomRepo';
import { requireAuth, requireAdmin, AuthRequest } from '../middlewares/auth';

const router = Router();
const roomRepo = new RoomRepo();
const createRoom = new CreateRoom(roomRepo);
const updateRoom = new UpdateRoom(roomRepo);
const deleteRoom = new DeleteRoom(roomRepo);
const getAllRooms = new GetAllRooms(roomRepo);
const searchAvailable = new SearchAvailableRooms(roomRepo);

router.get('/', requireAuth, requireAdmin, async (req: AuthRequest, res: Response) => {
    try {
        const rooms = await getAllRooms.execute({ userRole: req.user!.role });
        res.status(200).json(rooms);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/available', requireAuth, async (req: AuthRequest, res: Response) => {
    try {
        const { startDate, endDate } = req.query;
        const rooms = await searchAvailable.execute({
            startDate: new Date(startDate as string),
            endDate: new Date(endDate as string)
        });
        res.status(200).json(rooms);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

router.post('/', requireAuth, requireAdmin, async (req: AuthRequest, res: Response) => {
    try {
        const { number, type, price, description } = req.body;
        const room = await createRoom.execute({ userRole: req.user!.role, number, type, price, description });
        res.status(201).json(room);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

router.put('/:id', requireAuth, requireAdmin, async (req: AuthRequest, res: Response) => {
    try {
        const { number, type, price, description, status } = req.body;
        const room = await updateRoom.execute({
            userRole: req.user!.role,
            id: req.params.id,
            number, type, price, description, status
        });
        res.status(200).json(room);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

router.delete('/:id', requireAuth, requireAdmin, async (req: AuthRequest, res: Response) => {
    try {
        await deleteRoom.execute({ roomId: req.params.id, userRole: req.user!.role });
        res.status(200).json({ message: 'Habitacion eliminada correctamente' });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

export default router;