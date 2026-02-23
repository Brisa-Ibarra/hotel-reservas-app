import {expect, describe, it, vi} from 'vitest';
import { CreateRoom } from './CreateRoom';
import { RoomRepository } from '../repositories/RoomRepository';

const mockRoomRepository: RoomRepository = {
    save: vi.fn(),
    findById: vi.fn(),
    findAll: vi.fn(),
    findAvailable: vi.fn(),
    delete: vi.fn(),
};

describe('CreateRoom Caso de Uso', () => {
    it('debe crear una nueva habitacion correctamente si es admin', async () => {
        const createRoom = new CreateRoom(mockRoomRepository); 
        const result = await createRoom.execute({
            userRole: 'admin',
            number: '101',
            type: 'single' as const,
            price: 100,
            description: 'Habitación individual con vista al mar',
        });
        expect(mockRoomRepository.save).toHaveBeenCalled();
        expect(result.number).toBe('101');
        expect(result.type).toBe('single');
    });
    it('debe fallar si no es admin', async () => {
        const createRoom = new CreateRoom(mockRoomRepository);
        await expect(createRoom.execute({
            userRole: 'guest',
            number: '102',
            type: 'single' as const,
            price: 150,
            description: 'Habitación individual',
        })
    ).rejects.toThrow('No tenes permisos para esta accion');
    })
}); 