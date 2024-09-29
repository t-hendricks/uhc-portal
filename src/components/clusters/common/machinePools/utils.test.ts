import { MAX_NODES } from './constants';
import * as utils from './utils';

describe('machinePools utils', () => {
  describe('getNodeOptions', () => {
    const selectedMPNodes = 1;
    const existingNodes = 4; // total from below)

    const defaultArgs = {
      cluster: {
        hypershift: { enabled: true },
        multi_az: false,
        ccs: { enabled: true }, // isByoc
        cloud_provider: { id: 'aws' },
        billing_model: 'marketplace-aws',
        product: { id: 'ROSA' },
        version: { raw_id: '4.16.0' },
      },
      machineTypeId: 'm5.xlarge',
      machinePools: [
        {
          autoscaling: { max_replicas: selectedMPNodes },
          id: 'workers-1',
          instance_type: 'm5.xlarge',
        },
        {
          autoscaling: { max_replicas: 1 },
          id: 'workers-2',
          instance_type: 'm5.xlarge',
        },
        {
          replicas: 2,
          id: 'workers-3',
          instance_type: 'm5.xlarge',
        },
      ],
      minNodes: 1,
      editMachinePoolId: 'workers-1',
    } as unknown as utils.getNodeOptionsType;

    const maxNodesHCP = utils.getMaxNodesHCP(defaultArgs.cluster.version?.raw_id, false);

    // In order to make  testing a little easier, mocking quota method
    const getAvailableQuotaMock = jest.spyOn(utils, 'getAvailableQuota').mockReturnValue(50990);
    afterAll(() => {
      getAvailableQuotaMock.mockReset();
    });
    describe('Adding a new machine pool', () => {
      const newMachinePoolArgs = {
        ...defaultArgs,
        editMachinePoolId: undefined,
      };
      it('returns expected options if hypershift and all same machine type', () => {
        const options = utils.getNodeOptions(newMachinePoolArgs);
        const expectedLargestOption = maxNodesHCP - existingNodes;
        expect(options).toHaveLength(expectedLargestOption);
        expect(options[options.length - 1]).toBe(expectedLargestOption);
      });

      it('returns expected options if hypershift and different machine types', () => {
        const newMachinePoolArgsPlus = {
          ...newMachinePoolArgs,
          machinePools: [
            ...defaultArgs.machinePools,
            {
              replicas: 3,
              id: 'workers-3',
              instance_type: 'm5.myothertype',
            },
          ],
        };
        const options = utils.getNodeOptions(newMachinePoolArgsPlus);

        const expectedLargestOption = maxNodesHCP - existingNodes - 3; // "3" is from machine pool added in this test
        expect(options).toHaveLength(expectedLargestOption);
        expect(options[options.length - 1]).toBe(expectedLargestOption);
      });

      it('returns expected options if not hypershift and all same machine type', () => {
        const newMachinePoolArgsNotHCP = {
          ...newMachinePoolArgs,
          cluster: {
            ...defaultArgs.cluster,
            hypershift: { enabled: false },
          },
        };

        const options = utils.getNodeOptions(newMachinePoolArgsNotHCP);

        const expectedLargestOption = MAX_NODES;
        expect(options).toHaveLength(expectedLargestOption);
        expect(options[options.length - 1]).toBe(expectedLargestOption);
      });

      it('returns expected options if not hypershift and different machine types', () => {
        const newMachinePoolArgsNotHCP = {
          ...newMachinePoolArgs,
          cluster: {
            ...defaultArgs.cluster,
            hypershift: { enabled: false },
          },
          machinePools: [
            ...defaultArgs.machinePools,
            {
              replicas: 3,
              id: 'workers-3',
              instance_type: 'm5.myothertype',
            },
          ],
        };

        const options = utils.getNodeOptions(newMachinePoolArgsNotHCP);

        const expectedLargestOption = MAX_NODES;
        expect(options).toHaveLength(expectedLargestOption);
        expect(options[options.length - 1]).toBe(expectedLargestOption);
      });
    });

    describe('Editing an existing machine pool', () => {
      it('returns expected options if hypershift and all same machine type', () => {
        const options = utils.getNodeOptions(defaultArgs);

        const expectedLargestOption = maxNodesHCP - existingNodes + selectedMPNodes;
        expect(options).toHaveLength(expectedLargestOption);
        expect(options[options.length - 1]).toBe(expectedLargestOption);
      });

      it('returns expected options if hypershift and different machine types', () => {
        const newMachinePoolReplicas = 3;

        const newMachinePoolArgsPlus = {
          ...defaultArgs,
          machinePools: [
            ...defaultArgs.machinePools,
            {
              replicas: newMachinePoolReplicas,
              id: 'workers-3',
              instance_type: 'm5.myothertype',
            },
          ],
        };
        const options = utils.getNodeOptions(newMachinePoolArgsPlus);

        const existingNodesWithNewMP = existingNodes + newMachinePoolReplicas;
        const expectedLargestOption = maxNodesHCP - existingNodesWithNewMP + selectedMPNodes;
        expect(options).toHaveLength(expectedLargestOption);
        expect(options[options.length - 1]).toBe(expectedLargestOption);
      });

      it('returns expected options if not hypershift and all same machine type', () => {
        const newMachinePoolArgsNotHCP = {
          ...defaultArgs,
          cluster: {
            ...defaultArgs.cluster,
            hypershift: { enabled: false },
          },
        };

        const options = utils.getNodeOptions(newMachinePoolArgsNotHCP);

        const expectedLargestOption = MAX_NODES;
        expect(options).toHaveLength(expectedLargestOption);
        expect(options[options.length - 1]).toBe(expectedLargestOption);
      });

      it('returns expected options if not hypershift and different machine types', () => {
        const newMachinePoolArgsNotHCP = {
          ...defaultArgs,
          cluster: {
            ...defaultArgs.cluster,
            hypershift: { enabled: false },
          },
          machinePools: [
            ...defaultArgs.machinePools,
            {
              replicas: 3,
              id: 'workers-3',
              instance_type: 'm5.myothertype',
            },
          ],
        };

        const options = utils.getNodeOptions(newMachinePoolArgsNotHCP);

        const expectedLargestOption = MAX_NODES;
        expect(options).toHaveLength(expectedLargestOption);
        expect(options[options.length - 1]).toBe(expectedLargestOption);
      });
    });

    describe('getMaxNodesHCP', () => {
      it.each([
        ['returns the default max nodes for HCP', '4.16.0', false, 250],
        ['version 4.14.19 gets insufficient version', '4.14.19', false, 90],
        ['version 4.15.14 gets insufficient version', '4.15.14', false, 90],
        ['version 4.14.19 gets insufficient version and max nodes', '4.14.19', false, 90],
        ['version 4.15.14 gets insufficient version and max nodes', '4.15.14', false, 90],
        ['version 4.16.0 allows 500 nodes', '4.16.0', true, 500],
        ['undefined version and undefined options gets default version', undefined, undefined, 250],
        ['undefined version and max nodes 500', undefined, true, 500],
      ])(
        '%s',
        (
          _title: string,
          version: string | undefined,
          allow500: boolean | undefined,
          exptected: number,
        ) => {
          // Act
          const result = utils.getMaxNodesHCP(version, allow500);

          // Assert
          expect(result).toEqual(exptected);
        },
      );
    });
  });
});
