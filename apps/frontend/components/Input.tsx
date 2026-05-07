interface InputProps {
    label: string;
    type?: 'text' | 'email' | 'password' | 'date';
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    error?: string;
}

export function Input({ label, type = 'text', value, onChange, placeholder, error }: InputProps) {
    return (
        <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">{label}</label>
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className={`px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-500 ${error ? 'border-red-500' : 'border-gray-300'}`}
            />
            {error && <span className="text-sm text-red-500">{error}</span>}
        </div>
    );
}