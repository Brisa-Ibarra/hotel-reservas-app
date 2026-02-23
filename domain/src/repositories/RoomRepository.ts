import { Room } from "../entities/Room";

export interface RoomRepository {
    save(room: Room): Promise<void>;
    findById(id: string): Promise<Room | null>;
    findAll(): Promise<Room[]>;
    findAvailable(startDate: Date, endDate: Date): Promise<Room[]>;
    delete(id: string): Promise<void>;
}