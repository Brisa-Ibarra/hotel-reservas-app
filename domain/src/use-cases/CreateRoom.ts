import { UserRole } from "../entities/User";
import { Room, RoomType, RoomStatus } from "../entities/Room";
import { RoomRepository } from "../repositories/RoomRepository";

export interface CreateRoomInput {
    userRole: UserRole;
    number: string;
    type: RoomType;
    price: number;
    description: string;
}

export class CreateRoom {
    constructor(private readonly roomRepository: RoomRepository) {} 
    async execute(input: CreateRoomInput): Promise<Room> {
        if (input.userRole !== "admin") {
            throw new Error("No tenes permisos para esta accion");
        }
        const room = new Room({
            id: generateId(),
            number: input.number,
            type: input.type,
            price: input.price,
            description: input.description,
            status: "available",
        });
        await this.roomRepository.save(room);
        return room;
    }
    
}
function generateId(): string { 
        return Math.random().toString(36).substring(2) + Date.now().toString(36);
    }