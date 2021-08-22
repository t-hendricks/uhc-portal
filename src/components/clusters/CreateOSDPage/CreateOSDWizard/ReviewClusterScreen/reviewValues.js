import { billingModels } from '../../../../../common/subscriptionTypes';
import { humanizeValueWithUnitGiB } from '../../../../../common/units';
import {
  MACHINE_CIDR_PLACEHOLDER,
  SERVICE_CIDR_PLACEHOLDER,
  HOST_PREFIX_PLACEHOLDER,
  podCidrPlaceholder,
} from '../../CreateOSDForm/FormSections/NetworkingSection/networkingPlaceholders';
import parseUpdateSchedule from '../../../common/Upgrades/parseUpdateSchedule';

/**
 * reviewValues structure - key: field name
 * {
 *  title - human readable title
 *  values - map from values to human readable strings. optional.
 *           when both `values` and `valueTransform` are unspecified, actual value is shown.
 *  valueTransfrom - function to transform current value to human readable string,
 *                   gets two parameters: value (current value), allValues (all form values)
 *                   executed when `values` is not defined,
 *                   or when `values` has no entry for the provided value. optional.
 *  isBoolean - when set to `true`, value `undefined` will be treated as `false`,
 *             to match the behaviour of a boolean field.
 * }
 */
const reviewValues = {
  billing_model: {
    title: 'Subscription type',
    values: {
      [billingModels.STANDARD]: 'Annual: Fixed capacity subscription from Red Hat',
      [billingModels.MARKETPLACE]: 'On-demand: Flexible usage billed through the Red Hat Marketplace',
      'standard-trial': 'Free trial (upgradeable)',
    },
  },
  byoc: {
    title: 'Infrastracture type',
    isBoolean: true,
    values: { // note: keys here are strings, on purpose, to match redux-form behaviour
      true: 'Customer cloud subscription',
      false: 'Red Hat cloud account',
    },
  },
  cloud_provider: {
    title: 'Cloud provider',
    valueTransform: value => value.toUpperCase(),
  },
  name: {
    title: 'Cluster name',
  },
  region: {
    title: 'Region',
  },
  multi_az: {
    title: 'Availability',
    isBoolean: true,
    values: {
      true: 'Multi zone',
      false: 'Single zone',
    },
  },
  persistent_storage: {
    title: 'Persistent storage',
    valueTransform: (value) => {
      const humanized = humanizeValueWithUnitGiB(parseFloat(value));
      return `${humanized.value} GiB`;
    },
  },
  load_balancers: {
    title: 'Load balancers',
  },
  upgrade_policy: {
    title: 'Updates',
  },
  automatic_upgrade_schedule: {
    title: 'Automatic upgrade schedule',
    valueTransform: (value) => {
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const hours = [...Array(24).keys()].map(hour => `${hour.toString().padStart(2, 0)}:00`);
      const [hour, day] = parseUpdateSchedule(value);
      return `Every ${days[day]} at ${hours[hour]} UTC`;
    },
  },
  node_drain_grace_period: {
    title: 'Node draining',
    valueTransform: value => `${value} minutes`,
  },
  etcd_encryption: {
    title: 'etcd encryption',
    isBoolean: true,
    values: {
      true: 'Enabled',
      false: 'Disabled',
    },
  },
  network_configuration_toggle: {
    title: 'Networking',
    values: {
      basic: 'Basic',
      advanced: 'Advanced',
    },
  },
  machine_type: {
    title: 'Node instance type',
  },
  autoscalingEnabled: {
    title: 'Autoscaling',
    isBoolean: true,
    values: {
      true: 'Enabled',
      false: 'Disabled',
    },
  },
  nodes_compute: {
    title: 'Compute node count',
    valueTransform: (value, allValues) => {
      if (allValues.multi_az === 'true') {
        return `${value / 3} (× 3 zones = ${value} compute nodes)`;
      }
      return value;
    },
  },
  network_machine_cidr: {
    title: 'Machine CIDR',
    valueTransform: (value) => {
      if (value) {
        return value;
      }
      return `${MACHINE_CIDR_PLACEHOLDER} (default)`;
    },
  },
  network_service_cidr: {
    title: 'Service CIDR',
    valueTransform: (value) => {
      if (value) {
        return value;
      }
      return `${SERVICE_CIDR_PLACEHOLDER} (default)`;
    },
  },
  network_pod_cidr: {
    title: 'Pod CIDR',
    valueTransform: (value, allValues) => {
      if (value) {
        return value;
      }
      return `${podCidrPlaceholder(allValues.cloud_provider)} (default)`;
    },
  },
  network_host_prefix: {
    title: 'Host prefix',
    valueTransform: (value) => {
      if (value) {
        return `/${value}`;
      }
      return `${HOST_PREFIX_PLACEHOLDER} (default)`;
    },
  },
  cluster_privacy: {
    title: 'Cluster privacy',
    values: {
      external: 'Public',
      internal: 'Private',
      undefined: 'Public',
    },
  },
};

export default reviewValues;
