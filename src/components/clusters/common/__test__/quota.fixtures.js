// Fragments of QuotaCostList.items.

const dedicatedRhInfra = [
  {
    kind: 'QuotaCost',
    href: '/api/accounts_mgmt/v1/organizations/1MK6ieFXd0eu1hERdENAPvpbi7x/quota_cost',
    organization_id: '1MK6ieFXd0eu1hERdENAPvpbi7x',
    quota_id: 'cluster|gp.small|multi|rhinfra|osd|any',
    allowed: 17,
    consumed: 0,
    related_resources: [
      {
        cloud_provider: 'any',
        resource_name: 'gp.small',
        resource_type: 'cluster',
        byoc: 'rhinfra',
        availability_zone_type: 'multi',
        product: 'OSD',
        cost: 1,
      },
    ],
  },
  {
    kind: 'QuotaCost',
    href: '/api/accounts_mgmt/v1/organizations/1MK6ieFXd0eu1hERdENAPvpbi7x/quota_cost',
    organization_id: '1MK6ieFXd0eu1hERdENAPvpbi7x',
    quota_id: 'compute.node|gp.small|any|rhinfra|osd|any',
    allowed: 27,
    consumed: 4,
    related_resources: [
      {
        cloud_provider: 'any',
        resource_name: 'gp.small',
        resource_type: 'compute.node',
        byoc: 'rhinfra',
        availability_zone_type: 'any',
        product: 'OSD',
        cost: 1,
      },
    ],
  },
];

const dedicatedBYOC = [
  {
    kind: 'QuotaCost',
    href: '/api/accounts_mgmt/v1/organizations/1MK6ieFXd0eu1hERdENAPvpbi7x/quota_cost',
    organization_id: '1MK6ieFXd0eu1hERdENAPvpbi7x',
    quota_id: 'cluster|byoc|osd',
    allowed: 20,
    consumed: 0,
    related_resources: [
      {
        cloud_provider: 'any',
        resource_name: 'gp.small',
        resource_type: 'cluster',
        byoc: 'byoc',
        availability_zone_type: 'multi',
        product: 'OSD',
        cost: 1,
      },
    ],
  },
  {
    kind: 'QuotaCost',
    href: '/api/accounts_mgmt/v1/organizations/1MK6ieFXd0eu1hERdENAPvpbi7x/quota_cost',
    organization_id: '1MK6ieFXd0eu1hERdENAPvpbi7x',
    quota_id: 'compute.node|cpu|byoc|osd',
    allowed: 520,
    consumed: 0,
    related_resources: [
      {
        cloud_provider: 'any',
        resource_name: 'gp.small',
        resource_type: 'compute.node',
        byoc: 'byoc',
        availability_zone_type: 'any',
        product: 'OSD',
        cost: 4,
      },
    ],
  },
];

const unlimitedMOA = [
  {
    kind: 'QuotaCost',
    href: '/api/accounts_mgmt/v1/organizations/1H1PQMDtwzAUsjPxgoWRjhSpNGD/quota_cost',
    organization_id: '1H1PQMDtwzAUsjPxgoWRjhSpNGD',
    quota_id: 'cluster|gp.small|any|byoc|moa|aws',
    allowed: 0,
    consumed: 0,
    related_resources: [
      {
        cloud_provider: 'aws',
        resource_name: 'gp.small',
        resource_type: 'cluster',
        byoc: 'byoc',
        availability_zone_type: 'any',
        product: 'MOA',
        cost: 0,
      },
    ],
  },
  {
    kind: 'QuotaCost',
    href: '/api/accounts_mgmt/v1/organizations/1H1PQMDtwzAUsjPxgoWRjhSpNGD/quota_cost',
    organization_id: '1H1PQMDtwzAUsjPxgoWRjhSpNGD',
    quota_id: 'compute.node|gp.small|any|byoc|moa|aws',
    allowed: 0,
    consumed: 0,
    related_resources: [
      {
        cloud_provider: 'aws',
        resource_name: 'gp.small',
        resource_type: 'compute.node',
        byoc: 'byoc',
        availability_zone_type: 'any',
        product: 'MOA',
        cost: 0,
      },
    ],
  },
];

export {
  dedicatedRhInfra,
  dedicatedBYOC,
  unlimitedMOA,
};
