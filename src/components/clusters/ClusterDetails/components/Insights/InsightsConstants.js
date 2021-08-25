export const GET_CLUSTER_INSIGHTS = 'GET_CLUSTER_INSIGHTS';
export const VOTE_ON_RULE_INSIGHTS = 'VOTE_ON_RULE_INSIGHTS';
export const DISABLE_RULE_INSIGHTS = 'DISABLE_RULE_INSIGHTS';
export const ENABLE_RULE_INSIGHTS = 'ENABLE_RULE_INSIGHTS';
export const SEND_FEEDBACK_ON_RULE_DISABLE_INSIGHTS = 'SEND_FEEDBACK_ON_RULE_DISABLE_INSIGHTS';
export const GET_REPORT_DETAILS = 'GET_REPORT_DETAILS';
export const SET_REPORT_DETAILS = 'SET_REPORT_DETAILS';
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
