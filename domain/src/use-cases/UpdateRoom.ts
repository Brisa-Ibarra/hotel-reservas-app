import { UserRole } from "../entities/User";
import { Room, RoomType, RoomStatus } from "../entities/Room";
import { RoomRepository } from "../repositories/RoomRepository";

interface UpdateRoomInput {
    userRole: UserRole;
    id: string;
    number: string;
    type: RoomType;
    price: number;
    description: string;
    status: RoomStatus;
}

export class UpdateRoom {
    constructor(private roomRepository: RoomRepository) {}

    async execute(data: UpdateRoomInput): Promise<Room> {
        if (data.userRole !== 'admin') {
            throw new Error('No tenes permisos para esta accion');
        }
        const room = await this.roomRepository.findById(data.id);
        if (!room) {
            throw new Error('Habitacion no encontrada');
        }
        const updatedRoom = new Room({
            id: data.id,
            number: data.number,
            type: data.type,
            price: data.price,
            description: data.description,
            status: data.status, 
        });
        await this.roomRepository.save(updatedRoom);
        return updatedRoom;
    }
}