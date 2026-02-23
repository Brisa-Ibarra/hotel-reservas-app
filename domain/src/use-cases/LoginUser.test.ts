import { describe, it, expect, vi } from "vitest";
import { LoginUser } from './LoginUser';
import { UserRepository } from '../repositories/UserRepository';
import { User } from '../entities/User';    

const mockUser = new User ({
    id: '1',
    nombre: 'Brisa Ibarra',
    email: 'brisaibarra@email.com',
    passwordHash:'hashed_123456',
    role: 'guest',
    createdAt: new Date(),
})

const mockUserRepository: UserRepository = {
    save: vi.fn(),
    findByEmail: vi.fn(),
    findById: vi.fn(),
};

describe('LoginUser', () => {
    it ('debe loguear un usuario correctamente', async () => {
        vi.mocked(mockUserRepository.findByEmail).mockResolvedValue(mockUser);
        const loginUser = new LoginUser(mockUserRepository);
        const result = await loginUser.execute({
            email: 'brisaibarra@email.com',
            password: '123456',
        });
        expect(result.user.email).toBe("brisaibarra@email.com");
        expect(result.token).toBeDefined();
    });
    it('debe fallar si el mail no existe', async ()=> {
        vi.mocked(mockUserRepository.findByEmail).mockResolvedValue(null);
        const loginUser = new LoginUser(mockUserRepository);
        await expect (
            loginUser.execute({
                email: 'cualquier@mail.com',
                password: '123456',
            })
        ).rejects.toThrow('Mail incorrecto');
    });
    it('debe fallar si la contraseña es incorrecta', async () => {
        vi.mocked(mockUserRepository.findByEmail).mockResolvedValue(mockUser);
        const loginUser = new LoginUser(mockUserRepository);
        await expect(
            loginUser.execute({
                email:'brisaibarra@email.com',
                password: 'password_incorrecta',
            })
        ).rejects.toThrow('Contraseña incorrecta');
    });
})