export const GET_CLUSTER_INSIGHTS = 'GET_CLUSTER_INSIGHTS';
export const GET_ORGANIZATION_INSIGHTS = 'GET_ORGANIZATION_INSIGHTS';
export const INSIGHTS_RULE_CATEGORIES = [
  {
    title: 'Performance',
    tags: ['performance'], // tags appear in the OCP Insights rule contents
  },
  {
    title: 'Service Availability',
    tags: ['service_availability'],
  },
  {
    title: 'Security',
    tags: ['security'],
  },
  {
    title: 'Fault Tolerance',
    tags: ['fault_tolerance'],
  },
];
