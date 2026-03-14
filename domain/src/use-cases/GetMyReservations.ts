import { Reservation } from "../entities/Reservation";
import { ReservationRepository } from "../repositories/ReservationRepository";

export interface GetMyReservationsInput {
    userId: string,
}

export class GetMyReservations {
    constructor(private reservationRepository: ReservationRepository) {}
    async execute(input: GetMyReservationsInput): Promise<Reservation[]> {
        return await this.reservationRepository.findByUserId(input.userId)
    }
}