import { UserRole } from "../entities/User";
import { RoomRepository } from "../repositories/RoomRepository";
import { Room } from "../entities/Room";

interface DeleteRoomRequest {
    roomId: string;
    userRole: UserRole;
}

export class DeleteRoom {
    constructor(private roomRepository: RoomRepository) {}
    async execute(request: DeleteRoomRequest): Promise<void> {
        const { roomId, userRole } = request;
        if (userRole !== 'admin') {
            throw new Error('No tenes permisos');
        }

        const room = await this.roomRepository.findById(roomId);
        if (!room) {
            throw new Error('Habitacion no encontrada');
        }
        await this.roomRepository.delete(roomId);
    }
}   