export const mockAddOns = {
  items: [
    {
      kind: 'AddOn',
      href: '/api/clusters_mgmt/v1/addons/service-mesh',
      id: 'service-mesh',
      name: 'Red Hat OpenShift Service Mesh',
      description: 'Based on the open source Istio project, Red Hat OpenShift Service Mesh provides an easy way to create a network of deployed services that provides discovery, load balancing, service-to-service authentication, failure recovery, metrics, and monitoring.',
      label: 'api.openshift.com/service-mesh-addon',
      icon: null,
      enabled: true,
    },
    {
      kind: 'AddOn',
      href: '/api/clusters_mgmt/v1/addons/managed-integration',
      id: 'managed-integration',
      name: 'Red Hat Managed Integration',
      description: 'Red Hat managed integration, based on the integreatly project, is an opinionated installation of a number of independent middleware services and tools into an OpenShift Dedicated cluster.',
      label: 'api.openshift.com/managed-integration-addon',
      icon: null,
      enabled: true,
    },
    {
      kind: 'AddOn',
      href: '/api/clusters_mgmt/v1/addons/crc-workspaces',
      id: 'crc-workspaces',
      name: 'Red Hat CodeReady Workspaces',
      description: 'Built on the open Eclipse Che project, Red Hat CodeReady Workspaces provides developer workspaces, which include all the tools and the dependencies that are needed to code, build, test, run, and debug applications.',
      label: 'api.openshift.com/crc-workspaces-addon',
      icon: null,
      enabled: true,
    },
  ],
};

export const mockClusterAddOns = {
  items: [
    {
      kind: 'AddOnLink',
      href: '/api/clusters_mgmt/v1/addons/service-mesh',
      addon: {
        id: 'service-mesh',
      },
    },
  ],
};

export const mockQuota = {
  addOnsQuota: {
    'crc-workspaces': 1,
    'managed-integration': 0,
    'service-mesh': 1,
  },
};
