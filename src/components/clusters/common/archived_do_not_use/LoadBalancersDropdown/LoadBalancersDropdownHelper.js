const filterLoadBalancerValuesByQuota = (currentValue, loadBalancerValues, remainingQuota) => {
  const result = { ...loadBalancerValues };
  if (!result.values) {
    return { values: [] };
  }
  if (currentValue) {
    result.values = result.values.filter((el) => el <= remainingQuota + currentValue);
  } else {
    result.values = result.values.filter((el) => el <= remainingQuota);
  }
  return result;
};

export {
  // eslint-disable-next-line import/prefer-default-export
  filterLoadBalancerValuesByQuota,
};
