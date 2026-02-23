import { describe, it, expect, vi } from "vitest";
import { RegisterUser } from "./RegisterUser";
import { UserRepository } from "../repositories/UserRepository";

const mockUserRepository: UserRepository = {
    save: vi.fn(),
    findByEmail: vi.fn(),
    findById: vi.fn(),
};

describe("RegisterUser", () => {
    it("debe registrar un usuario correctamente", async () => {
    vi.mocked(mockUserRepository.findByEmail).mockResolvedValue(null);

    const registerUser = new RegisterUser(mockUserRepository);

    const user = await registerUser.execute({
        nombre: "Brisa",
        email: "brisa@email.com",
        password: "123456",
    });

    expect(user.nombre).toBe("Brisa");
    expect(user.email).toBe("brisa@email.com");
    expect(user.role).toBe("guest");
    expect(mockUserRepository.save).toHaveBeenCalled();
    });

    it("debe fallar si el email ya está registrado", async () => {
    vi.mocked(mockUserRepository.findByEmail).mockResolvedValue({
        id: "1",
        nombre: "Brisa",
        email: "brisa@email.com",
        passwordHash: "hash",
        role: "guest",
        createdAt: new Date(),
        isAdmin: () => false,
        isGuest: () => true,
    });

    const registerUser = new RegisterUser(mockUserRepository);

    await expect(
        registerUser.execute({
        nombre: "Brisa",
        email: "brisa@email.com",
        password: "123456",
        })
    ).rejects.toThrow("El email ya está registrado");
    });
});