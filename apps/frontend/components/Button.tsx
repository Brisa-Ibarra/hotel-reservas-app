interface ButtonProps {
    label: string;
    onClick?: () => void;
    variant?: 'primary' | 'secondary' | 'danger';
    disabled?: boolean;
}

export function Button({ label, onClick, variant = 'primary', disabled = false }: ButtonProps) {
    const styles = {
        primary: 'bg-[#2D4A2D] hover:bg-[#3D5A3D] text-white',
        secondary: 'bg-[#F5F0E8] hover:bg-[#E8E0D0] text-[#2D4A2D] border border-[#C4A35A]',
        danger: 'bg-red-600 hover:bg-red-700 text-white',
    };

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`px-4 py-2.5 rounded-lg font-medium transition-colors ${styles[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
            {label}
        </button>
    );
}