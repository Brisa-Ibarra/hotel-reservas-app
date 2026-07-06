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
            userId: 'user1',
            userRole: 'guest'
        });
        expect(mockReservationRepository.save).toHaveBeenCalled();
    });

    it('debe fallar si la reserva no existe', async()=>{
        vi.mocked(mockReservationRepository.findById).mockResolvedValueOnce(null);
        const cancelReservation = new CancelReservation(mockReservationRepository);
        await expect (
            cancelReservation.execute({
                reservationId: '999',
                userId: 'user1',
                userRole: 'guest'
            })
        ).rejects.toThrow('Reserva no encontrada')
    });

    it('debe fallar si la reserva no es del usuario', async()=>{
        const cancelReservation = new CancelReservation(mockReservationRepository);
        await expect(
            cancelReservation.execute({
                reservationId: '1',
                userId: 'user2',
                userRole: 'guest'
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
                userId: 'user1',
                userRole: 'guest'
            })
        ).rejects.toThrow('No podes cancelar con menos de 24hs de anticipacion');
    });

    it('debe permitir que un admin cancele aunque falten menos de 24hs', async()=>{
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
        await cancelReservation.execute({
            reservationId: '1',
            userId: 'otroUsuario',
            userRole: 'admin'
        });
        expect(mockReservationRepository.save).toHaveBeenCalled();
    });

    it('debe permitir que un admin cancele la reserva de otro usuario', async()=>{
        const cancelReservation = new CancelReservation(mockReservationRepository);
        await cancelReservation.execute({
            reservationId: '1',
            userId: 'otroUsuario',
            userRole: 'admin'
        });
        expect(mockReservationRepository.save).toHaveBeenCalled();
    });

    it('debe fallar si la reserva ya fue cancelada', async()=>{
        const reservaCancelada = new Reservation({
            id: '1',
            userId: 'user1',
            roomId: '1',
            startDate: new Date('2027-06-01'),
            endDate: new Date('2027-06-05'),
            status: 'cancelled',
            totalPrice: 400,
            createdAt: new Date(),
        });
        vi.mocked(mockReservationRepository.findById).mockResolvedValueOnce(reservaCancelada);
        const cancelReservation = new CancelReservation(mockReservationRepository);
        await expect(
            cancelReservation.execute({
                reservationId: '1',
                userId: 'user1',
                userRole: 'guest'
            })
        ).rejects.toThrow('Esta reserva ya fue cancelada');
    });

    it('debe fallar si la reserva ya fue completada', async()=>{
        const reservaCompletada = new Reservation({
            id: '1',
            userId: 'user1',
            roomId: '1',
            startDate: new Date('2027-06-01'),
            endDate: new Date('2027-06-05'),
            status: 'completed',
            totalPrice: 400,
            createdAt: new Date(),
        });
        vi.mocked(mockReservationRepository.findById).mockResolvedValueOnce(reservaCompletada);
        const cancelReservation = new CancelReservation(mockReservationRepository);
        await expect(
            cancelReservation.execute({
                reservationId: '1',
                userId: 'user1',
                userRole: 'guest'
            })
        ).rejects.toThrow('No podes cancelar una reserva ya completada');
    });
})