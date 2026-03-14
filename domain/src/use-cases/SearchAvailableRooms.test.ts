import { expect, it, describe, vi } from 'vitest';
import { SearchAvailableRooms } from './SearchAvailableRooms';
import { RoomRepository } from '../repositories/RoomRepository';
import { Room } from '../entities/Room';

const mockRoom = new Room({
    id: '1',
    number: '101',
    type: 'single',
    price: 100,
    description: 'Habitacion individual',
    status: 'available'
});

const mockRoomRepository: RoomRepository = {
    save: vi.fn(),
    findById: vi.fn(),
    findAll: vi.fn(),
    findAvailable: vi.fn().mockResolvedValue([mockRoom]),
    delete: vi.fn()
};

describe('SearchAvailableRooms Caso de Uso', ()=> {
    it('debe retornar las habitaciones disponibles', async()=>{
        const searchRooms = new SearchAvailableRooms(mockRoomRepository);
        const startDate = new Date('2027-06-01');
        const endDate = new Date('2027-06-05');

        const result = await  searchRooms.execute({startDate, endDate})
        expect(mockRoomRepository.findAvailable).toHaveBeenCalledWith(startDate, endDate);
        expect(result).toHaveLength(1);
        expect(result[0].number).toBe('101');
    })
})