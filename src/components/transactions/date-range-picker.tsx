import { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon, X } from 'lucide-react';

interface DateRange {
  from: Date;
  to: Date;
}

interface DateRangePickerProps {
  value: DateRange | null;
  onChange: (range: DateRange | null) => void;
  children: React.ReactNode;
}

export function DateRangePicker({ value, onChange, children }: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState<DateRange | null>(value);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDateSelect = (date: Date) => {
    if (!selectedRange || selectedRange.to) {
      setSelectedRange({ from: date, to: date });
    } else {
      if (date < selectedRange.from) {
        setSelectedRange({ from: date, to: selectedRange.from });
      } else {
        setSelectedRange({ from: selectedRange.from, to: date });
      }
    }
  };

  const handleApply = () => {
    if (selectedRange?.from && selectedRange?.to) {
      onChange(selectedRange);
      setIsOpen(false);
    }
  };

  const handleClear = () => {
    setSelectedRange(null);
    onChange(null);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={containerRef}>
      <div onClick={() => setIsOpen(!isOpen)}>
        {children}
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 p-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm font-medium text-gray-700 mb-2">Start Date</div>
              <input
                type="date"
                value={selectedRange?.from?.toISOString().split('T')[0] || ''}
                onChange={(e) => handleDateSelect(new Date(e.target.value))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-emerald-500"
              />
            </div>
            <div>
              <div className="text-sm font-medium text-gray-700 mb-2">End Date</div>
              <input
                type="date"
                value={selectedRange?.to?.toISOString().split('T')[0] || ''}
                onChange={(e) => {
                  if (selectedRange?.from) {
                    setSelectedRange({
                      from: selectedRange.from,
                      to: new Date(e.target.value)
                    });
                  }
                }}
                min={selectedRange?.from?.toISOString().split('T')[0]}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={handleClear}
              className="px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={handleApply}
              disabled={!selectedRange?.from || !selectedRange?.to}
              className="px-3 py-2 text-sm bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}