import {expect, describe, it ,vi} from 'vitest';
import { UpdateRoom } from './UpdateRoom';
import { RoomRepository } from '../repositories/RoomRepository';
import { Room } from '../entities/Room';

const mockRoom = new Room({
    id: '1',
    number: '101',
    type: 'single',
    price: 100,
    description: 'Habitación individual',
    status: 'available',
});

const mockRoomRepository: RoomRepository = {
    save: vi.fn(),
    findById: vi.fn().mockResolvedValue(mockRoom),
    findAll: vi.fn(),
    findAvailable: vi.fn(),
    delete: vi.fn(),
};  

describe('UpdateRoom Caso de Uso', () => {
    it('debe actualizar la habitacion si es admin', async () => {
        const updateRoom = new UpdateRoom(mockRoomRepository);
        const result = await updateRoom.execute({
            userRole: 'admin',
            id: '1',
            number: '101',
            type: 'double' as const,
            price: 150,
            description: 'Habitación doble',
        });
        expect(mockRoomRepository.findById).toHaveBeenCalled();
        expect(mockRoomRepository.save).toHaveBeenCalled();
        expect(result.type).toBe('double');
    });
    it('debe fallar si no es admin', async () => {
        const updateRoom = new UpdateRoom(mockRoomRepository);
        await expect(updateRoom.execute({
            userRole: 'guest',
            id: '1',
            number: '101',
            type: 'double' as const,
            price: 150,
            description: 'Habitación doble',
        })
    ).rejects.toThrow('No tenes permisos para esta accion');
    });
    it('debe fallar si la habitacion no existe', async () => {
        const updateRoom = new UpdateRoom(mockRoomRepository);
        mockRoomRepository.findById = vi.fn().mockResolvedValue(null); 
        await expect(updateRoom.execute({
            userRole: 'admin',
            id: '999',
            number: '101',
            type: 'double' as const,
            price: 150,
            description: 'Habitación doble',
            })
        ).rejects.toThrow('Habitacion no encontrada');
    });
});