import { Report } from '~/components/dashboard/CostCard/models/Report';

export const report: Report = {
  meta: {
    total: {
      cost: {
        markup: {
          units: 'USD',
          value: 100,
        },
        raw: {
          units: 'USD',
          value: 200,
        },
        usage: {
          units: 'USD',
          value: 300,
        },
      },
    },
  },
  data: [],
  pending: false,
  fulfilled: false,
};
