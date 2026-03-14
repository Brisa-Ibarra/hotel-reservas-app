import {expect, it, describe, vi} from 'vitest';
import { CreateReservation } from './CreateReservation';
import { ReservationRepository } from '../repositories/ReservationRepository';
import { RoomRepository } from '../repositories/RoomRepository';
import { Room } from '../entities/Room';  

const mockRoom = new Room({
    id: '1',
    number: '101',
    type: 'single',
    price: 100,
    status: 'available',
    description: 'Habitacion individual'
});

const mockRoomRepository: RoomRepository = {
    save: vi.fn(),
    findById: vi.fn().mockResolvedValue(mockRoom),
    findAll: vi.fn(),
    findAvailable: vi.fn(),
    delete: vi.fn(),
};

const mockReservationRepository: ReservationRepository = {
    save: vi.fn(),
    findById: vi.fn(),
    findAll: vi.fn(),
    findByUserId: vi.fn(),
    findOverlapping: vi.fn().mockResolvedValue([]),
};

describe('CreateReservation Caso de Uso', () => {
    it('debe crear una reserva correctamente', async () => {
        const createReservation = new CreateReservation(mockReservationRepository, mockRoomRepository);
        const result = await createReservation.execute({
            userId: 'user1',
            roomId: '1',
            startDate: new Date('2024-07-01'),
            endDate: new Date('2024-07-05'),
        });
        expect(result.userId).toBe('user1');
        expect(result.status).toBe('pending');
        expect(mockReservationRepository.save).toHaveBeenCalled();
    });
    it('debe fallar si la habitacion no existe', async () => {
        vi.mocked(mockRoomRepository.findById).mockResolvedValueOnce(null);
        const createReservation = new CreateReservation(mockReservationRepository, mockRoomRepository);
        await expect(createReservation.execute({
            userId: 'user1',
            roomId: '999',
            startDate: new Date('2024-07-01'),
            endDate: new Date('2024-07-05'),
            })
        ).rejects.toThrow('Habitacion no encontrada');
    });
    it('debe fallar si la habitacion esta en mantenimiento', async () => {
        const roomMaintenance = new Room ({
            id: '1',
            number: '101',
            type: 'single',
            price: 100,
            description: 'una habitacion individual',
            status: 'under_maintenance'
        })
        vi.mocked(mockRoomRepository.findById).mockResolvedValueOnce(roomMaintenance);
        const createReservation = new CreateReservation(mockReservationRepository, mockRoomRepository);
        await expect (
            createReservation.execute ({
                userId: 'user1',
                roomId: '1',
                startDate: new Date('2025-04-06'),
                endDate: new Date('2025-04-10')
            })
        ).rejects.toThrow('La habitacion esta en mantenimiento')
    })
    it('debe fallar si ya hay una reserva en esas fechas', async ()=> {
        vi.mocked(mockReservationRepository.findOverlapping).mockResolvedValueOnce([{} as any]);
        const createReservation = new CreateReservation(mockReservationRepository, mockRoomRepository);
        await expect (
            createReservation.execute ({
                userId: 'user1',
                roomId: '1',
                startDate: new Date('2025-04-06'),
                endDate: new Date('2025-04-10')
            })
        ).rejects.toThrow('La habitacion no se encuentra disponible en esas fechas')
    })
    it('debe fallar si endDate es antes de startDate', async () => {
        const createReservation = new CreateReservation(mockReservationRepository, mockRoomRepository);
        await expect (
            createReservation.execute({
                userId: 'user1',
                roomId: '1',
                startDate: new Date('2025-04-10'),
                endDate: new Date('2025-04-06')
            })
        ).rejects.toThrow('La fecha de salida debe ser posterior a la fecha de entrada')
    })
})
