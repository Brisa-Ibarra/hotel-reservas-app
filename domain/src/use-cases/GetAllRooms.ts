import { Room } from "../entities/Room";
import { RoomRepository } from "../repositories/RoomRepository";
import { UserRole } from "../entities/User";

export interface GetAllRoomsInput {
    userRole: UserRole;
}

export class GetAllRooms {
    constructor(private roomRepository: RoomRepository) {}
    async execute(input: GetAllRoomsInput): Promise<Room[]> {
        if (input.userRole !== 'admin') {
            throw new Error('No tenes permisos para esta accion');
        }
        return await this.roomRepository.findAll();
    }
}