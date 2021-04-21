import { machineTypesActions } from './machineTypesActions';
import { clusterService } from '../../services';

jest.mock('../../services/clusterService.js');

describe('machineTypesActions', () => {
  let mockDispatch;
  beforeEach(() => {
    mockDispatch = jest.fn();
  });

  describe('getMachineTypes', () => {
    it('calls clusterService.getMachineTypes', () => {
      machineTypesActions.getMachineTypes()(mockDispatch);
      expect(clusterService.getMachineTypes).toBeCalled();
    });
  });

  describe('getResourceName', () => {
    it('return generic_name if defined', () => {
      const machineType = { category: 'general_purpose', size: 'small', generic_name: 'standard-4' };
      const resourceName = machineTypesActions.getResourceName(machineType);
      expect(resourceName).toEqual('standard-4');
    });
    it('return computed name gp.small if generic_name is not defined', () => {
      const machineType = { category: 'general_purpose', size: 'small' };
      const resourceName = machineTypesActions.getResourceName(machineType);
      expect(resourceName).toEqual('gp.small');
    });
    it('return computed name cpu.medium if generic_name is not defined', () => {
      const machineType = { category: 'compute_optimized', size: 'medium' };
      const resourceName = machineTypesActions.getResourceName(machineType);
      expect(resourceName).toEqual('cpu.medium');
    });
    it('return computed name mem.large if generic_name is not defined', () => {
      const machineType = { category: 'memory_optimized', size: 'large' };
      const resourceName = machineTypesActions.getResourceName(machineType);
      expect(resourceName).toEqual('mem.large');
    });

    it('return computed name gpu.larg if generic_name is not defined', () => {
      const machineType = { category: 'accelerated_computing', size: 'large' };
      const resourceName = machineTypesActions.getResourceName(machineType);
      expect(resourceName).toEqual('gpu.large');
    });
  });

  describe('groupByCloudProvider', () => {
    it('groups machine types by cloud provider id', () => {
      const machineTypes = [
        {
          id: 'foo',
          cloud_provider: { id: 'aws' },
          size: 'small',
          category: 'general_purpose',
        },
        {
          id: 'bar',
          cloud_provider: { id: 'aws' },
          size: 'small',
          category: 'general_purpose',
        },
        {
          id: 'baz',
          cloud_provider: { id: 'gcp' },
          size: 'small',
          category: 'general_purpose',
        },
      ];
      const byProvider = machineTypesActions.groupByCloudProvider(machineTypes);
      expect(byProvider).toEqual({
        aws: [
          {
            id: 'foo',
            cloud_provider: { id: 'aws' },
            size: 'small',
            category: 'general_purpose',
            resource_name: 'gp.small',
          },
          {
            id: 'bar',
            cloud_provider: { id: 'aws' },
            size: 'small',
            category: 'general_purpose',
            resource_name: 'gp.small',
          },
        ],
        gcp: [
          {
            id: 'baz',
            cloud_provider: { id: 'gcp' },
            size: 'small',
            category: 'general_purpose',
            resource_name: 'gp.small',
          },
        ],
      });
    });
  });
});
