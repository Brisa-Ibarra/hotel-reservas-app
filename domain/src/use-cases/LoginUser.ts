import { User } from "../entities/User";
import { UserRepository } from "../repositories/UserRepository";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export interface LoginUserInput {
    email: string;
    password: string;
}

export interface LoginUserOutput {
    user: User;
    token: string;
}

export class LoginUser {
    constructor(private readonly userRepository: UserRepository) {}

    async execute(input: LoginUserInput): Promise<LoginUserOutput> {
        const user = await this.userRepository.findByEmail(input.email);
        if (!user) {
            throw new Error("Mail incorrecto");
        }

        const isValid = await bcrypt.compare(input.password, user.passwordHash);
        if (!isValid) {
            throw new Error("Contraseña incorrecta");
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET!,
            { expiresIn: '2h' }
        );

        return { user, token };
    }
}