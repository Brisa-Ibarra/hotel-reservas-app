import { Router, Request, Response } from 'express';
import { CreateRoom } from '@hotel/domain/src/use-cases/CreateRoom';
import { UpdateRoom } from '@hotel/domain/src/use-cases/UpdateRoom';
import { DeleteRoom } from '@hotel/domain/src/use-cases/DeleteRoom';
import { SearchAvailableRooms } from '@hotel/domain/src/use-cases/SearchAvailableRooms';
import { RoomRepo } from '../repositories/RoomRepo';
import { ca } from 'zod/v4/locales';

const router = Router();
const roomRepo = new RoomRepo();
const createRoom = new CreateRoom(roomRepo);
const updateRoom = new UpdateRoom(roomRepo);
const deleteRoom = new DeleteRoom(roomRepo);
const searchAvailable = new SearchAvailableRooms(roomRepo);

router.post('/', async (req: Request, res: Response) => {
    try {
        const {userRole, number, type, price, description} = req.body;
        const room = await createRoom.execute({userRole, number, type, price, description});
        res.status(201).json(room)
    } catch (error: any) {
        res.status(400).json({error: error.message})
    }
})

router.put('/:id', async(req: Request, res: Response)=>{
    try {
        const {userRole, number, type, price, description} = req.body;
        const room = await updateRoom.execute({ userRole, id: req.params.id, number, type, price, description });
        res.status(201).json(room)
    } catch (error: any) {
        res.status(400).json({error: error.message})
    }
}) 

router.delete('/:id',async(req: Request, res: Response) => {
    try{
        const {userRole} = req.body;
        await deleteRoom.execute({roomId: req.params.id, userRole});
        res.status(201).json({message: 'Habitacion eliminada correctamente'})
    } catch(error: any){
        res.status(400).json({error: error.message})
    }
})

router.get('/available',async(req: Request, res: Response)=> {
    try {
        const { startDate, endDate } = req.query;
        const rooms = await searchAvailable.execute({
            startDate: new Date(startDate as string),
            endDate: new Date(endDate as string)
        });
        res.status(201).json(rooms)
    } catch (error: any) {
        res.status(400).json({error: error.message})
    }
})

export default router;