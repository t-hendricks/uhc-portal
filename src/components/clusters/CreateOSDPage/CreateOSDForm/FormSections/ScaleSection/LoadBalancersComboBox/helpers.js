
const filterLoadBalancerValuesByQuota = (currentValue, loadBalancerValues, remainingQuota) => {
  const result = { ...loadBalancerValues };
  if (!result.values) {
    return { values: [] };
  }
  if (currentValue) {
    result.values = result.values.filter(el => el <= remainingQuota + currentValue);
  } else {
    result.values = result.values.filter(el => el <= remainingQuota);
  }
  return result;
};

export default filterLoadBalancerValuesByQuota;
