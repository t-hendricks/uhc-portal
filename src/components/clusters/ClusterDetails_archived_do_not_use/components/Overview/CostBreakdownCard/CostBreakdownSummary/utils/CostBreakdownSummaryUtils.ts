import { Report } from '~/components/dashboard/CostCard/models/Report';

export const formatCurrency = (value: number = 0, units: string = 'USD') =>
  value.toLocaleString('en', {
    style: 'currency',
    currency: units,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export const getTotal = (report: Report) => {
  const total = report?.meta?.total?.cost?.total?.value ?? 0;
  const units = report?.meta?.total?.cost?.total?.units ?? 'USD';
  return formatCurrency(total, units);
};
