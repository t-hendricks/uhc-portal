import get from 'lodash/get';

const groupRulesByRisk = data => data.reduce(
  (acc, { total_risk: totalRisk }) => ({
    ...acc,
    [totalRisk]: acc[totalRisk] ? acc[totalRisk] + 1 : 1,
  }),
  {},
);

const issuesCountSelector = (state, externalId) => {
  const insightsData = get(
    state,
    `insightsData.insightsData[${externalId}].data`,
  );
  // filter only enabled rules
  const filteredData = insightsData
    ? insightsData.filter(val => !val.disabled)
    : [];

  return groupRulesByRisk(filteredData);
};

export default issuesCountSelector;
