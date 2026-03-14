import {expect, it, describe, vi} from 'vitest';
import { CancelReservation } from './CancelReservation';
import { ReservationRepository } from '../repositories/ReservationRepository';
import { Reservation } from '../entities/Reservation';

const mockReservation = new Reservation ({
    id: '1',
    userId: 'user1',
    roomId: '1',
    startDate: new Date('2027-06-01'),
    endDate: new Date('2027-06-05'),
    status: 'confirmed',
    totalPrice: 400,
    createdAt: new Date()
});


const mockReservationRepository: ReservationRepository = {
    save: vi.fn(),
    findById: vi.fn().mockResolvedValue(mockReservation),
    findAll: vi.fn(),
    findByUserId: vi.fn(),
    findOverlapping: vi.fn()
}

describe ('CancelReservation Caso de Uso', ()=>{
    it('debe cancelar correctamente', async () => {
        const cancelReservation = new CancelReservation(mockReservationRepository);
        await cancelReservation.execute({
            reservationId: '1',
            userId: 'user1'
        });
        expect(mockReservationRepository.save).toHaveBeenCalled();
    });
    it('debe fallar si la reserva no existe', async()=>{
        vi.mocked(mockReservationRepository.findById).mockResolvedValueOnce(null);
        const cancelReservation = new CancelReservation(mockReservationRepository);
        await expect (
            cancelReservation.execute({
                reservationId: '999',
                userId: 'user1'
            })
        ).rejects.toThrow('Reserva no encontrada')
    });
    it('debe fallar si la reserva no es del usuario', async()=>{
        const cancelReservation = new CancelReservation(mockReservationRepository);
        await expect(
            cancelReservation.execute({
                reservationId: '1',
                userId: 'user2'
            })
        ).rejects.toThrow('No tenes permisos para cancelar esta reserva')
    });
    it('debe fallar si faltan menos de 24hs para el checkIn', async()=>{
        const reservaSoon = new Reservation({
            id: '1',
            userId: 'user1',
            roomId: '1',
            startDate: new Date(Date.now() + 1000 * 60 * 60 * 2),
            endDate: new Date(Date.now() + 1000 * 60 * 60 * 26),
            status: 'confirmed',
            totalPrice: 400,
            createdAt: new Date(),
        });
        vi.mocked(mockReservationRepository.findById).mockResolvedValueOnce(reservaSoon);
        const cancelReservation = new CancelReservation(mockReservationRepository);
        await expect(
            cancelReservation.execute({
                reservationId: '1',
                userId: 'user1'
            })
        ).rejects.toThrow('No podes cancelar con menos de 24hs de anticipacion');
    });
})