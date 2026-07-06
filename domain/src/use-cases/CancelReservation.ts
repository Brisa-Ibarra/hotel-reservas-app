import { Reservation } from "../entities/Reservation";
import { ReservationRepository } from "../repositories/ReservationRepository";
import { UserRole } from "../entities/User";

export interface CancelReservationInput {
    userId: string,
    userRole: UserRole,
    reservationId: string
}

export class CancelReservation {
    constructor(private reservationRepository: ReservationRepository) {}

    async execute(input: CancelReservationInput): Promise<void> {
        const reservation = await this.reservationRepository.findById(input.reservationId)
        if (!reservation) {
            throw new Error("Reserva no encontrada")
        }

        const isOwner = reservation.userId === input.userId;
        const isAdmin = input.userRole === 'admin';

        if (!isOwner && !isAdmin) {
            throw new Error("No tenes permisos para cancelar esta reserva")
        }

        if (reservation.status === 'cancelled') {
            throw new Error("Esta reserva ya fue cancelada")
        }
        if (reservation.status === 'completed') {
            throw new Error("No podes cancelar una reserva ya completada")
        }

        if (!isAdmin) {
            const horasCheckIn = (reservation.startDate.getTime() - Date.now()) / (1000 * 60 * 60);
            if (horasCheckIn < 24) {
                throw new Error("No podes cancelar con menos de 24hs de anticipacion")
            }
        }

        const cancelledReservation = new Reservation({
            id: reservation.id,
            userId: reservation.userId,
            roomId: reservation.roomId,
            startDate: reservation.startDate,
            endDate: reservation.endDate,
            status: 'cancelled',
            totalPrice: reservation.totalPrice,
            createdAt: reservation.createdAt
        });
        await this.reservationRepository.save(cancelledReservation);
    }
}
