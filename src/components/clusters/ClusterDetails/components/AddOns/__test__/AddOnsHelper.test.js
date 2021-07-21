import cloneDeep from 'lodash/cloneDeep';
import {
  crcWorkspaces,
  managedIntegration,
  serviceMesh,
  dbaOperator,
  dbaOperatorResourceParam,
  loggingOperator,
  mockAddOns,
  mockClusterAddOns,
  mockClusterAddOnsParams,
  mockAddOnsInstallParamAndValues,
} from './AddOns.fixtures';
import {
  crcWorkspacesAddonQuota,
  loggingAddonQuota,
  dbaAddonQuota,
  addonsQuota,
} from '../../../../common/__test__/quota.fixtures';

import fixtures from '../../../__test__/ClusterDetails.fixtures';

import {
  isAvailable,
  isInstalled,
  hasQuota,
  quotaCostOptions,
  availableAddOns,
  hasParameters,
  getParameter,
  parameterValuesForEditing,
  parameterAndValue,
  validateAddOnRequirements,
  validateAddOnParameterConditions,
  getParameters,
  minQuotaCount,
} from '../AddOnsHelper';

const OSDCluster = fixtures.clusterDetails.cluster;
const OSDCCSCluster = fixtures.CCSClusterDetails.cluster;
const ROSACluster = fixtures.ROSAClusterDetails.cluster;
const RHMICluster = fixtures.RHMIClusterDetails.cluster;

const org = { fulfilled: true };

describe('isAvailable', () => {
  it('should determine that logging add-on is available on rhInfra', () => {
    const available = isAvailable(loggingOperator, OSDCluster, org, loggingAddonQuota);
    expect(available).toBe(true);
  });

  it('should determine that logging add-on is available on CCS', () => {
    const available = isAvailable(loggingOperator, OSDCCSCluster, org, loggingAddonQuota);
    expect(available).toBe(true);
  });

  it('should determine that free add-on is available', () => {
    const available = isAvailable(
      crcWorkspaces, OSDCluster, org, crcWorkspacesAddonQuota,
    );
    expect(available).toBe(true);
  });

  it('should determine that add-on is not available', () => {
    const available = isAvailable(serviceMesh, OSDCluster, org, dbaAddonQuota);
    expect(available).toBe(false);
  });

  it('should determine that add-on is available', () => {
    const available = isAvailable(dbaOperator, OSDCluster, org, dbaAddonQuota);
    expect(available).toBe(true);
  });

  it('should determine that add-on is available for non-OSD cluster', () => {
    // addon-crw-operator has product 'any'
    let available = isAvailable(
      crcWorkspaces, RHMICluster, org, crcWorkspacesAddonQuota,
    );
    expect(available).toBe(true);
    available = isAvailable(crcWorkspaces, ROSACluster, org, crcWorkspacesAddonQuota);
    expect(available).toBe(true);
    available = isAvailable(crcWorkspaces, OSDCluster, org, crcWorkspacesAddonQuota);
    expect(available).toBe(true);
  });

  it('should determine that several add-ons are available', () => {
    expect(isAvailable(serviceMesh, OSDCCSCluster, org, addonsQuota)).toBe(true);
    expect(isAvailable(crcWorkspaces, OSDCCSCluster, org, addonsQuota)).toBe(true);
    expect(isAvailable(dbaOperator, OSDCCSCluster, org, addonsQuota)).toBe(true);
    expect(isAvailable(loggingOperator, OSDCCSCluster, org, addonsQuota)).toBe(true);
  });
});

describe('isInstalled', () => {
  it('should determine that add-on is not installed', () => {
    const installed = isInstalled(managedIntegration, mockClusterAddOns);
    expect(installed).toBe(false);
  });

  it('should determine that add-on is installed', () => {
    const installed = isInstalled(serviceMesh, mockClusterAddOns);
    expect(installed).toBe(true);
  });
});

describe('hasQuota', () => {
  it('should determine that the org does not have quota on rhInfra', () => {
    const quota = hasQuota(loggingOperator, OSDCluster, org, loggingAddonQuota);
    expect(quota).toBe(false);
  });

  it('should determine that the org does not need quota on CCS', () => {
    const quota = hasQuota(loggingOperator, OSDCCSCluster, org, loggingAddonQuota);
    expect(quota).toBe(true);
  });

  it('should determine that the org does not need quota for the add-on', () => {
    const quota = hasQuota(crcWorkspaces, OSDCluster, org, crcWorkspacesAddonQuota);
    expect(quota).toBe(true);
  });

  it('should determine that the org does not have quota for different add-on', () => {
    const quota = hasQuota(serviceMesh, OSDCluster, org, dbaAddonQuota);
    expect(quota).toBe(false);
  });

  it('should determine that the org has quota for the add-on', () => {
    const quota = hasQuota(dbaOperator, OSDCluster, org, dbaAddonQuota);
    expect(quota).toBe(true);
  });

  it('should determine that the org does not have quota for the add-on with resource param', () => {
    // dbaOperatorResourceParam: min option = 16, dbaAddonQuota allowed = 15
    const quota = hasQuota(dbaOperatorResourceParam, OSDCluster, org, dbaAddonQuota);
    expect(quota).toBe(false);
  });

  it('should determine that the org does not need quota for the add-on on an OSD cluster', () => {
    const quota = hasQuota(crcWorkspaces, OSDCluster, org, crcWorkspacesAddonQuota);
    expect(quota).toBe(true);
  });

  it('should determine that the org does not need quota for the add-on on a ROSA cluster', () => {
    const quota = hasQuota(crcWorkspaces, ROSACluster, org, crcWorkspacesAddonQuota);
    expect(quota).toBe(true);
  });

  it('should determine that the org has quota for several add-ons', () => {
    expect(hasQuota(serviceMesh, OSDCCSCluster, org, addonsQuota)).toBe(true);
    expect(hasQuota(crcWorkspaces, OSDCCSCluster, org, addonsQuota)).toBe(true);
    expect(hasQuota(dbaOperator, OSDCCSCluster, org, addonsQuota)).toBe(true);
    expect(hasQuota(loggingOperator, OSDCCSCluster, org, addonsQuota)).toBe(true);
  });
});

describe('availableAddOns', () => {
  it('should return an empty list', () => {
    const addOns = availableAddOns({ items: [] }, OSDCluster, mockClusterAddOns, {
      fulfilled: true,
    }, addonsQuota);
    expect(addOns).toEqual([]);
  });

  it('should return a list of available add-ons', () => {
    const addOns = availableAddOns(mockAddOns, OSDCluster, mockClusterAddOns, {
      fulfilled: true,
    }, addonsQuota);
    expect(addOns).toEqual([crcWorkspaces, serviceMesh, dbaOperator, loggingOperator]);
  });
});

describe('hasParameters', () => {
  it('should determine that the add-on has parameters', () => {
    const hasParams = hasParameters(managedIntegration);
    expect(hasParams).toBe(true);
  });

  it('should determine that the add-on has no parameters', () => {
    const hasParams = hasParameters(crcWorkspaces);
    expect(hasParams).toBe(false);
  });
});

describe('getParameter', () => {
  it('should return the existing parameter', () => {
    const param = getParameter(managedIntegration, 'cidr-range');
    expect(param).toEqual(managedIntegration.parameters.items[0]);
  });

  it('should return undefined for non existing parameter', () => {
    const param = getParameter(managedIntegration, 'foo');
    expect(param).toEqual(undefined);
  });

  it('should return undefined for addOn with no parameters', () => {
    const param = getParameter(crcWorkspaces, 'cidr-range');
    expect(param).toEqual(undefined);
  });
});

describe('parameterValuesForEditing', () => {
  it('should return an empty object for addOn with no parameters', () => {
    const param = parameterValuesForEditing(mockClusterAddOnsParams.items[0], crcWorkspaces);
    expect(param).toEqual({ parameters: {} });
  });
  it('should return an empty object for addOn with parameters but no current values', () => {
    const param = parameterValuesForEditing(undefined, managedIntegration);
    expect(param).toEqual({ parameters: {} });
  });
  it('should return existing values', () => {
    const param = parameterValuesForEditing(mockClusterAddOnsParams.items[1], managedIntegration);
    expect(param).toEqual({ parameters: { 'cidr-range': '10.1.0.0/16' } });
  });
  it('should return only existing values for current addon parameters', () => {
    const param = parameterValuesForEditing(mockClusterAddOnsParams.items[2], managedIntegration);
    expect(param).toEqual({ parameters: { 'cidr-range': '10.1.0.0/16' } });
  });
  it('should return false for boolean addon param with no installation param value', () => {
    const mockAddOnsParams = { parameters: { items: [{ id: 'my-bool', value_type: 'boolean' }] } };
    const mockAddOnsInstallParams = {};
    const param = parameterValuesForEditing(mockAddOnsInstallParams, mockAddOnsParams);
    expect(param).toEqual({ parameters: { 'my-bool': false } });
  });
  it('should return true for boolean addon param with installation param value of "true"', () => {
    const mockAddOnsParams = { parameters: { items: [{ id: 'my-bool', value_type: 'boolean' }] } };
    const mockAddOnsInstallParams = { parameters: { items: [{ id: 'my-bool', value: 'true' }] } };
    const param = parameterValuesForEditing(mockAddOnsInstallParams, mockAddOnsParams);
    expect(param).toEqual({ parameters: { 'my-bool': true } });
  });
  it('should return false for boolean addon param with installation param value of "false"', () => {
    const mockAddOnsParams = { parameters: { items: [{ id: 'my-bool', value_type: 'boolean' }] } };
    const mockAddOnsInstallParams = { parameters: { items: [{ id: 'my-bool', value: 'false' }] } };
    const param = parameterValuesForEditing(mockAddOnsInstallParams, mockAddOnsParams);
    expect(param).toEqual({ parameters: { 'my-bool': false } });
  });
  it('should return undefined for param with options and no installation param value', () => {
    const mockAddOnsParams = {
      parameters: {
        items: [
          {
            id: 'my-string',
            value_type: 'string',
            options: [{
              name: 'option 1',
              value: 'options 1',
            }],
          },
        ],
      },
    };
    const mockAddOnsInstallParams = {};
    const param = parameterValuesForEditing(mockAddOnsInstallParams, mockAddOnsParams);
    expect(param).toEqual({ parameters: { 'my-string': undefined } });
  });
  it('should return current param value for param with options and installation param value', () => {
    const mockAddOnsParams = {
      parameters: {
        items: [
          {
            id: 'my-string',
            value_type: 'string',
            options: [{
              name: 'option 1',
              value: 'options 1',
            }, {
              name: 'option 2',
              value: 'options 2',
            }],
          },
        ],
      },
    };
    const mockAddOnsInstallParams = {
      parameters: {
        items: [
          {
            id: 'my-string',
            value: 'options 2',
          },
        ],
      },
    };
    const param = parameterValuesForEditing(mockAddOnsInstallParams, mockAddOnsParams);
    expect(param).toEqual({ parameters: { 'my-string': 'options 2' } });
  });
});

describe('quotaCostOptions', () => {
  it('returns all options when allowed quota greater than all values', () => {
    const allOptions = [{ name: 'Option 1', value: '1' }, { name: 'Option 2', value: '15' }];
    // crcWorkspacesAddonQuota allowed: 15, consumed: 0
    const quotaOptions = quotaCostOptions(
      'addon-crw-operator', OSDCluster, crcWorkspacesAddonQuota,
      allOptions, 0,
    );
    expect(quotaOptions).toEqual(allOptions);
  });
  it('removes options that are greater than allowed quota', () => {
    const allOptions = [{ name: 'Option 1', value: '15' }, { name: 'Option 2', value: '16' }];
    // crcWorkspacesAddonQuota allowed: 15, consumed: 0
    const quotaOptions = quotaCostOptions(
      'addon-crw-operator', OSDCluster, crcWorkspacesAddonQuota,
      allOptions, 0,
    );
    expect(quotaOptions).toEqual([{ name: 'Option 1', value: '15' }]);
  });
  it('returns empty options list when no quota', () => {
    const allOptions = [
      { name: 'Option 1', value: '1' },
      { name: 'Option 2', value: '2' },
      { name: 'Option 3', value: '5' },
    ];
    // loggingAddonQuota allowed: 5, consumed: 5
    const quotaOptions = quotaCostOptions(
      'addon-cluster-logging-operator', OSDCluster, loggingAddonQuota,
      allOptions, 0,
    );
    expect(quotaOptions).toEqual([]);
  });
  it('returns options that are included in the current value', () => {
    const allOptions = [
      { name: 'Option 1', value: '1' },
      { name: 'Option 2', value: '2' },
      { name: 'Option 3', value: '5' },
    ];
    // loggingAddonQuota allowed: 5, consumed: 5
    const quotaOptions = quotaCostOptions(
      'addon-cluster-logging-operator', OSDCluster, loggingAddonQuota,
      allOptions, 2,
    );
    expect(quotaOptions).toEqual([
      { name: 'Option 1', value: '1' },
      { name: 'Option 2', value: '2' },
    ]);
  });
  it('returns all options when unknown resource name', () => {
    const allOptions = [{ name: 'Option 1', value: '1' }, { name: 'Option 2', value: '15' }];
    // crcWorkspacesAddonQuota allowed: 15, consumed: 0
    const quotaOptions = quotaCostOptions(
      'not-a-valid-resource-name', OSDCluster, crcWorkspacesAddonQuota,
      allOptions, 0,
    );
    expect(quotaOptions).toEqual(allOptions);
  });
});

describe('minQuotaCount', () => {
  it('should return 1 by default', () => {
    const minCount = minQuotaCount({ id: 'tstAddon' });
    expect(minCount).toEqual(1);
  });
  it('should return 1 when no parameters', () => {
    const minCount = minQuotaCount({ id: 'tstAddon' });
    expect(minCount).toEqual(1);
  });
  it('should return 1 no resource parameter', () => {
    const minCount = minQuotaCount({
      id: 'tstAddon',
      resource_name: 'tstAddon',
      parameters: {
        items: [
          {
            id: 'tstAddon',
            value_type: 'string',
          },
        ],
      },
    });
    expect(minCount).toEqual(1);
  });
  it('should return 1 when resource parameter with no options', () => {
    const minCount = minQuotaCount({
      id: 'tstAddon',
      resource_name: 'tstAddon',
      parameters: {
        items: [
          {
            id: 'tstAddon',
            value_type: 'resource',
          },
        ],
      },
    });
    expect(minCount).toEqual(1);
  });
  it('should return min value from options when resource parameter with options', () => {
    const minCount = minQuotaCount({
      id: 'tstAddon',
      resource_name: 'tstAddon',
      parameters: {
        items: [
          {
            id: 'tstAddon',
            value_type: 'resource',
            options: [
              {
                name: 'Two',
                value: '2',
              },
              {
                name: 'Five',
                value: '5',
              },
            ],
          },
        ],
      },
    });
    expect(minCount).toEqual(2);
  });
});

describe('validateAddOnRequirements', () => {
  let tstAddOn;
  let tstCluster;

  beforeAll(() => {
    tstCluster = cloneDeep(OSDCluster);
  });

  it('should return true for addon with no requirements', () => {
    const status = validateAddOnRequirements(
      tstAddOn, tstCluster, {}, {},
    );
    expect(status.fulfilled)
      .toEqual(true);
    expect(status.errorMsgs)
      .toEqual([]);
  });

  describe('cluster', () => {
    beforeAll(() => {
      tstAddOn = {
        requirements: [
          {
            id: 'cluster',
            resource: 'cluster',
            data: {
              'product.id': 'osd',
            },
          },
        ],
      };
    });

    it('should return true for addon with fulfilled cluster requirements', () => {
      const status = validateAddOnRequirements(
        tstAddOn, tstCluster, {}, {},
      );
      expect(status.fulfilled)
        .toEqual(true);
      expect(status.errorMsgs)
        .toEqual([]);
    });
    it('should return false for addon with unfulfilled cluster requirements', () => {
      tstCluster.product.id = 'ROSA';
      const status = validateAddOnRequirements(
        tstAddOn, tstCluster, {}, {},
      );
      expect(status.fulfilled)
        .toEqual(false);
      expect(status.errorMsgs)
        .toEqual(['This addon requires a cluster where product.id is osd']);
    });
  });

  describe('addon', () => {
    beforeAll(() => {
      tstAddOn = {
        requirements: [
          {
            id: 'addon',
            resource: 'addon',
            data: {
              id: 'some-addon',
              state: 'ready',
            },
          },
        ],
      };
    });

    it('should return true for addon with fulfilled addon requirements', () => {
      const clusterAddOns = {
        items: [
          {
            kind: 'AddOnLink',
            href: '/api/clusters_mgmt/v1/addons/some-addon',
            id: 'some-addon',
            addon: {
              id: 'some-addon',
            },
            state: 'ready',
          },
        ],
      };
      const status = validateAddOnRequirements(
        tstAddOn, tstCluster, clusterAddOns, {},
      );
      expect(status.fulfilled)
        .toEqual(true);
      expect(status.errorMsgs)
        .toEqual([]);
    });
    it('should return false for addon with unfulfilled addon requirements', () => {
      const status = validateAddOnRequirements(
        tstAddOn, tstCluster, {}, {},
      );
      expect(status.fulfilled)
        .toEqual(false);
      expect(status.errorMsgs)
        .toEqual(['This addon requires an addon to be installed where id is some-addon and state '
        + 'is ready']);
    });
  });

  describe('machine_pool', () => {
    beforeAll(() => {
      tstAddOn = {
        requirements: [
          {
            id: 'machine_pool',
            resource: 'machine_pool',
            data: {
              replicas: 2,
              instance_type: 'm5.xlarge',
            },
          },
        ],
      };
    });

    it('should return true for addon with fulfilled machine pool requirements', () => {
      const clusterMachinePools = {
        data: [
          {
            id: 'some-machine-pool',
            instance_type: 'm5.xlarge',
            replicas: 4,
          },
        ],
      };
      const status = validateAddOnRequirements(
        tstAddOn, tstCluster, {}, clusterMachinePools,
      );
      expect(status.fulfilled)
        .toEqual(true);
      expect(status.errorMsgs)
        .toEqual([]);
    });
    it('should return false for addon with unfulfilled machine pool requirements', () => {
      const status = validateAddOnRequirements(
        tstAddOn, tstCluster, {}, {},
      );
      expect(status.fulfilled)
        .toEqual(false);
      expect(status.errorMsgs)
        .toEqual(['This addon requires a machine_pool where replicas >= 2 and instance_type is '
        + 'm5.xlarge']);
    });
  });

  describe('parameterAndValue', () => {
    it('should return an empty object for addOn with no parameters', () => {
      const param = parameterAndValue(mockClusterAddOnsParams.items[0], crcWorkspaces);
      expect(param).toEqual({ parameters: {} });
    });
    it('should return an empty object for addOn with parameters but no current values', () => {
      const param = parameterAndValue(undefined, managedIntegration);
      expect(param).toEqual({ parameters: {} });
    });
    it('should return existing values', () => {
      const param = parameterAndValue(mockClusterAddOnsParams.items[1], managedIntegration);
      expect(param).toEqual({ parameters: { 'cidr-range': mockAddOnsInstallParamAndValues.items[0] } });
    });
    it('should return only existing values for current addon parameters', () => {
      const param = parameterAndValue(mockClusterAddOnsParams.items[2], managedIntegration);
      expect(param).toEqual({ parameters: { 'cidr-range': mockAddOnsInstallParamAndValues.items[0] } });
    });
    it('should return false for boolean addon param with installation param value of "false"', () => {
      const param = parameterAndValue(mockClusterAddOnsParams.items[3], loggingOperator);
      expect(param).toEqual({ parameters: { 'use-cloudwatch': mockAddOnsInstallParamAndValues.items[1] } });
    });
    it('should return false for boolean addon param with installation param value of "true"', () => {
      const param = parameterAndValue(mockClusterAddOnsParams.items[4], loggingOperator);
      expect(param).toEqual({ parameters: { 'use-cloudwatch': mockAddOnsInstallParamAndValues.items[2] } });
    });
    it('should return current param name for param with options and installation param value', () => {
      const mockAddOnsParams = {
        parameters: {
          items: [
            {
              id: 'my-string',
              value_type: 'string',
              options: [{
                name: 'option 1 name',
                value: 'options 1 value',
              }, {
                name: 'option 2 name',
                value: 'options 2 value',
              }],
            },
          ],
        },
      };
      const mockAddOnsInstallParams = {
        parameters: {
          items: [
            {
              id: 'my-string',
              value: 'options 2 value',
            },
          ],
        },
      };
      const param = parameterAndValue(mockAddOnsInstallParams, mockAddOnsParams);
      expect(param).toEqual({
        parameters: {
          'my-string': {
            id: 'my-string',
            options: [
              {
                name: 'option 1 name',
                value: 'options 1 value',
              },
              {
                name: 'option 2 name',
                value: 'options 2 value',
              },
            ],
            value: 'option 2 name',
            value_type: 'string',
          },
        },
      });
    });
  });
});

describe('validateAddOnParameterConditions', () => {
  let tstAddOnParam;
  let tstCluster;

  beforeAll(() => {
    tstCluster = cloneDeep(OSDCluster);
  });

  it('should return true for addon parameter with no conditions', () => {
    const status = validateAddOnParameterConditions(
      tstAddOnParam, tstCluster,
    );
    expect(status.fulfilled)
      .toEqual(true);
    expect(status.errorMsgs)
      .toEqual([]);
  });

  describe('cluster', () => {
    beforeAll(() => {
      tstAddOnParam = {
        conditions: [
          {
            resource: 'cluster',
            data: {
              'cloud_provider.id': 'aws',
            },
          },
        ],
      };
    });

    it('should return true for addon parameter with fulfilled cluster requirements', () => {
      const status = validateAddOnParameterConditions(
        tstAddOnParam, tstCluster,
      );
      expect(status.fulfilled)
        .toEqual(true);
      expect(status.errorMsgs)
        .toEqual([]);
    });
    it('should return false for addon parameter with unfulfilled cluster requirements', () => {
      tstCluster.cloud_provider.id = 'gcp';
      const status = validateAddOnParameterConditions(
        tstAddOnParam, tstCluster,
      );
      expect(status.fulfilled)
        .toEqual(false);
      expect(status.errorMsgs)
        .toEqual(['This addon requires a cluster where cloud_provider.id is aws']);
    });
  });
});

describe('getParameters', () => {
  let tstAddOn;
  let tstCluster;

  beforeEach(() => {
    tstCluster = cloneDeep(OSDCluster);
  });

  it('should return an empty array', () => {
    const params = getParameters(
      tstAddOn, tstCluster,
    );
    expect(params).toEqual([]);
  });

  describe('cluster', () => {
    beforeEach(() => {
      tstAddOn = {
        parameters: {
          items: [
            {
              id: 'my-string',
              value_type: 'string',
            },
            {
              id: 'my-string-aws',
              value_type: 'string',
              conditions: [
                {
                  resource: 'cluster',
                  data: {
                    'cloud_provider.id': 'aws',
                  },
                },
              ],
            },
          ],
        },
      };
    });

    it('should return empty array when no parameters defined', () => {
      tstAddOn.parameters = undefined;
      const params = getParameters(
        tstAddOn, tstCluster,
      );
      expect(params).toEqual([]);
    });
    it('should return 2 addon parameters for an aws cluster', () => {
      const params = getParameters(
        tstAddOn, tstCluster,
      );
      expect(params).toEqual([
        {
          id: 'my-string',
          value_type: 'string',
        },
        {
          id: 'my-string-aws',
          value_type: 'string',
          conditions: [
            {
              resource: 'cluster',
              data: {
                'cloud_provider.id': 'aws',
              },
            },
          ],
        },
      ]);
    });
    it('should return 1 addon parameters for gcp a cluster', () => {
      tstCluster.cloud_provider.id = 'gcp';
      const params = getParameters(
        tstAddOn, tstCluster,
      );
      expect(params).toEqual([
        {
          id: 'my-string',
          value_type: 'string',
        },
      ]);
    });
    it('should return 2 addon parameters when no cluster specified', () => {
      const params = getParameters(tstAddOn);
      expect(params).toEqual([
        {
          id: 'my-string',
          value_type: 'string',
        },
        {
          id: 'my-string-aws',
          value_type: 'string',
          conditions: [
            {
              resource: 'cluster',
              data: {
                'cloud_provider.id': 'aws',
              },
            },
          ],
        },
      ]);
    });
  });
});
