import { User } from "../entities/User";
import { UserRepository } from "../repositories/UserRepository";

export interface RegisterUserInput {
    nombre: string;
    email: string;
    password: string;
}

function generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export class RegisterUser {
    constructor(private readonly userRepository: UserRepository) {}

    async execute(input: RegisterUserInput): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(input.email);

    if (existingUser) {
        throw new Error("El email ya está registrado");
    }

    const passwordHash = `hashed_${input.password}`;

    const user = new User({
        id: generateId(),
        nombre: input.nombre,
        email: input.email,
        passwordHash,
        role: "guest",
        createdAt: new Date(),
    });

    await this.userRepository.save(user);

    return user;
    }
}