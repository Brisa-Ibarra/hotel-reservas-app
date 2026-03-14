import { Reservation } from "../entities/Reservation";
import { Room } from "../entities/Room";
import { RoomRepository } from "../repositories/RoomRepository";
import { ReservationRepository } from "../repositories/ReservationRepository";

export interface CreateReservationInput {
    userId: string,
    roomId: string,
    startDate: Date,
    endDate: Date,
}

export class CreateReservation {
    constructor(
        private reservationRepository: ReservationRepository,
        private roomRepository: RoomRepository
    ) {}
    async execute (input: CreateReservationInput): Promise<Reservation> {
        if(input.endDate < input.startDate) {
            throw new Error('La fecha de salida debe ser posterior a la fecha de entrada')
        }
        const room = await this.roomRepository.findById(input.roomId);
        if (!room) {
            throw new Error('Habitacion no encontrada')
        }
        if (room.status === "under_maintenance") {
            throw new Error('La habitacion esta en mantenimiento')
        }
        const overlapping = await this.reservationRepository.findOverlapping(
            input.roomId,
            input.startDate,
            input.endDate
        );
        if (overlapping.length > 0) {
            throw new Error('La habitacion no se encuentra disponible en esas fechas')
        }
        
        const nights = Math.ceil (
            (input.endDate.getTime() - input.startDate.getTime()) / (1000 * 60 * 60 *24)
        );
        const totalPrice = room.price * nights;

        const reservation = new Reservation ({
            id: generateId(),
            userId: input.userId,
            roomId: input.roomId,
            startDate: input.startDate,
            endDate: input.endDate,
            status: 'pending',
            totalPrice: totalPrice,
            createdAt: new Date()
        });
        await this.reservationRepository.save(reservation);
        return reservation;
    }
}
function generateId (): string {
            return Math.random().toString(36).substring(2) + Date.now().toString(36);
        }