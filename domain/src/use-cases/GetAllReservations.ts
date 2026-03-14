import { Reservation } from "../entities/Reservation";
import { ReservationRepository } from "../repositories/ReservationRepository";

export interface GetAllReservationsInput {
    userRole: string,
}

export class GetAllReservations {
    constructor(private reservationRepository: ReservationRepository) {}
    async execute(input: GetAllReservationsInput): Promise<Reservation[]> {
        if (input.userRole !== 'admin') {
            throw new Error('No tenes permisos para ver todas las reservas');
        }
        return await this.reservationRepository.findAll();
    }
}