import {expect, it, describe, vi } from 'vitest';
import { GetMyReservations } from './GetMyReservations';
import { ReservationRepository } from '../repositories/ReservationRepository';
import { Reservation } from '../entities/Reservation';

const mockReservation = new Reservation({
    id: '1',
    userId: 'user1',
    roomId: '1',
    startDate: new Date('2027-06-01'),
    endDate: new Date('2027-06-05'),
    status: 'confirmed',
    totalPrice: 400,
    createdAt: new Date()
})

const mockReservationRepository: ReservationRepository = {
    save: vi.fn(),
    findById: vi.fn().mockResolvedValue(mockReservation),
    findAll: vi.fn(),
    findByUserId: vi.fn().mockResolvedValue([mockReservation]),
    findOverlapping: vi.fn()
}

describe('GetMyReservations Caso de Uso', ()=>{
    it('debe retornar las reservas del usuario', async()=>{
        const getMyReservations = new GetMyReservations(mockReservationRepository);
        const result = await getMyReservations.execute({userId: 'user1'});
        expect(mockReservationRepository.findByUserId).toHaveBeenCalledWith('user1');
        expect(result).toHaveLength(1);
    })
})