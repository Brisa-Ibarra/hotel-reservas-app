import {User} from "../entities/User";
import {UserRepository} from "../repositories/UserRepository";

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
        const passwordHash = `hashed_${input.password}`; 
        if (user.passwordHash !== passwordHash) {
            throw new Error("Contraseña incorrecta");
        }   
        return {
            user,
            token: "token_" + user.id
        };
    }
}