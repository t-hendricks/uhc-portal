import masterResizeAlertThresholdSelector, { masterResizeThresholds } from '../EditNodeCountModalSelectors';
import fixtures from '../../../ClusterDetails/__test__/ClusterDetails.fixtures';

describe('masterResizeAlertThreshold Selector', () => {
  const modalState = { data: { cluster: { ...fixtures.clusterDetails.cluster } } };

  it('When scaling a cluster to more then 25 nodes, return medium threshold', () => {
    const state = {
      modal: modalState,
      form: { EditNodeCount: { values: { nodes_compute: '27' } } },
    };

    const result = masterResizeAlertThresholdSelector(state);

    expect(result).toEqual(masterResizeThresholds.medium);
  });

  it('When scaling a cluster to more then 100 nodes, return large threshold', () => {
    const state = {
      modal: modalState,
      form: { EditNodeCount: { values: { nodes_compute: '101' } } },
    };

    const result = masterResizeAlertThresholdSelector(state);

    expect(result).toEqual(masterResizeThresholds.large);
  });

  it('When scaling a cluster to less then 25 nodes, return 0', () => {
    const state = {
      modal: modalState,
      form: { EditNodeCount: { values: { nodes_compute: '6' } } },
    };

    const result = masterResizeAlertThresholdSelector(state);

    expect(result).toEqual(0);
  });
});
