import { describe, it, expect, vi } from 'vitest';
import { RoomRepository } from "../repositories/RoomRepository";
import { Room } from "../entities/Room";
import { DeleteRoom } from "./DeleteRoom";

const mockRoom = new Room({
    id: '1',
    number: '101',
    type: 'single',
    price: 100,
    description: 'Una habitacion individual',
    status:'available',
});

const mockRoomRepository: RoomRepository = {
    save: vi.fn(),
    findById: vi.fn().mockResolvedValue(mockRoom),
    findAll: vi.fn(),
    findAvailable: vi.fn(),
    delete: vi.fn().mockResolvedValue(true),
};

describe('DeleteRoom Caso de Uso', () => {
    it('debería eliminar una habitacion si es admin', async () => {
        const deleteRoom = new DeleteRoom(mockRoomRepository);
        await deleteRoom.execute({ roomId: '1', userRole: 'admin' });

        expect(mockRoomRepository.findById).toHaveBeenCalledWith('1');
        expect(mockRoomRepository.delete).toHaveBeenCalledWith('1');
    });
    it('debe fallar si no es admin', async () => {
        const deleteRoom = new DeleteRoom(mockRoomRepository);
        await expect(
            deleteRoom.execute({ roomId: '1', userRole: 'guest' })
        ).rejects.toThrow('No tenes permisos');
    });
    it('debe fallar si la habitacion no existe', async () => {
        vi.mocked(mockRoomRepository.findById).mockResolvedValueOnce(null);
        const deleteRoom = new DeleteRoom(mockRoomRepository);
        await expect(
            deleteRoom.execute({ roomId: '999', userRole: 'admin' })
        ).rejects.toThrow('Habitacion no encontrada');
    });
});

