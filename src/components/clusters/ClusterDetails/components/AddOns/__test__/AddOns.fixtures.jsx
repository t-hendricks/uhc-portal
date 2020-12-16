export const mockAddOns = {
  items: [
    {
      kind: 'AddOn',
      href: '/api/clusters_mgmt/v1/addons/crc-workspaces',
      id: 'crc-workspaces',
      name: 'Red Hat CodeReady Workspaces',
      description: 'Built on the open Eclipse Che project, Red Hat CodeReady Workspaces provides developer workspaces, which include all the tools and the dependencies that are needed to code, build, test, run, and debug applications.',
      docs_link: 'https://access.redhat.com/documentation/en-us/red_hat_codeready_workspaces',
      label: 'api.openshift.com/addon-crc-workspaces',
      icon: null,
      enabled: true,
      resource_name: 'crc-workspaces',
      resource_cost: 0,
      target_namespace: 'codeready-workspaces-operator',
      install_mode: 'single_namespace',
      operator_name: 'crwoperator',
    },
    {
      kind: 'AddOn',
      href: '/api/clusters_mgmt/v1/addons/managed-integration',
      id: 'managed-integration',
      name: 'Red Hat Managed Integration',
      description: 'Red Hat managed integration, based on the integreatly project, is an opinionated installation of a number of independent middleware services and tools into an OpenShift Dedicated cluster.',
      docs_link: 'https://access.redhat.com/documentation/en-us/red_hat_managed_integration/2/',
      label: 'api.openshift.com/addon-managed-integration',
      icon: null,
      enabled: true,
      resource_name: 'managed-integration',
      resource_cost: 0.5,
      target_namespace: 'redhat-rhmi-operator',
      install_mode: 'single_namespace',
      operator_name: 'integreatly-operator',
      parameters: {
        items: [
          {
            id: 'cidr-range',
            name: 'CIDR Range',
            description: 'A block of IP addresses used by the RHMI installation program while installing the cluster',
            value_type: 'string',
            validation: '/^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]).){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])(/(1[6-9]|2[0-6]))$/',
            required: true,
            editable: false,
          },
          {
            id: 'notification-email',
            name: 'Notification Email',
            description: 'Notification email address',
            value_type: 'string',
            validation: "/^w+([-+.']w+)*@w+([-.]w+)*.w+([-.]w+)*$/",
            required: false,
            editable: true,
          },
        ],
      },
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
      target_namespace: 'redhat-service-mesh-operator',
      install_mode: 'single_namespace',
      operator_name: 'service-mesh-operator',
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
      target_namespace: 'addon-dba-operator',
      install_mode: 'all_namespaces',
      operator_name: 'dba-operator',
    },
    {
      kind: 'AddOn',
      href: '/api/clusters_mgmt/v1/addons/integreatly',
      id: 'integreatly',
      name: 'Integreatly Operator',
      description: 'Install and configure the integreatly suite of Software',
      docs_link: 'https://access.redhat.com/documentation/en-us/red_hat_managed_integration/2/',
      icon: null,
      label: 'api.openshift.com/addon-integreatly-operator',
      enabled: true,
      resource_name: 'RHMI',
      resource_cost: 1,
      target_namespace: 'redhat-rhmi-operator',
      install_mode: 'single_namespace',
      operator_name: 'integreatly-operator',
    },
    {
      kind: 'AddOn',
      href: '/api/clusters_mgmt/v1/addons/prow-operator',
      id: 'prow-operator',
      name: 'Prow Operator',
      description: 'Manage Prow CRDs',
      docs_link: 'https://pkg.go.dev/k8s.io/test-infra/prow',
      label: 'api.openshift.com/addon-prow-operator',
      icon: null,
      enabled: true,
      resource_name: 'addon-prow-operator',
      resource_cost: 1,
      target_namespace: 'prow',
      install_mode: 'single_namespace',
      operator_name: 'prow-operator',
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

export const mockClusterAddOnsParams = {
  items: [
    {
      kind: 'AddOnLink',
      href: '/api/clusters_mgmt/v1/addons/crc-workspaces',
      addon: {
        id: 'crc-workspaces',
      },
      state: 'ready',
    },
    {
      kind: 'AddOnLink',
      href: '/api/clusters_mgmt/v1/addons/managed-integration',
      addon: {
        id: 'managed-integration',
      },
      state: 'ready',
      parameters: {
        items: [{
          id: 'cidr-range',
          value: '10.1.0.0/16',
        }],
      },
    },
    {
      kind: 'AddOnLink',
      href: '/api/clusters_mgmt/v1/addons/managed-integration',
      addon: {
        id: 'managed-integration',
      },
      state: 'ready',
      parameters: {
        items: [
          {
            id: 'cidr-range',
            value: '10.1.0.0/16',
          },
          {
            id: 'foo',
            value: 'bar',
          },
        ],
      },
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
