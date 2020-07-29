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
    it('determines that the machine is gp.small', () => {
      const machineType = { category: 'general_purpose', size: 'small' };
      const resourceName = machineTypesActions.getResourceName(machineType);
      expect(resourceName).toEqual('gp.small');
    });
    it('determines that the machine is gp.medium', () => {
      const machineType = { category: 'general_purpose', size: 'medium' };
      const resourceName = machineTypesActions.getResourceName(machineType);
      expect(resourceName).toEqual('gp.medium');
    });
    it('determines that the machine is gp.large', () => {
      const machineType = { category: 'general_purpose', size: 'large' };
      const resourceName = machineTypesActions.getResourceName(machineType);
      expect(resourceName).toEqual('gp.large');
    });
    it('determines that the machine is cpu.small', () => {
      const machineType = { category: 'compute_optimized', size: 'small' };
      const resourceName = machineTypesActions.getResourceName(machineType);
      expect(resourceName).toEqual('cpu.small');
    });
    it('determines that the machine is cpu.medium', () => {
      const machineType = { category: 'compute_optimized', size: 'medium' };
      const resourceName = machineTypesActions.getResourceName(machineType);
      expect(resourceName).toEqual('cpu.medium');
    });
    it('determines that the machine is cpu.large', () => {
      const machineType = { category: 'compute_optimized', size: 'large' };
      const resourceName = machineTypesActions.getResourceName(machineType);
      expect(resourceName).toEqual('cpu.large');
    });
    it('determines that the machine is mem.small', () => {
      const machineType = { category: 'memory_optimized', size: 'small' };
      const resourceName = machineTypesActions.getResourceName(machineType);
      expect(resourceName).toEqual('mem.small');
    });
    it('determines that the machine is mem.medium', () => {
      const machineType = { category: 'memory_optimized', size: 'medium' };
      const resourceName = machineTypesActions.getResourceName(machineType);
      expect(resourceName).toEqual('mem.medium');
    });
    it('determines that the machine is mem.large', () => {
      const machineType = { category: 'memory_optimized', size: 'large' };
      const resourceName = machineTypesActions.getResourceName(machineType);
      expect(resourceName).toEqual('mem.large');
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
