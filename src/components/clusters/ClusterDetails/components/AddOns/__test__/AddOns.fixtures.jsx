export const mockAddOns = {
  items: [
    {
      kind: 'AddOn',
      href: '/api/clusters_mgmt/v1/addons/crc-workspaces',
      id: 'crc-workspaces',
      name: 'Red Hat CodeReady Workspaces',
      description: 'Built on the open Eclipse Che project, Red Hat CodeReady Workspaces provides developer workspaces, which include all the tools and the dependencies that are needed to code, build, test, run, and debug applications.',
      label: 'api.openshift.com/addon-crc-workspaces',
      icon: null,
      enabled: true,
      resource_name: 'crc-workspaces',
      resource_cost: 0,
    },
    {
      kind: 'AddOn',
      href: '/api/clusters_mgmt/v1/addons/managed-integration',
      id: 'managed-integration',
      name: 'Red Hat Managed Integration',
      description: 'Red Hat managed integration, based on the integreatly project, is an opinionated installation of a number of independent middleware services and tools into an OpenShift Dedicated cluster.',
      label: 'api.openshift.com/addon-managed-integration',
      icon: null,
      enabled: true,
      resource_name: 'managed-integration',
      resource_cost: 0.5,
    },
    {
      kind: 'AddOn',
      href: '/api/clusters_mgmt/v1/addons/service-mesh',
      id: 'service-mesh',
      name: 'Red Hat OpenShift Service Mesh',
      description: 'Based on the open source Istio project, Red Hat OpenShift Service Mesh provides an easy way to create a network of deployed services that provides discovery, load balancing, service-to-service authentication, failure recovery, metrics, and monitoring.',
      label: 'api.openshift.com/addon-service-mesh',
      icon: null,
      enabled: true,
      resource_name: 'service-mesh',
      resource_cost: 1,
    },
    {
      kind: 'AddOn',
      href: '/api/clusters_mgmt/v1/addons/dba-operator',
      id: 'dba-operator',
      name: 'DBA Operator',
      description: 'DBA Operator description',
      label: 'api.openshift.com/addon-dba-operator',
      icon: null,
      enabled: true,
      resource_name: 'dbaOperatorAddon',
      resource_cost: 1,
    },
    {
      kind: 'AddOn',
      href: '/api/clusters_mgmt/v1/addons/integreatly',
      id: 'integreatly',
      name: 'Integreatly Operator',
      description: 'Install and configure the integreatly suite of Software',
      icon: null,
      label: 'api.openshift.com/addon-integreatly-operator',
      enabled: true,
      resource_name: 'RHMI',
      resource_cost: 1,
    },
    {
      kind: 'AddOn',
      href: '/api/clusters_mgmt/v1/addons/prow-operator',
      id: 'prow-operator',
      name: 'Prow Operator',
      description: 'Manage Prow CRDs',
      label: 'api.openshift.com/addon-prow-operator',
      icon: null,
      enabled: true,
      resource_name: 'addon-prow-operator',
      resource_cost: 1,
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
      state: 'ready',
    },
  ],
};

export const mockQuota = {
  addOnsQuota: {
    'managed-integration': 1,
    'service-mesh': 0,
    dbaOperatorAddon: 1,
    RHMI: 0,
    'addon-prow-operator': 1,
  },
};
