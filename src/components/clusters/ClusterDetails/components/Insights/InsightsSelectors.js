import get from 'lodash/get';

const groupRulesByRisk = (data) =>
  data.reduce(
    (acc, { total_risk: totalRisk }) => ({
      ...acc,
      [totalRisk]: acc[totalRisk] ? acc[totalRisk] + 1 : 1,
    }),
    {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
    },
  );

const issuesCountSelector = (state, externalId) => {
  const insightsData = get(state, `insightsData.insightsData[${externalId}].data`);
  // filter only enabled rules
  const filteredData = insightsData ? insightsData.filter((val) => !val.disabled) : [];

  return groupRulesByRisk(filteredData);
};

const labelBorderColor = {
  1: 'blue',
  2: 'orange',
  3: 'orange',
  4: 'red',
};

export { groupRulesByRisk, labelBorderColor };

export default issuesCountSelector;
