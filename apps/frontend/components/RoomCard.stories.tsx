import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { RoomCard } from './RoomCard';

const meta: Meta<typeof RoomCard> = {
    title: 'Components/RoomCard',
    component: RoomCard,
};

export default meta;
type Story = StoryObj<typeof RoomCard>;

export const Available: Story = {
    args: {
        number: '101',
        type: 'single',
        price: 100,
        description: 'Habitación individual con vista al mar',
        status: 'available',
    },
};

export const Suite: Story = {
    args: {
        number: '201',
        type: 'suite',
        price: 300,
        description: 'Suite de lujo con jacuzzi',
        status: 'available',
    },
};

export const UnderMaintenance: Story = {
    args: {
        number: '102',
        type: 'double',
        price: 150,
        description: 'Habitación doble',
        status: 'under_maintenance',
    },
};