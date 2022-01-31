import { createClusterRequest } from './submitOSDRequest';
import { normalizedProducts } from '../../../common/subscriptionTypes';

describe('createClusterRequest', () => {
  // These tests were captured from logging actual arguments passed to submitOSDRequest().
  // I hope we can keep them in sync with reality...

  // Common fields (as of Jan 2022, likely incomplete over time).
  const baseFormData = {
    name: 'test-name',
    nodes_compute: '9',
    dns_base_domain: '',
    aws_access_key_id: '',
    aws_secret_access_key: '',
    region: 'somewhere', // GCP defaults 'us-east1', AWS 'us-east-1', not important here.
    multi_az: 'true',
    persistent_storage: '107374182400',
    load_balancers: '0',
    network_configuration_toggle: 'basic',
    disable_scp_checks: false,
    node_drain_grace_period: 60,
    upgrade_policy: 'manual',
    automatic_upgrade_schedule: '0 0 * * 0',
    node_labels: [
      {},
    ],
    enable_user_workload_monitoring: true,
    machine_type: 'PDP-11', // GCP defaults 'custom-4-16384', AWS 'm5.xlarge' not important here.
    cluster_version: {
      kind: 'Version',
      id: 'openshift-v4.9.11',
      href: '/api/clusters_mgmt/v1/versions/openshift-v4.9.11',
      raw_id: '4.9.11',
      enabled: true,
      default: true,
      channel_group: 'stable',
      rosa_enabled: true,
      end_of_life_timestamp: '2022-07-18T00:00:00Z',
    },
  };

  const rosaFormData = {
    ...baseFormData,
    associated_aws_id: '123456789',
    installer_role_arn: 'arn:aws:iam::123456789:role/Foo-Installer-Role',
    support_role_arn: 'arn:aws:iam::123456789:role/Foo-Support-Role',
    control_plane_role_arn: 'arn:aws:iam::123456789:role/Foo-ControlPlane-Role',
    worker_role_arn: 'arn:aws:iam::123456789:role/Foo-Worker-Role',
    role_mode: 'manual',
    // TODO: can finish ROSA wizard with machine_type not set?
  };

  const gcpVPCData = {
    install_to_vpc: true,
    vpc_name: 'nsimha-test-1-sd8x8-network',
    control_plane_subnet: 'nsimha-test-1-sd8x8-master-subnet',
    compute_subnet: 'nsimha-test-1-sd8x8-worker-subnet',
  };

  const expectGCPVPC = (request) => {
    expect(request.gcp_network).toEqual({
      compute_subnet: 'nsimha-test-1-sd8x8-worker-subnet',
      control_plane_subnet: 'nsimha-test-1-sd8x8-master-subnet',
      vpc_name: 'nsimha-test-1-sd8x8-network',
    });
  };

  const awsVPCData = {
    install_to_vpc: true,
    az_0: 'us-east-1d',
    private_subnet_id_0: 'subnet-00b3753ab2dd892ac',
    public_subnet_id_0: 'subnet-0703ec90283d1fd6b',
    az_1: 'us-east-1e',
    private_subnet_id_1: 'subnet-0735da52d658da28b',
    public_subnet_id_1: 'subnet-09404f4fc139bd94e',
    az_2: 'us-east-1f',
    private_subnet_id_2: 'subnet-00327948731118662',
    public_subnet_id_2: 'subnet-09ad4ef49f2e29996',
  };

  const expectAWSVPC = (request) => {
    expect(request.aws.subnet_ids).toEqual(
      [
        'subnet-00b3753ab2dd892ac',
        'subnet-0703ec90283d1fd6b',
        'subnet-0735da52d658da28b',
        'subnet-09404f4fc139bd94e',
        'subnet-00327948731118662',
        'subnet-09ad4ef49f2e29996',
      ],
    );
    expect(request.nodes.availability_zones).toEqual(
      [
        'us-east-1d',
        'us-east-1e',
        'us-east-1f',
      ],
    );
  };

  const CIDRData = {
    network_machine_cidr: '10.1.128.0/17',
    network_host_prefix: '24',
  };

  const expectCIDR = (request) => {
    expect(request.network).toEqual({
      machine_cidr: '10.1.128.0/17',
      host_prefix: 24,
    });
  };

  describe('CreateOSDForm', () => {
    // Form gets `product` prop affecting *initial* values for several fields notably
    // `billing_model` & `product`.  The final choice is in the field.
    // Form doesn't have `cloud_provider` field, gets it as prop.

    describe('OSD button -> GCP', () => {
      const params = { cloudProviderID: 'gcp' };

      it('rhInfra', () => {
        const data = {
          ...baseFormData,
          billing_model: 'standard',
          product: normalizedProducts.OSD,
          byoc: 'false',
        };
        const request = createClusterRequest(params, data);
        expect(request.billing_model).toEqual('standard');
        expect(request.product).toEqual({ id: 'osd' });
        expect(request.cloud_provider.id).toEqual('gcp');
        expect(request.ccs).toBeUndefined();
      });

      it('select Free trial, CCS', () => {
        const data = {
          ...baseFormData,
          // 'standard-trial' is a fake value, a kludge for also initializing product;
          // the backend request only gets the part before '-'.
          billing_model: 'standard-trial',
          product: normalizedProducts.OSDTrial,
          byoc: 'true', // forced by OSDTrial.
          gcp_service_account: '{}',
          // CCS also lowers nodes_compute default, but not important for these tests.
          network_configuration_toggle: 'advanced',
          ...gcpVPCData,
          ...CIDRData,
        };
        const request = createClusterRequest(params, data);
        expect(request.billing_model).toEqual('standard');
        expect(request.product).toEqual({ id: 'osdtrial' });
        expect(request.cloud_provider.id).toEqual('gcp');
        expect(request.ccs.enabled).toEqual(true);
        expectGCPVPC(request);
        expectCIDR(request);
      });

      it('select On-demand (Marketplace) billing, CCS', () => {
        const data = {
          ...baseFormData,
          billing_model: 'marketplace',
          product: normalizedProducts.OSD,
          byoc: 'true', // forced by marketplace.
          gcp_service_account: '{}',
        };

        const request = createClusterRequest(params, data);
        expect(request.billing_model).toEqual('marketplace');
        expect(request.product).toEqual({ id: 'osd' });
        expect(request.cloud_provider.id).toEqual('gcp');
        expect(request.ccs.enabled).toEqual(true);
      });
    });

    describe('OSD Trial button -> AWS', () => {
      const params = { cloudProviderID: 'aws' };

      it('CCS', () => {
        const data = {
          ...baseFormData,
          // 'standard-trial' is a fake value, a kludge for also initializing product;
          // the backend request only gets the part before '-'.
          billing_model: 'standard-trial',
          product: normalizedProducts.OSDTrial,
          byoc: 'true', // forced by OSDTrial.
          network_configuration_toggle: 'advanced',
          ...awsVPCData,
        };
        const request = createClusterRequest(params, data);
        expect(request.billing_model).toEqual('standard');
        expect(request.product).toEqual({ id: 'osdtrial' });
        expect(request.cloud_provider.id).toEqual('aws');
        expect(request.ccs.enabled).toEqual(true);
        expectAWSVPC(request);
      });

      it('select Annual billing, rhInfra', () => {
        const data = {
          ...baseFormData,
          billing_model: 'standard',
          product: normalizedProducts.OSD,
          byoc: 'false',
        };

        const request = createClusterRequest(params, data);
        expect(request.billing_model).toEqual('standard');
        expect(request.product).toEqual({ id: 'osd' });
        expect(request.cloud_provider.id).toEqual('aws');
        expect(request.ccs).toBeUndefined();
      });

      it('select On-demand (Marketplace) billing, CCS', () => {
        const data = {
          ...baseFormData,
          billing_model: 'marketplace',
          product: normalizedProducts.OSD,
          byoc: 'true', // forced by marketplace.
        };

        const request = createClusterRequest(params, data);
        expect(request.billing_model).toEqual('marketplace');
        expect(request.product).toEqual({ id: 'osd' });
        expect(request.cloud_provider.id).toEqual('aws');
        expect(request.ccs.enabled).toEqual(true);
      });
    });
  });

  describe('CreateOSDWizard', () => {
    // OSD wizard gets `product` prop affecting *initial* values for several fields notably
    // `billing_model` & `product`.  The final choice is in the field.
    // OSD wizard selects `cloud_provider` inside, it's a regular field.

    describe('OSD button', () => {
      const params = { isWizard: true };

      it('rhInfra, AWS', () => {
        const data = {
          ...baseFormData,
          billing_model: 'standard',
          product: normalizedProducts.OSD,
          byoc: 'false',
          cloud_provider: 'aws',
        };
        const request = createClusterRequest(params, data);
        expect(request.billing_model).toEqual('standard');
        expect(request.product).toEqual({ id: 'osd' });
        expect(request.cloud_provider.id).toEqual('aws');
        expect(request.ccs).toBeUndefined();
      });

      it('select Free trial, CCS, AWS', () => {
        const data = {
          ...baseFormData,
          // 'standard-trial' is a fake value, a kludge for also initializing product;
          // the backend request only gets the part before '-'.
          billing_model: 'standard-trial',
          product: normalizedProducts.OSDTrial,
          byoc: 'true', // forced by OSDTrial.
          // CCS also lowers nodes_compute default, but not important for these tests.
          cloud_provider: 'aws',
          ...awsVPCData,
          ...CIDRData,
        };
        const request = createClusterRequest(params, data);
        expect(request.billing_model).toEqual('standard');
        expect(request.product).toEqual({ id: 'osdtrial' });
        expect(request.cloud_provider.id).toEqual('aws');
        expect(request.ccs.enabled).toEqual(true);
        expectAWSVPC(request);
        expectCIDR(request);
      });

      it('select On-demand (Marketplace) billing, CCS, GCP', () => {
        const data = {
          ...baseFormData,
          billing_model: 'marketplace',
          product: normalizedProducts.OSD,
          byoc: 'true', // forced by marketplace.
          cloud_provider: 'gcp',
          gcp_service_account: '{}',
          ...gcpVPCData,
        };

        const request = createClusterRequest(params, data);
        expect(request.billing_model).toEqual('marketplace');
        expect(request.product).toEqual({ id: 'osd' });
        expect(request.cloud_provider.id).toEqual('gcp');
        expect(request.ccs.enabled).toEqual(true);
        expectGCPVPC(request);
      });
    });

    describe('OSD Trial button', () => {
      const params = { isWizard: true };

      it('CCS, GCP', () => {
        const data = {
          ...baseFormData,
          // 'standard-trial' is a fake value, a kludge for also initializing product;
          // the backend request only gets the part before '-'.
          billing_model: 'standard-trial',
          product: normalizedProducts.OSDTrial,
          byoc: 'true', // forced by OSDTrial
          cloud_provider: 'gcp',
          gcp_service_account: '{}',
        };
        const request = createClusterRequest(params, data);
        expect(request.billing_model).toEqual('standard');
        expect(request.product).toEqual({ id: 'osdtrial' });
        expect(request.cloud_provider.id).toEqual('gcp');
        expect(request.ccs.enabled).toEqual(true);
      });

      it('select Annual billing, rhInfra, GCP', () => {
        const data = {
          ...baseFormData,
          billing_model: 'standard',
          product: normalizedProducts.OSD,
          byoc: 'false',
          cloud_provider: 'gcp',
        };
        const request = createClusterRequest(params, data);
        expect(request.billing_model).toEqual('standard');
        expect(request.product).toEqual({ id: 'osd' });
        expect(request.cloud_provider.id).toEqual('gcp');
        expect(request.ccs).toBeUndefined();
      });

      it('select On-demand (Marketplace) billing, CCS, AWS', () => {
        const data = {
          ...baseFormData,
          billing_model: 'marketplace',
          product: normalizedProducts.OSD,
          byoc: 'true', // forced by marketplace.
          cloud_provider: 'aws',
        };

        const request = createClusterRequest(params, data);
        expect(request.billing_model).toEqual('marketplace');
        expect(request.product).toEqual({ id: 'osd' });
        expect(request.cloud_provider.id).toEqual('aws');
        expect(request.ccs.enabled).toEqual(true);
      });
    });
  });

  describe('CreateROSAWizard', () => {
    // ROSA wizard has no choice about `product` or `cloud_provider` or 'byoc'.
    // For code uniformity, it initializes these fields in redux-form state
    // (without registering them or connecting to an actual Field component).

    describe('ROSA button', () => {
      const params = { isWizard: true };

      it('defaults', () => {
        const data = {
          ...rosaFormData,
          billing_model: 'standard',
          product: normalizedProducts.ROSA,
          cloud_provider: 'aws',
          byoc: 'true',
          ...CIDRData,
        };
        const request = createClusterRequest(params, data);
        expect(request.billing_model).toEqual('standard');
        expect(request.product).toEqual({ id: 'rosa' });
        expect(request.cloud_provider.id).toEqual('aws');
        expect(request.ccs.enabled).toEqual(true);
        expectCIDR(request);
      });
    });
  });
});
