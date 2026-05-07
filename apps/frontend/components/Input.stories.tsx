import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Input } from './Input';

const meta: Meta<typeof Input> = {
    title: 'Components/Input',
    component: Input,
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
    args: {
        label: 'Email',
        type: 'email',
        value: '',
        placeholder: 'brisa@email.com',
    },
};

export const Password: Story = {
    args: {
        label: 'Contraseña',
        type: 'password',
        value: '',
        placeholder: '••••••••',
    },
};

export const WithError: Story = {
    args: {
        label: 'Email',
        type: 'email',
        value: 'emailinvalido',
        error: 'El email no es válido',
    },
};

export const DateInput: Story = {
    args: {
        label: 'Fecha de entrada',
        type: 'date',
        value: '',
    },
};