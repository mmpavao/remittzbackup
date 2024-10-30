import { useState, useEffect, useRef } from 'react';
import { Search, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Bank {
  id: string;
  name: string;
  code: string;
  logo?: string;
}

interface BankSelectorProps {
  selectedBank: Bank | null;
  onSelect: (bank: Bank) => void;
  country: string;
  error?: string;
}

const banksByCountry: Record<string, Bank[]> = {
  'United States': [
    { id: 'chase', name: 'Chase', code: 'CHASUS33', logo: 'https://logo.clearbit.com/chase.com' },
    { id: 'bofa', name: 'Bank of America', code: 'BOFAUS3N', logo: 'https://logo.clearbit.com/bankofamerica.com' },
    { id: 'wells', name: 'Wells Fargo', code: 'WFBIUS6S', logo: 'https://logo.clearbit.com/wellsfargo.com' },
    { id: 'citi', name: 'Citibank', code: 'CITIUS33', logo: 'https://logo.clearbit.com/citibank.com' }
  ],
  'Brazil': [
    { id: 'itau', name: 'Itaú Unibanco', code: 'ITAUBRSP', logo: 'https://logo.clearbit.com/itau.com.br' },
    { id: 'bradesco', name: 'Banco Bradesco', code: 'BBDEBRSP', logo: 'https://logo.clearbit.com/bradesco.com.br' },
    { id: 'santander-br', name: 'Santander Brasil', code: 'BSCHBRSP', logo: 'https://logo.clearbit.com/santander.com.br' },
    { id: 'bb', name: 'Banco do Brasil', code: 'BRASBRRJ', logo: 'https://logo.clearbit.com/bb.com.br' },
    { id: 'caixa', name: 'Caixa Econômica Federal', code: 'CEFXBRSP', logo: 'https://logo.clearbit.com/caixa.gov.br' }
  ],
  'European Union': [
    { id: 'deutsche', name: 'Deutsche Bank', code: 'DEUTDEFF', logo: 'https://logo.clearbit.com/deutsche-bank.de' },
    { id: 'bnp', name: 'BNP Paribas', code: 'BNPAFRPP', logo: 'https://logo.clearbit.com/bnpparibas.com' },
    { id: 'santander-eu', name: 'Banco Santander', code: 'BSCHESMMXXX', logo: 'https://logo.clearbit.com/santander.com' },
    { id: 'ing', name: 'ING Bank', code: 'INGBNL2A', logo: 'https://logo.clearbit.com/ing.com' },
    { id: 'unicredit', name: 'UniCredit', code: 'UNCRITMM', logo: 'https://logo.clearbit.com/unicredit.eu' },
    { id: 'credit-agricole', name: 'Crédit Agricole', code: 'AGRIFRPP', logo: 'https://logo.clearbit.com/credit-agricole.com' }
  ]
};

export function BankSelector({ selectedBank, onSelect, country, error }: BankSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [banks, setBanks] = useState<Bank[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setBanks(banksByCountry[country] || []);
  }, [country]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredBanks = banks.filter(bank =>
    bank.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bank.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Bank
      </label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full px-4 py-3 rounded-lg bg-gray-50 border text-left flex items-center gap-3",
          error ? "border-red-500" : "border-gray-200",
          "focus:outline-none focus:ring-2 focus:ring-emerald-500"
        )}
      >
        {selectedBank ? (
          <>
            {selectedBank.logo && (
              <img
                src={selectedBank.logo}
                alt={selectedBank.name}
                className="w-6 h-6 object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            )}
            <div className="flex-1">
              <div className="font-medium">{selectedBank.name}</div>
              <div className="text-sm text-gray-500">{selectedBank.code}</div>
            </div>
          </>
        ) : (
          <span className="text-gray-500">Select a bank</span>
        )}
      </button>

      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200">
          <div className="p-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search banks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-md bg-gray-50 border border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 text-sm"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>
          <div className="max-h-60 overflow-y-auto">
            {filteredBanks.map((bank) => (
              <button
                key={bank.id}
                type="button"
                onClick={() => {
                  onSelect(bank);
                  setIsOpen(false);
                }}
                className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors"
              >
                {bank.logo && (
                  <img
                    src={bank.logo}
                    alt={bank.name}
                    className="w-6 h-6 object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                )}
                <div className="flex-1 text-left">
                  <p className="font-medium">{bank.name}</p>
                  <p className="text-sm text-gray-500">{bank.code}</p>
                </div>
                {selectedBank?.id === bank.id && (
                  <Check className="w-5 h-5 text-emerald-500" />
                )}
              </button>
            ))}
            {filteredBanks.length === 0 && (
              <div className="px-4 py-3 text-sm text-gray-500 text-center">
                No banks found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}