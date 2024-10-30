import { cn } from '@/lib/utils';

interface Column<T> {
  key: keyof T;
  title: string;
  render?: (value: any, item: T) => React.ReactNode;
}

interface ResponsiveTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (item: T) => void;
  className?: string;
}

export function ResponsiveTable<T>({ data, columns, onRowClick, className }: ResponsiveTableProps<T>) {
  return (
    <>
      {/* Desktop Table */}
      <div className="hidden md:block">
        <table className={cn("min-w-full divide-y divide-gray-200", className)}>
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key as string}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {column.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item, index) => (
              <tr
                key={index}
                onClick={() => onRowClick?.(item)}
                className={cn("hover:bg-gray-50", onRowClick && "cursor-pointer")}
              >
                {columns.map((column) => (
                  <td key={column.key as string} className="px-6 py-4 whitespace-nowrap">
                    {column.render
                      ? column.render(item[column.key], item)
                      : String(item[column.key])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {data.map((item, index) => (
          <div
            key={index}
            onClick={() => onRowClick?.(item)}
            className={cn(
              "bg-white p-4 rounded-lg border border-gray-200",
              onRowClick && "cursor-pointer hover:border-emerald-500"
            )}
          >
            {columns.map((column) => (
              <div key={column.key as string} className="flex justify-between py-2">
                <span className="text-sm font-medium text-gray-500">{column.title}</span>
                <span className="text-sm text-gray-900">
                  {column.render
                    ? column.render(item[column.key], item)
                    : String(item[column.key])}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}