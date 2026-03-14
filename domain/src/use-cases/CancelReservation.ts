import { Reservation } from "../entities/Reservation";
import { ReservationRepository } from "../repositories/ReservationRepository";

export interface CancelReservationInput {
    userId: string,
    reservationId: string
}

export class CancelReservation {
    constructor(private reservationRepository: ReservationRepository) {}

    async execute(input: CancelReservationInput): Promise<void> {
        const reservation = await this.reservationRepository.findById(input.reservationId)
        if (!reservation) {
            throw new Error("Reserva no encontrada")
        }

        if(reservation.userId !== input.userId){
            throw new Error("No tenes permisos para cancelar esta reserva")
        }

        const horasCheckIn = (reservation.startDate.getTime() - Date.now()) / (1000 * 60 * 60);
        if(horasCheckIn < 24){
            throw new Error("No podes cancelar con menos de 24hs de anticipacion")
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
