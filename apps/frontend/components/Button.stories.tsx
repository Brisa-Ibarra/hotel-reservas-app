import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
    title: 'Components/Button',
    component: Button,
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
    args: {
        label: 'Reservar',
        variant: 'primary',
    },
};

export const Secondary: Story = {
    args: {
        label: 'Cancelar',
        variant: 'secondary',
    },
};

export const Danger: Story = {
    args: {
        label: 'Eliminar',
        variant: 'danger',
    },
};

export const Disabled: Story = {
    args: {
        label: 'No disponible',
        disabled: true,
    },
};