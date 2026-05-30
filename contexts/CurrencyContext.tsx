import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────
export interface Currency {
    code: string;
    symbol: string;
    name: string;
    flag: string;
}

export const SUPPORTED_CURRENCIES: Currency[] = [
    { code: 'EUR', symbol: '€', name: 'Euro', flag: '🇪🇺' },
    { code: 'USD', symbol: '$', name: 'Dollar US', flag: '🇺🇸' },
    { code: 'CAD', symbol: '$', name: 'Dollar CAD', flag: '🇨🇦' },
    { code: 'HTG', symbol: 'G', name: 'Gourde Haïtienne', flag: '🇭🇹' },
    { code: 'GBP', symbol: '£', name: 'Livre Sterling', flag: '🇬🇧' },
    { code: 'CHF', symbol: 'Fr', name: 'Franc Suisse', flag: '🇨🇭' },
];

// Offline fallback rates (relative to EUR)
const FALLBACK_RATES: Record<string, number> = {
    EUR: 1,
    USD: 1.09,
    CAD: 1.49,
    HTG: 143,
    GBP: 0.86,
    CHF: 0.97,
};

interface CurrencyContextType {
    currency: Currency;
    setCurrency: (c: Currency) => void;
    rates: Record<string, number>;
    convert: (amountEUR: number) => string;
    formatPrice: (amountEUR: number | null) => string;
    isLoading: boolean;
    autoDetect: boolean;
    setAutoDetect: (v: boolean) => void;
}

const CurrencyContext = createContext<CurrencyContextType | null>(null);

// ─── Currency detection by navigator.language ─────────────────────────────────
function detectCurrencyByLocale(): Currency {
    const lang = navigator.language || 'fr-FR';
    if (lang.includes('CA')) return SUPPORTED_CURRENCIES.find(c => c.code === 'CAD')!;
    if (lang.includes('GB')) return SUPPORTED_CURRENCIES.find(c => c.code === 'GBP')!;
    if (lang.includes('CH')) return SUPPORTED_CURRENCIES.find(c => c.code === 'CHF')!;
    if (lang.startsWith('ht') || lang.includes('HT')) return SUPPORTED_CURRENCIES.find(c => c.code === 'HTG')!;
    if (lang.startsWith('en-US') || lang.startsWith('en-us')) return SUPPORTED_CURRENCIES.find(c => c.code === 'USD')!;
    return SUPPORTED_CURRENCIES.find(c => c.code === 'EUR')!;
}

// ─── Provider ────────────────────────────────────────────────────────────────
export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [rates, setRates] = useState<Record<string, number>>(FALLBACK_RATES);
    const [isLoading, setIsLoading] = useState(false);
    const [autoDetect, setAutoDetect] = useState(() => {
        const stored = localStorage.getItem('maudel_currency_autodetect');
        return stored === null ? true : stored === 'true';
    });
    const [currency, setCurrencyState] = useState<Currency>(() => {
        const savedCode = localStorage.getItem('maudel_currency');
        if (savedCode && !autoDetect) {
            return SUPPORTED_CURRENCIES.find(c => c.code === savedCode) || SUPPORTED_CURRENCIES[0];
        }
        return detectCurrencyByLocale();
    });

    // Fetch live exchange rates (EUR base)
    useEffect(() => {
        const fetchRates = async () => {
            setIsLoading(true);
            try {
                const res = await fetch('https://api.exchangerate-api.com/v4/latest/EUR');
                if (!res.ok) throw new Error('rate fetch failed');
                const data = await res.json();
                setRates(data.rates);
            } catch {
                // Use fallback — already set as default
            } finally {
                setIsLoading(false);
            }
        };
        fetchRates();
    }, []);

    // Auto-detect on locale if enabled
    useEffect(() => {
        if (autoDetect) {
            setCurrencyState(detectCurrencyByLocale());
        }
        localStorage.setItem('maudel_currency_autodetect', String(autoDetect));
    }, [autoDetect]);

    const setCurrency = useCallback((c: Currency) => {
        setCurrencyState(c);
        localStorage.setItem('maudel_currency', c.code);
        setAutoDetect(false);
    }, []);

    // Convert a price expressed in EUR to the selected currency
    const convert = useCallback((amountEUR: number): string => {
        const rate = rates[currency.code] ?? FALLBACK_RATES[currency.code] ?? 1;
        const converted = amountEUR * rate;
        // Round sensibly
        const rounded = currency.code === 'HTG'
            ? Math.round(converted / 10) * 10
            : Math.round(converted * 100) / 100;
        return `${currency.symbol}\u00a0${rounded.toLocaleString('fr-FR')}`;
    }, [currency, rates]);

    // For artworks without a fixed price, return "Sur demande"
    const formatPrice = useCallback((amountEUR: number | null): string => {
        if (amountEUR === null || amountEUR === 0) return 'Sur demande';
        return convert(amountEUR);
    }, [convert]);

    return (
        <CurrencyContext.Provider value={{ currency, setCurrency, rates, convert, formatPrice, isLoading, autoDetect, setAutoDetect }}>
            {children}
        </CurrencyContext.Provider>
    );
};

export const useCurrency = (): CurrencyContextType => {
    const ctx = useContext(CurrencyContext);
    if (!ctx) throw new Error('useCurrency must be used within CurrencyProvider');
    return ctx;
};
