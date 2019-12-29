import get from 'lodash/get';

const minValueSelector = isMultiAz => (isMultiAz ? {
  value: 9,
  validationMsg: 'At least 9 nodes are required for multiple availability zone cluster.',
} : {
  value: 4,
  validationMsg: 'At least 4 nodes are required',
});

// compare previously set load balancers to the new value of required load balancers
const shouldShowLoadBalancerAlert = (state, newRequiredLB) => {
  const currentlyRequired = get(state.modal.activeModal.data, 'load_balancer_quota', 0);
  return newRequiredLB < currentlyRequired;
};

// compare previously set storage to the new value of required storage
const shouldShowStorageQuotaAlert = (state, newRequiredStorage) => {
  const currentlyRequired = get(state.modal.activeModal.data, 'storage_quota', 0);
  return newRequiredStorage < currentlyRequired;
};

export { minValueSelector, shouldShowStorageQuotaAlert, shouldShowLoadBalancerAlert };
