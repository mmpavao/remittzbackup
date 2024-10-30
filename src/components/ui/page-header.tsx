import { Breadcrumb } from './breadcrumb';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs: {
    label: string;
    href?: string;
  }[];
}

export function PageHeader({ title, subtitle, breadcrumbs }: PageHeaderProps) {
  return (
    <div className="mb-8">
      <Breadcrumb items={breadcrumbs} />
      <h1 className="text-2xl font-semibold text-gray-900 mt-4">{title}</h1>
      {subtitle && (
        <p className="mt-2 text-sm text-gray-600">{subtitle}</p>
      )}
    </div>
  );
}