import { machineTypesActions } from './machineTypesActions';
import { clusterService } from '../../services';

jest.mock('../../services/clusterService');

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

  describe('groupByCloudProvider', () => {
    it('groups machine types by cloud provider id', () => {
      const machineTypes = [
        {
          id: 'foo',
          cloud_provider: { id: 'aws' },
          size: 'small',
          category: 'general_purpose',
          generic_name: 'standard-4',
        },
        {
          id: 'bar',
          cloud_provider: { id: 'aws' },
          size: 'small',
          category: 'general_purpose',
          generic_name: 'standard-4',
        },
        {
          id: 'baz',
          cloud_provider: { id: 'gcp' },
          size: 'small',
          category: 'general_purpose',
          generic_name: 'standard-4',
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
            generic_name: 'standard-4',
          },
          {
            id: 'bar',
            cloud_provider: { id: 'aws' },
            size: 'small',
            category: 'general_purpose',
            generic_name: 'standard-4',
          },
        ],
        gcp: [
          {
            id: 'baz',
            cloud_provider: { id: 'gcp' },
            size: 'small',
            category: 'general_purpose',
            generic_name: 'standard-4',
          },
        ],
      });
    });
  });
});
