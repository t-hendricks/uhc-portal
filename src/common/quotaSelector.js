const hasQuota = quotas => quotas.some(quota => quota.allowed - quota.reserved > 0);

export default hasQuota;
