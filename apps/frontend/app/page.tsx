'use client';

import { useState } from 'react';
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
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md flex flex-col gap-4">
                <h1 className="text-2xl font-bold text-center text-blue-600">Hotel Reservas</h1>
                <h2 className="text-lg font-semibold text-center">{isRegister ? 'Registrarse' : 'Iniciar sesión'}</h2>
                {isRegister && (
                    <Input label="Nombre" value={nombre} onChange={setNombre} placeholder="Tu nombre" />
                )}
                <Input label="Email" type="email" value={email} onChange={setEmail} placeholder="tu@email.com" />
                <Input label="Contraseña" type="password" value={password} onChange={setPassword} placeholder="••••••••" />
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <Button label={isRegister ? 'Registrarse' : 'Iniciar sesión'} onClick={handleSubmit} />
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