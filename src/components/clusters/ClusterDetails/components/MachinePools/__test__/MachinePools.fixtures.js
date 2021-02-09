import { normalizedProducts } from '../../../../../../common/subscriptionTypes';

const stateWithQuota = {
  clusters: {
    details: {
      error: false,
      errorMessage: '',
      errorDetails: null,
      pending: false,
      fulfilled: true,
      valid: true,
      cluster: {
        kind: 'Cluster',
        id: '1ibe928bp9ojdqkqobpp3ig1a1r5i0rb',
        href: '/api/clusters_mgmt/v1/clusters/1ibe928bp9ojdqkqobpp3ig1a1r5i0rb',
        name: 'test-liza',
        external_id: '702ba579-ae0e-41f3-aa8c-4e4fcf497318',
        infra_id: 'test-liza-8px9k',
        display_name: 'test-liza',
        creation_timestamp: '2021-01-21T07:51:38.587141Z',
        activity_timestamp: '2021-01-21T10:53:28Z',
        expiration_timestamp: '2021-01-22T19:51:37.498441Z',
        cloud_provider: {
          kind: 'CloudProviderLink',
          id: 'aws',
          href: '/api/clusters_mgmt/v1/cloud_providers/aws',
        },
        openshift_version: '4.6.12',
        subscription: {
          id: '1nN0ylc0CaJdNshnrFbh614ajCQ',
          kind: 'Subscription',
          href: '/api/accounts_mgmt/v1/subscriptions/1nN0ylc0CaJdNshnrFbh614ajCQ',
          plan: {
            id: normalizedProducts.OSD,
          },
          cluster_id: '1ibe928bp9ojdqkqobpp3ig1a1r5i0rb',
          external_cluster_id: '702ba579-ae0e-41f3-aa8c-4e4fcf497318',
          organization_id: '1MKVU4otCIuogoLtgtyU6wajxjW',
          last_telemetry_date: '2021-01-21T08:36:04.470803Z',
          created_at: '2021-01-21T07:51:37.615717Z',
          updated_at: '2021-01-21T08:36:04.470834Z',
          support_level: 'Premium',
          cpu_total: 8,
          socket_total: 4,
          display_name: 'test-liza',
          creator: {
            id: '1MRilA9vHlOUX9ui3lx6IohSsaS',
            kind: 'Account',
            href: '/api/accounts_mgmt/v1/accounts/1MRilA9vHlOUX9ui3lx6IohSsaS',
            name: 'Liza Gilman',
            username: 'egilman.openshift',
            email: '***REMOVED***',
          },
          managed: true,
          status: 'Active',
          provenance: 'Provisioning',
          last_reconcile_date: '0001-01-01T00:00:00Z',
          console_url: 'https://console-openshift-console.apps.test-liza.uhqs.s1.devshift.org',
          capabilities: [
            {
              name: 'capability.cluster.subscribed_ocp',
              value: 'true',
              inherited: true,
            },
            {
              name: 'capability.cluster.manage_cluster_admin',
              value: 'true',
              inherited: true,
            },
          ],
          last_released_at: '0001-01-01T00:00:00Z',
          metrics: [
            {
              HealthState: 'healthy',
              memory: {
                updated_timestamp: '2021-01-21T10:50:08.911Z',
                used: {
                  value: 31880519680,
                  unit: 'B',
                },
                total: {
                  value: 147645603840,
                  unit: 'B',
                },
              },
              cpu: {
                updated_timestamp: '2021-01-21T10:50:09.022Z',
                used: {
                  value: 3.4392380952380956,
                  unit: '',
                },
                total: {
                  value: 36,
                  unit: '',
                },
              },
              sockets: {
                updated_timestamp: '0001-01-01T00:00:00Z',
                used: {
                  value: 0,
                  unit: '',
                },
                total: {
                  value: 0,
                  unit: '',
                },
              },
              compute_nodes_memory: {
                updated_timestamp: '1970-01-01T00:00:00Z',
                used: {
                  value: 0,
                  unit: 'B',
                },
                total: {
                  value: 98665267200,
                  unit: 'B',
                },
              },
              compute_nodes_cpu: {
                updated_timestamp: '1970-01-01T00:00:00Z',
                used: {
                  value: 0,
                  unit: '',
                },
                total: {
                  value: 24,
                  unit: '',
                },
              },
              compute_nodes_sockets: {
                updated_timestamp: '0001-01-01T00:00:00Z',
                used: {
                  value: 0,
                  unit: '',
                },
                total: {
                  value: 0,
                  unit: '',
                },
              },
              storage: {
                updated_timestamp: '0001-01-01T00:00:00Z',
                used: {
                  value: 0,
                  unit: '',
                },
                total: {
                  value: 0,
                  unit: '',
                },
              },
              nodes: {
                total: 9,
                master: 3,
                infra: 2,
                compute: 4,
              },
              operating_system: '',
              upgrade: {
                updated_timestamp: '2021-01-21T10:50:08.917Z',
              },
              state: 'ready',
              state_description: '',
              openshift_version: '4.6.12',
              cloud_provider: 'aws',
              region: 'us-east-1',
              console_url: 'https://console-openshift-console.apps.test-liza.uhqs.s1.devshift.org',
              critical_alerts_firing: 0,
              operators_condition_failing: 0,
              subscription_cpu_total: 8,
              subscription_socket_total: 4,
              subscription_obligation_exists: 3,
            },
          ],
          cloud_provider_id: 'aws',
          region_id: 'us-east-1',
          cluster_billing_model: 'standard',
        },
        region: {
          kind: 'CloudRegionLink',
          id: 'us-east-1',
          href: '/api/clusters_mgmt/v1/cloud_providers/aws/regions/us-east-1',
        },
        console: {
          url: 'https://console-openshift-console.apps.test-liza.uhqs.s1.devshift.org',
        },
        api: {
          url: 'https://api.test-liza.uhqs.s1.devshift.org:6443',
          listening: 'external',
        },
        nodes: {
          master: 3,
          infra: 2,
          compute: 4,
          availability_zones: [
            'us-east-1a',
          ],
          master_machine_type: {
            kind: 'MachineTypeLink',
            id: 'm5.xlarge',
            href: '/api/clusters_mgmt/v1/machine_types/m5.xlarge',
          },
          compute_machine_type: {
            kind: 'MachineTypeLink',
            id: 'm5.xlarge',
            href: '/api/clusters_mgmt/v1/machine_types/m5.xlarge',
          },
        },
        state: 'ready',
        flavour: {
          kind: 'FlavourLink',
          id: 'osd-4',
          href: '/api/clusters_mgmt/v1/flavours/osd-4',
        },
        groups: {
          kind: 'GroupListLink',
          href: '/api/clusters_mgmt/v1/clusters/1ibe928bp9ojdqkqobpp3ig1a1r5i0rb/groups',
        },
        dns: {
          base_domain: 'uhqs.s1.devshift.org',
        },
        network: {
          machine_cidr: '10.0.0.0/16',
          service_cidr: '172.30.0.0/16',
          pod_cidr: '10.128.0.0/14',
          host_prefix: 23,
        },
        external_configuration: {
          kind: 'ExternalConfiguration',
          href: '/api/clusters_mgmt/v1/clusters/1ibe928bp9ojdqkqobpp3ig1a1r5i0rb/external_configuration',
          syncsets: {
            kind: 'SyncsetListLink',
            href: '/api/clusters_mgmt/v1/clusters/1ibe928bp9ojdqkqobpp3ig1a1r5i0rb/external_configuration/syncsets',
          },
          labels: {
            kind: 'LabelListLink',
            href: '/api/clusters_mgmt/v1/clusters/1ibe928bp9ojdqkqobpp3ig1a1r5i0rb/external_configuration/labels',
          },
        },
        multi_az: false,
        managed: true,
        byoc: false,
        ccs: {
          enabled: false,
          disable_scp_checks: false,
        },
        version: {
          kind: 'Version',
          id: 'openshift-v4.6.12',
          href: '/api/clusters_mgmt/v1/versions/openshift-v4.6.12',
          channel_group: 'stable',
        },
        storage_quota: {
          value: 107374182400,
          unit: 'B',
        },
        load_balancer_quota: 0,
        identity_providers: {
          kind: 'IdentityProviderListLink',
          href: '/api/clusters_mgmt/v1/clusters/1ibe928bp9ojdqkqobpp3ig1a1r5i0rb/identity_providers',
        },
        aws_infrastructure_access_role_grants: {
          kind: 'AWSInfrastructureAccessRoleGrantLink',
          href: '/api/clusters_mgmt/v1/clusters/1ibe928bp9ojdqkqobpp3ig1a1r5i0rb/aws_infrastructure_access_role_grants',
          items: null,
        },
        metrics: {
          HealthState: 'healthy',
          memory: {
            updated_timestamp: '2021-01-21T10:50:08.911Z',
            used: {
              value: 31880519680,
              unit: 'B',
            },
            total: {
              value: 147645603840,
              unit: 'B',
            },
          },
          cpu: {
            updated_timestamp: '2021-01-21T10:50:09.022Z',
            used: {
              value: 3.4392380952380956,
              unit: '',
            },
            total: {
              value: 36,
              unit: '',
            },
          },
          sockets: {
            updated_timestamp: '0001-01-01T00:00:00Z',
            used: {
              value: 0,
              unit: '',
            },
            total: {
              value: 0,
              unit: '',
            },
          },
          compute_nodes_memory: {
            updated_timestamp: '1970-01-01T00:00:00Z',
            used: {
              value: 0,
              unit: 'B',
            },
            total: {
              value: 98665267200,
              unit: 'B',
            },
          },
          compute_nodes_cpu: {
            updated_timestamp: '1970-01-01T00:00:00Z',
            used: {
              value: 0,
              unit: '',
            },
            total: {
              value: 24,
              unit: '',
            },
          },
          compute_nodes_sockets: {
            updated_timestamp: '0001-01-01T00:00:00Z',
            used: {
              value: 0,
              unit: '',
            },
            total: {
              value: 0,
              unit: '',
            },
          },
          storage: {
            updated_timestamp: '0001-01-01T00:00:00Z',
            used: {
              value: 0,
              unit: '',
            },
            total: {
              value: 0,
              unit: '',
            },
          },
          nodes: {
            total: 9,
            master: 3,
            infra: 2,
            compute: 4,
          },
          operating_system: '',
          upgrade: {
            updated_timestamp: '2021-01-21T10:50:08.917Z',
          },
          state: 'ready',
          state_description: '',
          openshift_version: '4.6.12',
          cloud_provider: 'aws',
          region: 'us-east-1',
          console_url: 'https://console-openshift-console.apps.test-liza.uhqs.s1.devshift.org',
          critical_alerts_firing: 0,
          operators_condition_failing: 0,
          subscription_cpu_total: 8,
          subscription_socket_total: 4,
          subscription_obligation_exists: 3,
        },
        addons: {
          kind: 'AddOnInstallationListLink',
          href: '/api/clusters_mgmt/v1/clusters/1ibe928bp9ojdqkqobpp3ig1a1r5i0rb/addons',
        },
        ingresses: {
          kind: 'IngressListLink',
          href: '/api/clusters_mgmt/v1/clusters/1ibe928bp9ojdqkqobpp3ig1a1r5i0rb/ingresses',
          id: '1ibe928bp9ojdqkqobpp3ig1a1r5i0rb',
        },
        machine_pools: {
          kind: 'MachinePoolListLink',
          href: '/api/clusters_mgmt/v1/clusters/1ibe928bp9ojdqkqobpp3ig1a1r5i0rb/machine_pools',
        },
        health_state: 'healthy',
        product: {
          id: normalizedProducts.OSD,
        },
        status: {
          state: 'ready',
          dns_ready: true,
          provision_error_message: '',
          provision_error_code: '',
        },
        node_drain_grace_period: {
          value: 60,
          unit: 'minutes',
        },
        etcd_encryption: false,
        upgrade_channel_group: 'stable',
        canEdit: true,
        canDelete: true,
      },
      incomplete: false,
    },
  },
  userProfile: {
    keycloakProfile: {
      username: '***REMOVED***',
      email: '***REMOVED***',
      first_name: 'Liza',
      last_name: 'Gilman',
      is_active: true,
      is_org_admin: true,
      is_internal: false,
      locale: 'en_US',
    },
    organization: {
      details: {
        id: '1MKVU4otCIuogoLtgtyU6wajxjW',
        kind: 'Organization',
        href: '/api/accounts_mgmt/v1/organizations/1MKVU4otCIuogoLtgtyU6wajxjW',
        name: 'Red Hat : Service Delivery : SDA/B',
        external_id: '12541229',
        ebs_account_id: '6266656',
        created_at: '2019-06-07T18:48:07.86083Z',
        updated_at: '2021-01-20T11:16:15.568987Z',
        capabilities: [
          {
            name: 'capability.organization.hibernate_cluster',
            value: 'true',
            inherited: false,
          },
          {
            name: 'capability.cluster.manage_cluster_admin',
            value: 'true',
            inherited: false,
          },
          {
            name: 'capability.account.allow_etcd_encryption',
            value: 'true',
            inherited: false,
          },
          {
            name: 'capability.account.enable_terms_enforcement',
            value: 'true',
            inherited: false,
          },
          {
            name: 'capability.account.create_moa_clusters',
            value: 'true',
            inherited: false,
          },
          {
            name: 'capability.cluster.subscribed_ocp',
            value: 'true',
            inherited: false,
          },
        ],
      },
      quotaList: {
        clustersQuota: {
          [normalizedProducts.OSD]: {
            aws: {
              byoc: {
                singleAz: {
                  available: 88,
                  'cpu.large': 7,
                  'cpu.medium': 7,
                  'gp.large': 7,
                  'gp.medium': 7,
                  'gp.small': 7,
                  'mem.large': 7,
                  'mem.medium': 7,
                  'mem.small': 7,
                  'cpu.xlarge': 2,
                  'cpu.xxlarge': 2,
                  'cpu.xxxlarge': 2,
                  'cpu.xxxxlarge': 2,
                  'gp.xlarge': 2,
                  'gp.xxlarge': 2,
                  'gp.xxxlarge': 2,
                  'gp.xxxxlarge': 2,
                  'mem.xlarge': 2,
                  'mem.xxlarge': 2,
                  'mem.xxxlarge': 2,
                  'mem.xxxxlarge': 2,
                },
                multiAz: {
                  available: 88,
                  'cpu.large': 7,
                  'cpu.medium': 7,
                  'gp.large': 7,
                  'gp.medium': 7,
                  'gp.small': 7,
                  'mem.large': 7,
                  'mem.medium': 7,
                  'mem.small': 7,
                  'cpu.xlarge': 2,
                  'cpu.xxlarge': 2,
                  'cpu.xxxlarge': 2,
                  'cpu.xxxxlarge': 2,
                  'gp.xlarge': 2,
                  'gp.xxlarge': 2,
                  'gp.xxxlarge': 2,
                  'gp.xxxxlarge': 2,
                  'mem.xlarge': 2,
                  'mem.xxlarge': 2,
                  'mem.xxxlarge': 2,
                  'mem.xxxxlarge': 2,
                },
                totalAvailable: 144,
              },
              rhInfra: {
                singleAz: {
                  available: 164,
                  'cpu.medium': 7,
                  'gp.small': 1,
                  'cpu.large': 7,
                  'gp.large': 7,
                  'mem.small': 7,
                  'mem.medium': 7,
                  'mem.large': 7,
                  'gp.medium': 7,
                },
                multiAz: {
                  available: 65,
                  'cpu.medium': 7,
                  'mem.medium': 7,
                  'mem.small': 7,
                  'cpu.large': 7,
                  'gp.large': 7,
                  'gp.medium': 7,
                  'gp.small': 16,
                  'mem.large': 7,
                },
                totalAvailable: 229,
              },
              isAvailable: true,
            },
            gcp: {
              byoc: {
                singleAz: {
                  available: 88,
                  'cpu.large': 7,
                  'cpu.medium': 7,
                  'gp.large': 7,
                  'gp.medium': 7,
                  'gp.small': 7,
                  'mem.large': 7,
                  'mem.medium': 7,
                  'mem.small': 7,
                  'cpu.xlarge': 2,
                  'cpu.xxlarge': 2,
                  'cpu.xxxlarge': 2,
                  'cpu.xxxxlarge': 2,
                  'gp.xlarge': 2,
                  'gp.xxlarge': 2,
                  'gp.xxxlarge': 2,
                  'gp.xxxxlarge': 2,
                  'mem.xlarge': 2,
                  'mem.xxlarge': 2,
                  'mem.xxxlarge': 2,
                  'mem.xxxxlarge': 2,
                },
                multiAz: {
                  available: 88,
                  'cpu.large': 7,
                  'cpu.medium': 7,
                  'gp.large': 7,
                  'gp.medium': 7,
                  'gp.small': 7,
                  'mem.large': 7,
                  'mem.medium': 7,
                  'mem.small': 7,
                  'cpu.xlarge': 2,
                  'cpu.xxlarge': 2,
                  'cpu.xxxlarge': 2,
                  'cpu.xxxxlarge': 2,
                  'gp.xlarge': 2,
                  'gp.xxlarge': 2,
                  'gp.xxxlarge': 2,
                  'gp.xxxxlarge': 2,
                  'mem.xlarge': 2,
                  'mem.xxlarge': 2,
                  'mem.xxxlarge': 2,
                  'mem.xxxxlarge': 2,
                },
                totalAvailable: 144,
              },
              rhInfra: {
                singleAz: {
                  available: 163,
                  'cpu.medium': 7,
                  'gp.small': 114,
                  'cpu.large': 7,
                  'gp.large': 7,
                  'mem.small': 7,
                  'mem.medium': 7,
                  'mem.large': 7,
                  'gp.medium': 7,
                },
                multiAz: {
                  available: 65,
                  'cpu.medium': 7,
                  'mem.medium': 7,
                  'mem.small': 7,
                  'cpu.large': 7,
                  'gp.large': 7,
                  'gp.medium': 7,
                  'gp.small': 16,
                  'mem.large': 7,
                },
                totalAvailable: 228,
              },
              isAvailable: true,
            },
          },
        },
        nodesQuota: {
          [normalizedProducts.OSD]: {
            aws: {
              byoc: {
                available: 0,
                'cpu.xlarge': {
                  available: 128,
                  cost: 36,
                },
                'cpu.xxlarge': {
                  available: 128,
                  cost: 48,
                },
                'cpu.xxxlarge': {
                  available: 128,
                  cost: 72,
                },
                'cpu.xxxxlarge': {
                  available: 128,
                  cost: 96,
                },
                'gp.xlarge': {
                  available: 128,
                  cost: 32,
                },
                'gp.xxlarge': {
                  available: 128,
                  cost: 48,
                },
                'gp.xxxlarge': {
                  available: 128,
                  cost: 64,
                },
                'gp.xxxxlarge': {
                  available: 128,
                  cost: 96,
                },
                'mem.xlarge': {
                  available: 128,
                  cost: 32,
                },
                'mem.xxlarge': {
                  available: 128,
                  cost: 48,
                },
                'mem.xxxlarge': {
                  available: 128,
                  cost: 64,
                },
                'mem.xxxxlarge': {
                  available: 128,
                  cost: 96,
                },
                'cpu.large': {
                  available: 8,
                  cost: 16,
                },
                'cpu.medium': {
                  available: 8,
                  cost: 8,
                },
                'gp.large': {
                  available: 8,
                  cost: 16,
                },
                'gp.medium': {
                  available: 8,
                  cost: 8,
                },
                'gp.small': {
                  available: 8,
                  cost: 4,
                },
                'mem.large': {
                  available: 8,
                  cost: 16,
                },
                'mem.medium': {
                  available: 8,
                  cost: 8,
                },
                'mem.small': {
                  available: 8,
                  cost: 4,
                },
              },
              rhInfra: {
                available: 0,
                'mem.small': {
                  available: 2,
                  cost: 1,
                },
                'cpu.large': {
                  available: 2,
                  cost: 1,
                },
                'mem.medium': {
                  available: 7,
                  cost: 1,
                },
                'cpu.medium': {
                  available: 2,
                  cost: 1,
                },
                'gp.large': {
                  available: 2,
                  cost: 1,
                },
                'gp.medium': {
                  available: 2,
                  cost: 1,
                },
                'gp.small': {
                  available: 27,
                  cost: 1,
                },
                'mem.large': {
                  available: 2,
                  cost: 1,
                },
              },
            },
            gcp: {
              byoc: {
                available: 0,
                'cpu.xlarge': {
                  available: 128,
                  cost: 36,
                },
                'cpu.xxlarge': {
                  available: 128,
                  cost: 48,
                },
                'cpu.xxxlarge': {
                  available: 128,
                  cost: 72,
                },
                'cpu.xxxxlarge': {
                  available: 128,
                  cost: 96,
                },
                'gp.xlarge': {
                  available: 128,
                  cost: 32,
                },
                'gp.xxlarge': {
                  available: 128,
                  cost: 48,
                },
                'gp.xxxlarge': {
                  available: 128,
                  cost: 64,
                },
                'gp.xxxxlarge': {
                  available: 128,
                  cost: 96,
                },
                'mem.xlarge': {
                  available: 128,
                  cost: 32,
                },
                'mem.xxlarge': {
                  available: 128,
                  cost: 48,
                },
                'mem.xxxlarge': {
                  available: 128,
                  cost: 64,
                },
                'mem.xxxxlarge': {
                  available: 128,
                  cost: 96,
                },
                'cpu.large': {
                  available: 8,
                  cost: 16,
                },
                'cpu.medium': {
                  available: 8,
                  cost: 8,
                },
                'gp.large': {
                  available: 8,
                  cost: 16,
                },
                'gp.medium': {
                  available: 8,
                  cost: 8,
                },
                'gp.small': {
                  available: 8,
                  cost: 4,
                },
                'mem.large': {
                  available: 8,
                  cost: 16,
                },
                'mem.medium': {
                  available: 8,
                  cost: 8,
                },
                'mem.small': {
                  available: 8,
                  cost: 4,
                },
              },
              rhInfra: {
                available: 0,
                'mem.small': {
                  available: 2,
                  cost: 1,
                },
                'cpu.large': {
                  available: 2,
                  cost: 1,
                },
                'mem.medium': {
                  available: 7,
                  cost: 1,
                },
                'cpu.medium': {
                  available: 2,
                  cost: 1,
                },
                'gp.large': {
                  available: 2,
                  cost: 1,
                },
                'gp.medium': {
                  available: 2,
                  cost: 1,
                },
                'gp.small': {
                  available: 27,
                  cost: 1,
                },
                'mem.large': {
                  available: 2,
                  cost: 1,
                },
              },
            },
          },
        },
        storageQuota: {
          aws: {
            available: 54000,
          },
          gcp: {
            available: 54000,
          },
        },
        loadBalancerQuota: {
          aws: {
            available: 80,
          },
          gcp: {
            available: 80,
          },
        },
        addOnsQuota: {
          'addon-prow-operator': 15,
          'addon-elasticsearch-operator': 15,
          'addon-dba-operator': 15,
          'addon-ocs-converged': 15,
          'addon-rhmi-operator': 30,
          'addon-managed-kafka': 15,
          'addon-crw-operator': 15,
          'addon-acm-operator': 15,
          'addon-cluster-logging-operator': 30,
          'addon-managed-api-service': 15,
          'addon-open-data-hub': 15,
        },
      },
      error: false,
      errorMessage: '',
      errorDetails: null,
      pending: false,
      fulfilled: true,
      timestamp: '2021-01-21T10:54:59.977Z',
    },
    selfTermsReviewResult: {
      terms_available: false,
      terms_required: false,
      redirect_url: '',
      error: false,
      errorMessage: '',
      errorDetails: null,
      pending: false,
      fulfilled: true,
      account_id: '1MRilA9vHlOUX9ui3lx6IohSsaS',
      organization_id: '1MKVU4otCIuogoLtgtyU6wajxjW',
    },
  },
  machineTypes: {
    error: false,
    errorMessage: '',
    errorDetails: null,
    pending: false,
    fulfilled: true,
    types: {
      aws: [
        {
          kind: 'MachineType',
          name: 'm5.xlarge - General Purpose',
          category: 'general_purpose',
          size: 'small',
          id: 'm5.xlarge',
          href: '/api/clusters_mgmt/v1/machine_types/m5.xlarge',
          memory: {
            value: 17179869184,
            unit: 'B',
          },
          cpu: {
            value: 4,
            unit: 'vCPU',
          },
          cloud_provider: {
            kind: 'CloudProviderLink',
            id: 'aws',
            href: '/api/clusters_mgmt/v1/cloud_providers/aws',
          },
          resource_name: 'gp.small',
        },
        {
          kind: 'MachineType',
          name: 'm5.2xlarge - General Purpose',
          category: 'general_purpose',
          size: 'medium',
          id: 'm5.2xlarge',
          href: '/api/clusters_mgmt/v1/machine_types/m5.2xlarge',
          memory: {
            value: 34359738368,
            unit: 'B',
          },
          cpu: {
            value: 8,
            unit: 'vCPU',
          },
          cloud_provider: {
            kind: 'CloudProviderLink',
            id: 'aws',
            href: '/api/clusters_mgmt/v1/cloud_providers/aws',
          },
          resource_name: 'gp.medium',
        },
        {
          kind: 'MachineType',
          name: 'm5.4xlarge - General Purpose',
          category: 'general_purpose',
          size: 'large',
          id: 'm5.4xlarge',
          href: '/api/clusters_mgmt/v1/machine_types/m5.4xlarge',
          memory: {
            value: 68719476736,
            unit: 'B',
          },
          cpu: {
            value: 16,
            unit: 'vCPU',
          },
          cloud_provider: {
            kind: 'CloudProviderLink',
            id: 'aws',
            href: '/api/clusters_mgmt/v1/cloud_providers/aws',
          },
          resource_name: 'gp.large',
        },
        {
          kind: 'MachineType',
          name: 'General purpose - M5.8XLarge',
          category: 'general_purpose',
          size: 'xlarge',
          id: 'm5.8xlarge',
          href: '/api/clusters_mgmt/v1/machine_types/m5.8xlarge',
          memory: {
            value: 137438953472,
            unit: 'B',
          },
          cpu: {
            value: 32,
            unit: 'vCPU',
          },
          cloud_provider: {
            kind: 'CloudProviderLink',
            id: 'aws',
            href: '/api/clusters_mgmt/v1/cloud_providers/aws',
          },
          resource_name: 'gp.xlarge',
        },
        {
          kind: 'MachineType',
          name: 'r5.xlarge - Memory Optimized',
          category: 'memory_optimized',
          size: 'small',
          id: 'r5.xlarge',
          href: '/api/clusters_mgmt/v1/machine_types/r5.xlarge',
          memory: {
            value: 34359738368,
            unit: 'B',
          },
          cpu: {
            value: 4,
            unit: 'vCPU',
          },
          cloud_provider: {
            kind: 'CloudProviderLink',
            id: 'aws',
            href: '/api/clusters_mgmt/v1/cloud_providers/aws',
          },
          resource_name: 'mem.small',
        },
        {
          kind: 'MachineType',
          name: 'r5.2xlarge - Memory Optimized',
          category: 'memory_optimized',
          size: 'medium',
          id: 'r5.2xlarge',
          href: '/api/clusters_mgmt/v1/machine_types/r5.2xlarge',
          memory: {
            value: 68719476736,
            unit: 'B',
          },
          cpu: {
            value: 8,
            unit: 'vCPU',
          },
          cloud_provider: {
            kind: 'CloudProviderLink',
            id: 'aws',
            href: '/api/clusters_mgmt/v1/cloud_providers/aws',
          },
          resource_name: 'mem.medium',
        },
        {
          kind: 'MachineType',
          name: 'r5.4xlarge - Memory Optimized',
          category: 'memory_optimized',
          size: 'large',
          id: 'r5.4xlarge',
          href: '/api/clusters_mgmt/v1/machine_types/r5.4xlarge',
          memory: {
            value: 137438953472,
            unit: 'B',
          },
          cpu: {
            value: 16,
            unit: 'vCPU',
          },
          cloud_provider: {
            kind: 'CloudProviderLink',
            id: 'aws',
            href: '/api/clusters_mgmt/v1/cloud_providers/aws',
          },
          resource_name: 'mem.large',
        },
        {
          kind: 'MachineType',
          name: 'c5.2xlarge - Compute Optimized',
          category: 'compute_optimized',
          size: 'medium',
          id: 'c5.2xlarge',
          href: '/api/clusters_mgmt/v1/machine_types/c5.2xlarge',
          memory: {
            value: 17179869184,
            unit: 'B',
          },
          cpu: {
            value: 8,
            unit: 'vCPU',
          },
          cloud_provider: {
            kind: 'CloudProviderLink',
            id: 'aws',
            href: '/api/clusters_mgmt/v1/cloud_providers/aws',
          },
          resource_name: 'cpu.medium',
        },
        {
          kind: 'MachineType',
          name: 'c5.4xlarge - Compute Optimized',
          category: 'compute_optimized',
          size: 'large',
          id: 'c5.4xlarge',
          href: '/api/clusters_mgmt/v1/machine_types/c5.4xlarge',
          memory: {
            value: 34359738368,
            unit: 'B',
          },
          cpu: {
            value: 16,
            unit: 'vCPU',
          },
          cloud_provider: {
            kind: 'CloudProviderLink',
            id: 'aws',
            href: '/api/clusters_mgmt/v1/cloud_providers/aws',
          },
          resource_name: 'cpu.large',
        },
      ],
      gcp: [
        {
          kind: 'MachineType',
          name: 'custom-16-131072-ext - Memory Optimized',
          category: 'memory_optimized',
          size: 'large',
          id: 'custom-16-131072-ext',
          href: '/api/clusters_mgmt/v1/machine_types/custom-16-131072-ext',
          memory: {
            value: 137438953472,
            unit: 'B',
          },
          cpu: {
            value: 16,
            unit: 'vCPU',
          },
          cloud_provider: {
            kind: 'CloudProviderLink',
            id: 'gcp',
            href: '/api/clusters_mgmt/v1/cloud_providers/gcp',
          },
          resource_name: 'mem.large',
        },
        {
          kind: 'MachineType',
          name: 'custom-16-32768 - Compute Optimized',
          category: 'compute_optimized',
          size: 'large',
          id: 'custom-16-32768',
          href: '/api/clusters_mgmt/v1/machine_types/custom-16-32768',
          memory: {
            value: 34359738368,
            unit: 'B',
          },
          cpu: {
            value: 16,
            unit: 'vCPU',
          },
          cloud_provider: {
            kind: 'CloudProviderLink',
            id: 'gcp',
            href: '/api/clusters_mgmt/v1/cloud_providers/gcp',
          },
          resource_name: 'cpu.large',
        },
        {
          kind: 'MachineType',
          name: 'custom-16-65536 - General Purpose',
          category: 'general_purpose',
          size: 'large',
          id: 'custom-16-65536',
          href: '/api/clusters_mgmt/v1/machine_types/custom-16-65536',
          memory: {
            value: 68719476736,
            unit: 'B',
          },
          cpu: {
            value: 16,
            unit: 'vCPU',
          },
          cloud_provider: {
            kind: 'CloudProviderLink',
            id: 'gcp',
            href: '/api/clusters_mgmt/v1/cloud_providers/gcp',
          },
          resource_name: 'gp.large',
        },
        {
          kind: 'MachineType',
          name: 'custom-4-16384 - General Purpose',
          category: 'general_purpose',
          size: 'small',
          id: 'custom-4-16384',
          href: '/api/clusters_mgmt/v1/machine_types/custom-4-16384',
          memory: {
            value: 17179869184,
            unit: 'B',
          },
          cpu: {
            value: 4,
            unit: 'vCPU',
          },
          cloud_provider: {
            kind: 'CloudProviderLink',
            id: 'gcp',
            href: '/api/clusters_mgmt/v1/cloud_providers/gcp',
          },
          resource_name: 'gp.small',
        },
        {
          kind: 'MachineType',
          name: 'custom-4-32768-ext - Memory Optimized',
          category: 'memory_optimized',
          size: 'small',
          id: 'custom-4-32768-ext',
          href: '/api/clusters_mgmt/v1/machine_types/custom-4-32768-ext',
          memory: {
            value: 34359738368,
            unit: 'B',
          },
          cpu: {
            value: 4,
            unit: 'vCPU',
          },
          cloud_provider: {
            kind: 'CloudProviderLink',
            id: 'gcp',
            href: '/api/clusters_mgmt/v1/cloud_providers/gcp',
          },
          resource_name: 'mem.small',
        },
        {
          kind: 'MachineType',
          name: 'custom-8-16384 - Compute Optimized',
          category: 'compute_optimized',
          size: 'medium',
          id: 'custom-8-16384',
          href: '/api/clusters_mgmt/v1/machine_types/custom-8-16384',
          memory: {
            value: 17179869184,
            unit: 'B',
          },
          cpu: {
            value: 8,
            unit: 'vCPU',
          },
          cloud_provider: {
            kind: 'CloudProviderLink',
            id: 'gcp',
            href: '/api/clusters_mgmt/v1/cloud_providers/gcp',
          },
          resource_name: 'cpu.medium',
        },
        {
          kind: 'MachineType',
          name: 'custom-8-32768 - General Purpose',
          category: 'general_purpose',
          size: 'medium',
          id: 'custom-8-32768',
          href: '/api/clusters_mgmt/v1/machine_types/custom-8-32768',
          memory: {
            value: 34359738368,
            unit: 'B',
          },
          cpu: {
            value: 8,
            unit: 'vCPU',
          },
          cloud_provider: {
            kind: 'CloudProviderLink',
            id: 'gcp',
            href: '/api/clusters_mgmt/v1/cloud_providers/gcp',
          },
          resource_name: 'gp.medium',
        },
        {
          kind: 'MachineType',
          name: 'custom-8-65536-ext - Memory Optimized',
          category: 'memory_optimized',
          size: 'medium',
          id: 'custom-8-65536-ext',
          href: '/api/clusters_mgmt/v1/machine_types/custom-8-65536-ext',
          memory: {
            value: 68719476736,
            unit: 'B',
          },
          cpu: {
            value: 8,
            unit: 'vCPU',
          },
          cloud_provider: {
            kind: 'CloudProviderLink',
            id: 'gcp',
            href: '/api/clusters_mgmt/v1/cloud_providers/gcp',
          },
          resource_name: 'mem.medium',
        },
      ],
    },
    typesByID: {
      'c5.2xlarge': {
        kind: 'MachineType',
        name: 'c5.2xlarge - Compute Optimized',
        category: 'compute_optimized',
        size: 'medium',
        id: 'c5.2xlarge',
        href: '/api/clusters_mgmt/v1/machine_types/c5.2xlarge',
        memory: {
          value: 17179869184,
          unit: 'B',
        },
        cpu: {
          value: 8,
          unit: 'vCPU',
        },
        cloud_provider: {
          kind: 'CloudProviderLink',
          id: 'aws',
          href: '/api/clusters_mgmt/v1/cloud_providers/aws',
        },
        resource_name: 'cpu.medium',
      },
      'c5.4xlarge': {
        kind: 'MachineType',
        name: 'c5.4xlarge - Compute Optimized',
        category: 'compute_optimized',
        size: 'large',
        id: 'c5.4xlarge',
        href: '/api/clusters_mgmt/v1/machine_types/c5.4xlarge',
        memory: {
          value: 34359738368,
          unit: 'B',
        },
        cpu: {
          value: 16,
          unit: 'vCPU',
        },
        cloud_provider: {
          kind: 'CloudProviderLink',
          id: 'aws',
          href: '/api/clusters_mgmt/v1/cloud_providers/aws',
        },
        resource_name: 'cpu.large',
      },
      'm5.2xlarge': {
        kind: 'MachineType',
        name: 'm5.2xlarge - General Purpose',
        category: 'general_purpose',
        size: 'medium',
        id: 'm5.2xlarge',
        href: '/api/clusters_mgmt/v1/machine_types/m5.2xlarge',
        memory: {
          value: 34359738368,
          unit: 'B',
        },
        cpu: {
          value: 8,
          unit: 'vCPU',
        },
        cloud_provider: {
          kind: 'CloudProviderLink',
          id: 'aws',
          href: '/api/clusters_mgmt/v1/cloud_providers/aws',
        },
        resource_name: 'gp.medium',
      },
      'm5.4xlarge': {
        kind: 'MachineType',
        name: 'm5.4xlarge - General Purpose',
        category: 'general_purpose',
        size: 'large',
        id: 'm5.4xlarge',
        href: '/api/clusters_mgmt/v1/machine_types/m5.4xlarge',
        memory: {
          value: 68719476736,
          unit: 'B',
        },
        cpu: {
          value: 16,
          unit: 'vCPU',
        },
        cloud_provider: {
          kind: 'CloudProviderLink',
          id: 'aws',
          href: '/api/clusters_mgmt/v1/cloud_providers/aws',
        },
        resource_name: 'gp.large',
      },
      'm5.8xlarge': {
        kind: 'MachineType',
        name: 'General purpose - M5.8XLarge',
        category: 'general_purpose',
        size: 'xlarge',
        id: 'm5.8xlarge',
        href: '/api/clusters_mgmt/v1/machine_types/m5.8xlarge',
        memory: {
          value: 137438953472,
          unit: 'B',
        },
        cpu: {
          value: 32,
          unit: 'vCPU',
        },
        cloud_provider: {
          kind: 'CloudProviderLink',
          id: 'aws',
          href: '/api/clusters_mgmt/v1/cloud_providers/aws',
        },
        resource_name: 'gp.xlarge',
      },
      'm5.xlarge': {
        kind: 'MachineType',
        name: 'm5.xlarge - General Purpose',
        category: 'general_purpose',
        size: 'small',
        id: 'm5.xlarge',
        href: '/api/clusters_mgmt/v1/machine_types/m5.xlarge',
        memory: {
          value: 17179869184,
          unit: 'B',
        },
        cpu: {
          value: 4,
          unit: 'vCPU',
        },
        cloud_provider: {
          kind: 'CloudProviderLink',
          id: 'aws',
          href: '/api/clusters_mgmt/v1/cloud_providers/aws',
        },
        resource_name: 'gp.small',
      },
      'r5.2xlarge': {
        kind: 'MachineType',
        name: 'r5.2xlarge - Memory Optimized',
        category: 'memory_optimized',
        size: 'medium',
        id: 'r5.2xlarge',
        href: '/api/clusters_mgmt/v1/machine_types/r5.2xlarge',
        memory: {
          value: 68719476736,
          unit: 'B',
        },
        cpu: {
          value: 8,
          unit: 'vCPU',
        },
        cloud_provider: {
          kind: 'CloudProviderLink',
          id: 'aws',
          href: '/api/clusters_mgmt/v1/cloud_providers/aws',
        },
        resource_name: 'mem.medium',
      },
      'r5.4xlarge': {
        kind: 'MachineType',
        name: 'r5.4xlarge - Memory Optimized',
        category: 'memory_optimized',
        size: 'large',
        id: 'r5.4xlarge',
        href: '/api/clusters_mgmt/v1/machine_types/r5.4xlarge',
        memory: {
          value: 137438953472,
          unit: 'B',
        },
        cpu: {
          value: 16,
          unit: 'vCPU',
        },
        cloud_provider: {
          kind: 'CloudProviderLink',
          id: 'aws',
          href: '/api/clusters_mgmt/v1/cloud_providers/aws',
        },
        resource_name: 'mem.large',
      },
      'r5.xlarge': {
        kind: 'MachineType',
        name: 'r5.xlarge - Memory Optimized',
        category: 'memory_optimized',
        size: 'small',
        id: 'r5.xlarge',
        href: '/api/clusters_mgmt/v1/machine_types/r5.xlarge',
        memory: {
          value: 34359738368,
          unit: 'B',
        },
        cpu: {
          value: 4,
          unit: 'vCPU',
        },
        cloud_provider: {
          kind: 'CloudProviderLink',
          id: 'aws',
          href: '/api/clusters_mgmt/v1/cloud_providers/aws',
        },
        resource_name: 'mem.small',
      },
      'custom-16-131072-ext': {
        kind: 'MachineType',
        name: 'custom-16-131072-ext - Memory Optimized',
        category: 'memory_optimized',
        size: 'large',
        id: 'custom-16-131072-ext',
        href: '/api/clusters_mgmt/v1/machine_types/custom-16-131072-ext',
        memory: {
          value: 137438953472,
          unit: 'B',
        },
        cpu: {
          value: 16,
          unit: 'vCPU',
        },
        cloud_provider: {
          kind: 'CloudProviderLink',
          id: 'gcp',
          href: '/api/clusters_mgmt/v1/cloud_providers/gcp',
        },
        resource_name: 'mem.large',
      },
      'custom-16-32768': {
        kind: 'MachineType',
        name: 'custom-16-32768 - Compute Optimized',
        category: 'compute_optimized',
        size: 'large',
        id: 'custom-16-32768',
        href: '/api/clusters_mgmt/v1/machine_types/custom-16-32768',
        memory: {
          value: 34359738368,
          unit: 'B',
        },
        cpu: {
          value: 16,
          unit: 'vCPU',
        },
        cloud_provider: {
          kind: 'CloudProviderLink',
          id: 'gcp',
          href: '/api/clusters_mgmt/v1/cloud_providers/gcp',
        },
        resource_name: 'cpu.large',
      },
      'custom-16-65536': {
        kind: 'MachineType',
        name: 'custom-16-65536 - General Purpose',
        category: 'general_purpose',
        size: 'large',
        id: 'custom-16-65536',
        href: '/api/clusters_mgmt/v1/machine_types/custom-16-65536',
        memory: {
          value: 68719476736,
          unit: 'B',
        },
        cpu: {
          value: 16,
          unit: 'vCPU',
        },
        cloud_provider: {
          kind: 'CloudProviderLink',
          id: 'gcp',
          href: '/api/clusters_mgmt/v1/cloud_providers/gcp',
        },
        resource_name: 'gp.large',
      },
      'custom-4-16384': {
        kind: 'MachineType',
        name: 'custom-4-16384 - General Purpose',
        category: 'general_purpose',
        size: 'small',
        id: 'custom-4-16384',
        href: '/api/clusters_mgmt/v1/machine_types/custom-4-16384',
        memory: {
          value: 17179869184,
          unit: 'B',
        },
        cpu: {
          value: 4,
          unit: 'vCPU',
        },
        cloud_provider: {
          kind: 'CloudProviderLink',
          id: 'gcp',
          href: '/api/clusters_mgmt/v1/cloud_providers/gcp',
        },
        resource_name: 'gp.small',
      },
      'custom-4-32768-ext': {
        kind: 'MachineType',
        name: 'custom-4-32768-ext - Memory Optimized',
        category: 'memory_optimized',
        size: 'small',
        id: 'custom-4-32768-ext',
        href: '/api/clusters_mgmt/v1/machine_types/custom-4-32768-ext',
        memory: {
          value: 34359738368,
          unit: 'B',
        },
        cpu: {
          value: 4,
          unit: 'vCPU',
        },
        cloud_provider: {
          kind: 'CloudProviderLink',
          id: 'gcp',
          href: '/api/clusters_mgmt/v1/cloud_providers/gcp',
        },
        resource_name: 'mem.small',
      },
      'custom-8-16384': {
        kind: 'MachineType',
        name: 'custom-8-16384 - Compute Optimized',
        category: 'compute_optimized',
        size: 'medium',
        id: 'custom-8-16384',
        href: '/api/clusters_mgmt/v1/machine_types/custom-8-16384',
        memory: {
          value: 17179869184,
          unit: 'B',
        },
        cpu: {
          value: 8,
          unit: 'vCPU',
        },
        cloud_provider: {
          kind: 'CloudProviderLink',
          id: 'gcp',
          href: '/api/clusters_mgmt/v1/cloud_providers/gcp',
        },
        resource_name: 'cpu.medium',
      },
      'custom-8-32768': {
        kind: 'MachineType',
        name: 'custom-8-32768 - General Purpose',
        category: 'general_purpose',
        size: 'medium',
        id: 'custom-8-32768',
        href: '/api/clusters_mgmt/v1/machine_types/custom-8-32768',
        memory: {
          value: 34359738368,
          unit: 'B',
        },
        cpu: {
          value: 8,
          unit: 'vCPU',
        },
        cloud_provider: {
          kind: 'CloudProviderLink',
          id: 'gcp',
          href: '/api/clusters_mgmt/v1/cloud_providers/gcp',
        },
        resource_name: 'gp.medium',
      },
      'custom-8-65536-ext': {
        kind: 'MachineType',
        name: 'custom-8-65536-ext - Memory Optimized',
        category: 'memory_optimized',
        size: 'medium',
        id: 'custom-8-65536-ext',
        href: '/api/clusters_mgmt/v1/machine_types/custom-8-65536-ext',
        memory: {
          value: 68719476736,
          unit: 'B',
        },
        cpu: {
          value: 8,
          unit: 'vCPU',
        },
        cloud_provider: {
          kind: 'CloudProviderLink',
          id: 'gcp',
          href: '/api/clusters_mgmt/v1/cloud_providers/gcp',
        },
        resource_name: 'mem.medium',
      },
    },
  },
};


const stateWithNoQuota = {
  ...stateWithQuota,
  userProfile: { organization: { fulfilled: true, quotaList: {} } },
};


export { stateWithQuota, stateWithNoQuota };
