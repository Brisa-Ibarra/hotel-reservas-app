import { Room } from "../entities/Room";
import { RoomRepository } from "../repositories/RoomRepository";

export interface SearchAvailableRoomsInput {
    startDate: Date,
    endDate: Date
}

export class SearchAvailableRooms {
    constructor(private roomRepository: RoomRepository) {}
    async execute(input:SearchAvailableRoomsInput): Promise<Room[]> {
        return await this.roomRepository.findAvailable(input.startDate, input.endDate)
    }
}