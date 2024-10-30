import { forwardRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const countries = [
  { code: 'US', flag: '🇺🇸', prefix: '+1' },
  { code: 'BR', flag: '🇧🇷', prefix: '+55' },
];

interface PhoneInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
}

export const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ className, value = '', onChange, error, ...props }, ref) => {
    const [selectedCountry, setSelectedCountry] = useState(countries[0]);
    const [isOpen, setIsOpen] = useState(false);

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const phoneNumber = e.target.value.replace(/\D/g, '');
      onChange?.(selectedCountry.prefix + phoneNumber);
    };

    // Remove country prefix from displayed value
    const displayValue = value?.replace(selectedCountry.prefix, '') || '';

    return (
      <div className="relative">
        <div className="flex">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-1 px-3 py-3 bg-gray-50 border border-r-0 border-gray-200 rounded-l-lg hover:bg-gray-100"
          >
            <span>{selectedCountry.flag}</span>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </button>
          <input
            type="tel"
            value={displayValue}
            onChange={handlePhoneChange}
            ref={ref}
            className={cn(
              "flex-1 rounded-l-none",
              error && "border-red-500 focus:border-red-500 focus:ring-red-500",
              className
            )}
            {...props}
          />
        </div>
        
        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
            {countries.map((country) => (
              <button
                key={country.code}
                onClick={() => {
                  setSelectedCountry(country);
                  setIsOpen(false);
                }}
                className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-50"
              >
                <span>{country.flag}</span>
                <span>{country.prefix}</span>
              </button>
            ))}
          </div>
        )}
        
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }
);

PhoneInput.displayName = 'PhoneInput';