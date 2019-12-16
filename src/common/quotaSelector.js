const hasQuota = (quotas, resourceType) => quotas.some((quota) => {
  if (quota.resource_type !== resourceType) {
    return false;
  }
  return quota.allowed - quota.reserved > 0;
});

export default hasQuota;
