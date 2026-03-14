import {expect, it, describe, vi } from 'vitest';
import { GetAllReservations } from './GetAllReservations';
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
    findAll: vi.fn().mockResolvedValue([mockReservation]),
    findByUserId: vi.fn(),
    findOverlapping: vi.fn()
}

describe('GetAllReservations Caso de Uso', ()=> {
    it('debe retornar todas las reservaciones si es admin', async()=>{
        const getAllReservations = new GetAllReservations(mockReservationRepository);
        const result = await getAllReservations.execute({userRole:'admin'});
        expect(mockReservationRepository.findAll).toHaveBeenCalled();
        expect(result).toHaveLength(1);
    });

    it('debe fallar si no es admin', async()=>{
        const getAllReservations = new GetAllReservations(mockReservationRepository);
        await expect(
            getAllReservations.execute({userRole: 'guest'})
        ).rejects.toThrow('No tenes permisos para ver todas las reservas')
    })
})