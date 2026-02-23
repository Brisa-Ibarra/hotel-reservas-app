export type UserRole = 'admin' | 'guest';

export interface UserProps {
    id: string;
    nombre: string;
    email: string;
    passwordHash: string;
    role: UserRole;
    createdAt: Date;
}

export class User {
    readonly id: string;
    readonly nombre: string;
    readonly email: string;
    readonly passwordHash: string;
    readonly role: UserRole;
    readonly createdAt: Date;  
    
    constructor (props: UserProps) {
        this.id = props.id;
        this.nombre = props.nombre;
        this.email = props.email;
        this.passwordHash = props.passwordHash;
        this.role = props.role;
        this.createdAt = props.createdAt;
    }  
    isAdmin(): boolean {
        return this.role === 'admin';
    } 

    isGuest(): boolean {
        return this.role === 'guest';
    }    
}
