'use client';

import { useState } from 'react';
import { Hotel, Mail, Lock, User } from 'lucide-react';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
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
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md flex flex-col gap-5">
                <div className="text-center">
                    <div className="flex justify-center mb-2">
                        <Hotel size={48} className="text-blue-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800">Hotel Reservas</h1>
                    <p className="text-gray-500 text-sm mt-1">{isRegister ? 'Creá tu cuenta' : 'Bienvenido de vuelta'}</p>
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
                <Button label={isRegister ? 'Crear cuenta' : 'Iniciar sesión'} onClick={handleSubmit} />
                <button
                    onClick={() => setIsRegister(!isRegister)}
                    className="text-sm text-blue-600 hover:underline text-center"
                >
                    {isRegister ? '¿Ya tenés cuenta? Iniciá sesión' : '¿No tenés cuenta? Registrate'}
                </button>
            </div>
        </div>
    );
}