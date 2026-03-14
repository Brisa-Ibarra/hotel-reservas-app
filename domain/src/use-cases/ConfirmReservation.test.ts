import { expect, it, describe, vi } from 'vitest';
import { ConfirmReservation } from './ConfirmReservation';
import { ReservationRepository } from '../repositories/ReservationRepository';
import { Reservation } from '../entities/Reservation';

const mockReservation = new Reservation({
    id: '1',
    userId: 'user1',
    roomId: '1',
    startDate: new Date('2027-06-01'),
    endDate: new Date('2027-06-05'),
    status: 'pending',
    totalPrice: 400,
    createdAt: new Date()
})

const mockReservationRepository: ReservationRepository = {
    save: vi.fn(),
    findById: vi.fn().mockResolvedValue(mockReservation),
    findAll: vi.fn(),
    findByUserId: vi.fn(),
    findOverlapping: vi.fn()
}

describe('ConfirmReservation Caso de Uso', ()=>{
    it('debe confirmar una reserva', async() =>{
        const confirmReservation = new ConfirmReservation(mockReservationRepository);
        await confirmReservation.execute({
            reservationId: '1',
            userRole:'admin'
        });
        expect(mockReservationRepository.save).toHaveBeenCalled();
    });
    it('debe fallar si no sos admin', async() =>{
        const confirmReservation = new ConfirmReservation(mockReservationRepository);
        await expect (
            confirmReservation.execute({
                reservationId: '1',
                userRole: 'guest'
            })
        ).rejects.toThrow('No tenes permisos para confirmar esta reserva')
    });
    it('debe fallar si la reserva no existe', async()=>{
        vi.mocked(mockReservationRepository.findById).mockResolvedValueOnce(null);
        const confirmReservation = new ConfirmReservation(mockReservationRepository);
        await expect (
            confirmReservation.execute({
                reservationId: '999',
                userRole: 'admin'
            })
        ).rejects.toThrow('Reserva no encontrada')
    })
})