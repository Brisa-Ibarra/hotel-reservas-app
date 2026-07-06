'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Input } from '../components/Input';
import { api } from '../services/api';

export default function LoginPage() {
    const [isRegister, setIsRegister] = useState(false);
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        try {
            if (isRegister) {
                await api.post('/users/register', { nombre, email, password });
                setIsRegister(false);
                setError('');
            } else {
                const result = await api.post('/users/login', { email, password });
                if (result.error) {
                    setError(result.error);
                    return;
                }
                localStorage.setItem('token', result.token);
                localStorage.setItem('role', result.role);
                localStorage.setItem('userId', result.userId);
                localStorage.setItem('email', email);
                window.location.href = '/rooms';
            }
        } catch (e) {
            setError('Ocurrió un error, intentá de nuevo');
        }
    };

    return (
        <div className="min-h-screen flex">
            <div className="hidden md:flex w-1/2 bg-[#2D4A2D] items-center justify-center flex-col gap-4 p-12">
                <Image
                    src="/logo.png"
                    alt="Gran Hotel Uspallata"
                    width={200}
                    height={174}
                />
                <h1 className="text-4xl font-bold text-white text-center">Gran Hotel Uspallata</h1>
                <p className="text-[#C4A35A] text-center text-lg tracking-widest uppercase">Un auténtico hotel de montaña</p>
                <p className="text-white/60 text-center mt-4 text-sm">Rodeado de las majestuosas montañas de Mendoza, te esperamos para una experiencia única.</p>
            </div>
            <div className="w-full md:w-1/2 bg-[#F5F0E8] flex items-center justify-center p-8">
                <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md flex flex-col gap-5">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-[#2D4A2D]">{isRegister ? 'Crear cuenta' : 'Bienvenido'}</h2>
                        <p className="text-gray-500 text-sm mt-1">{isRegister ? 'Registrate para hacer tu reserva' : 'Iniciá sesión para continuar'}</p>
                    </div>
                    {isRegister && (
                        <Input label="Nombre" value={nombre} onChange={setNombre} placeholder="Tu nombre" />
                    )}
                    <Input label="Email" type="email" value={email} onChange={setEmail} placeholder="tu@email.com" />
                    <Input label="Contraseña" type="password" value={password} onChange={setPassword} placeholder="••••••••" />
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">
                            {error}
                        </div>
                    )}
                    <button
                        onClick={handleSubmit}
                        className="bg-[#2D4A2D] hover:bg-[#3D5A3D] text-white px-4 py-3 rounded-lg font-medium transition-colors w-full"
                    >
                        {isRegister ? 'Crear cuenta' : 'Iniciar sesión'}
                    </button>
                    <button
                        onClick={() => setIsRegister(!isRegister)}
                        className="text-sm text-[#8B6914] hover:underline text-center"
                    >
                        {isRegister ? '¿Ya tenés cuenta? Iniciá sesión' : '¿No tenés cuenta? Registrate'}
                    </button>
                </div>
            </div>
        </div>
    );
}