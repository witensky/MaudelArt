import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Loader2 } from 'lucide-react';
import { useCurrency, SUPPORTED_CURRENCIES } from '../contexts/CurrencyContext';

interface CurrencySelectorProps {
    variant?: 'navbar' | 'compact';
}

const CurrencySelector: React.FC<CurrencySelectorProps> = ({ variant = 'navbar' }) => {
    const { currency, setCurrency, isLoading } = useCurrency();
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const isNavbar = variant === 'navbar';

    return (
        <div ref={ref} className="relative">
            <button
                onClick={() => setOpen(o => !o)}
                className={`flex items-center gap-1.5 transition-all duration-200 ${isNavbar
                        ? 'px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-xs font-bold border border-white/10'
                        : 'px-2 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold border border-emerald-100'
                    }`}
                aria-label="Sélectionner une devise"
            >
                <span>{currency.flag}</span>
                <span>{currency.code}</span>
                {isLoading ? <Loader2 size={10} className="animate-spin opacity-60" /> : <ChevronDown size={10} className={`transition-transform ${open ? 'rotate-180' : ''}`} />}
            </button>

            {open && (
                <div className="absolute right-0 top-full mt-2 z-[9999] bg-white rounded-2xl shadow-2xl border border-black/5 overflow-hidden min-w-[180px]">
                    {SUPPORTED_CURRENCIES.map(c => (
                        <button
                            key={c.code}
                            onClick={() => { setCurrency(c); setOpen(false); }}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-left text-sm transition-colors ${currency.code === c.code
                                    ? 'bg-emerald-50 text-emerald-700 font-black'
                                    : 'text-emerald-950/70 hover:bg-gray-50 font-medium'
                                }`}
                        >
                            <span className="text-base">{c.flag}</span>
                            <span className="flex-1">{c.name}</span>
                            <span className="text-xs font-black opacity-50">{c.symbol}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CurrencySelector;
