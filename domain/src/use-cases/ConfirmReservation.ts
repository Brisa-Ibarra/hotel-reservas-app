import { Reservation } from "../entities/Reservation";
import { ReservationRepository } from "../repositories/ReservationRepository";

export interface ConfirmReservationInput {
    reservationId: string,
    userRole: string,
}

export class ConfirmReservation {
    constructor(private reservationRepository: ReservationRepository){}

    async execute(input:ConfirmReservationInput): Promise<void> {

        if(input.userRole !== 'admin'){
            throw new Error("No tenes permisos para confirmar esta reserva")
        }

        const foundReservation = await this.reservationRepository.findById(input.reservationId)
        if(!foundReservation){
            throw new Error("Reserva no encontrada")
        }

        const confirmReservation = new Reservation({
            id: foundReservation.id,
            userId: foundReservation.userId,
            roomId: foundReservation.roomId,
            startDate: foundReservation.startDate,
            endDate: foundReservation.endDate,
            status: 'confirmed',
            totalPrice: foundReservation.totalPrice,
            createdAt: foundReservation.createdAt
        });
        await this.reservationRepository.save(confirmReservation);
    }
}