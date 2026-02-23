import { Reservation } from "../entities/Reservation";

export interface ReservationRepository {
    save(reservation: Reservation): Promise<void>;
    findById(id: string): Promise<Reservation | null>;
    findByUserId(userId: string): Promise<Reservation[]>;
    findAll(): Promise<Reservation[]>;
    findOverlapping(roomId: string, startDate: Date, endDate: Date): Promise<Reservation[]>;
}