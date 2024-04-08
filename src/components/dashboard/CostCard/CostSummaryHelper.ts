import { Report } from './models/Report';

export const formatCurrency = (value = 0, units = 'USD') =>
  value.toLocaleString('en', {
    style: 'currency',
    currency: units,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export const getTotal = (report?: Report) => {
  const total = report?.meta?.total?.cost?.total?.value ?? 0;
  const units = report?.meta?.total?.cost?.total?.units ?? 'USD';

  return formatCurrency(total, units);
};

export const formatPercentage = (value = 0) =>
  value.toLocaleString('en', {
    style: 'percent',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
