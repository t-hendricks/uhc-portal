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

        };
        const request = createClusterRequest(params, data);
        expect(request.billing_model).toEqual('standard');
        expect(request.product).toEqual({ id: 'osdtrial' });
        expect(request.cloud_provider.id).toEqual('gcp');
        expect(request.ccs.enabled).toEqual(true);
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
        };
        const request = createClusterRequest(params, data);
        expect(request.billing_model).toEqual('standard');
        expect(request.product).toEqual({ id: 'osdtrial' });
        expect(request.cloud_provider.id).toEqual('aws');
        expect(request.ccs.enabled).toEqual(true);
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
      const params = {};

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
        };
        const request = createClusterRequest(params, data);
        expect(request.billing_model).toEqual('standard');
        expect(request.product).toEqual({ id: 'osdtrial' });
        expect(request.cloud_provider.id).toEqual('aws');
        expect(request.ccs.enabled).toEqual(true);
      });

      it('select On-demand (Marketplace) billing, CCS, GCP', () => {
        const data = {
          ...baseFormData,
          billing_model: 'marketplace',
          product: normalizedProducts.OSD,
          byoc: 'true', // forced by marketplace.
          cloud_provider: 'gcp',
          gcp_service_account: '{}',
        };

        const request = createClusterRequest(params, data);
        expect(request.billing_model).toEqual('marketplace');
        expect(request.product).toEqual({ id: 'osd' });
        expect(request.cloud_provider.id).toEqual('gcp');
        expect(request.ccs.enabled).toEqual(true);
      });
    });

    describe('OSD Trial button', () => {
      const params = {};

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
      // TODO: OSD is what submit button actually passes,
      //   because mapDispatchToProps takes the silly product=OSD passed by Router.
      const params = { product: normalizedProducts.OSD };

      it.skip('defaults', () => {
        const data = {
          ...rosaFormData,
          billing_model: 'standard',
          product: normalizedProducts.ROSA,
          cloud_provider: 'aws',
          // TODO: this is actual field value - we didn't pass isByoc.
          byoc: 'false',
        };
        const request = createClusterRequest(params, data);
        expect(request.billing_model).toEqual('standard');
        expect(request.product).toEqual({ id: 'rosa' });
        expect(request.cloud_provider.id).toEqual('aws');
        expect(request.ccs.enabled).toEqual(true);
      });
    });
  });
});
