export default {
  items: [
    {
      prefix: 'myManagedRoles',
      items: [
        {
          arn: 'arn:aws:iam::123456789012:role/myManagedRoles-HCP-ROSA-Installer-Role',
          type: 'Installer',
          managedPolicies: true,
          hcpManagedPolicies: true,
        },
        {
          arn: 'arn:aws:iam::123456789012:role/myManagedRoles-HCP-ROSA-Support-Role',
          type: 'Support',
          managedPolicies: true,
          hcpManagedPolicies: true,
        },
        {
          arn: 'arn:aws:iam::123456789012:role/myManagedRoles-HCP-ROSA-Worker-Role',
          type: 'Worker',
          managedPolicies: true,
          hcpManagedPolicies: true,
        },
      ],
    },
    {
      prefix: 'myUnManagedRoles',
      items: [
        {
          arn: 'arn:aws:iam::123456789012:role/myUnManagedRoles-ControlPlane-Role',
          type: 'ControlPlane',
          managedPolicies: false,
          hcpManagedPolicies: false,
        },
        {
          arn: 'arn:aws:iam::123456789012:role/myUnManagedRoles-Installer-Role',
          type: 'Installer',
          managedPolicies: false,
          hcpManagedPolicies: false,
        },
        {
          arn: 'arn:aws:iam::123456789012:role/myUnManagedRoles-Support-Role',
          type: 'Support',
          managedPolicies: false,
          hcpManagedPolicies: false,
        },
        {
          arn: 'arn:aws:iam::123456789012:role/myUnManagedRoles-Worker-Role',
          type: 'Worker',
          managedPolicies: false,
          hcpManagedPolicies: false,
        },
      ],
    },
    {
      prefix: 'bothRoles',
      items: [
        {
          arn: 'arn:aws:iam::123456789012:role/bothRoles-HCP-ROSA-Installer-Role',
          type: 'Installer',
          managedPolicies: true,
          hcpManagedPolicies: true,
        },
        {
          arn: 'arn:aws:iam::123456789012:role/bothRoles-HCP-ROSA-Support-Role',
          type: 'Support',
          managedPolicies: true,
          hcpManagedPolicies: true,
        },
        {
          arn: 'arn:aws:iam::123456789012:role/bothRoles-HCP-ROSA-Worker-Role',
          type: 'Worker',
          managedPolicies: true,
          hcpManagedPolicies: true,
        },
        {
          arn: 'arn:aws:iam::123456789012:role/bothRoles-ControlPlane-Role',
          type: 'ControlPlane',
          managedPolicies: false,
          hcpManagedPolicies: false,
        },
        {
          arn: 'arn:aws:iam::123456789012:role/bothRoles-Installer-Role',
          type: 'Installer',
          managedPolicies: false,
          hcpManagedPolicies: false,
        },
        {
          arn: 'arn:aws:iam::123456789012:role/bothRoles-Support-Role',
          type: 'Support',
          managedPolicies: false,
          hcpManagedPolicies: false,
        },
        {
          arn: 'arn:aws:iam::123456789012:role/bothRoles-Worker-Role',
          type: 'Worker',
          managedPolicies: false,
          hcpManagedPolicies: false,
        },
      ],
    },
    {
      prefix: 'oddRole',
      items: [
        {
          arn: 'arn:aws:iam::012345678912:role/oddRole-HCP-Support-Role',
          type: 'Support',
          managedPolicies: true,
          hcpManagedPolicies: true,
        },
      ],
    },
  ],
};
