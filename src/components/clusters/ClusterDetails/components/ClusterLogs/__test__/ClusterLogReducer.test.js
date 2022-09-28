import reducer, { initialState } from '../clusterLogReducer';
import { DOWNLOAD_CLUSTER_LOGS, GET_CLUSTER_LOGS } from '../clusterLogConstants';
import { FULFILLED_ACTION } from '../../../../../../redux/reduxHelpers';
import * as mockPayloadGet from '../../../../../../../mockdata/api/service_logs/v1/cluster_logs.json';

describe('cluster log Reducer', () => {
  describe('should not handle unrelated actions', () => {
    it('leaves the state unmodified', () => {
      const action = { type: 'HOLY_GUACAMOLE' };
      const result = reducer(initialState, action);

      expect(result).toEqual(initialState);
    });
  });

  it('should handle get cluster logs action', () => {
    const action = {
      type: FULFILLED_ACTION(GET_CLUSTER_LOGS),
      payload: mockPayloadGet,
    };
    const result = reducer(initialState, action);

    expect(result).toHaveProperty('logs', mockPayloadGet.logs.data.items);
  });

  it('should handle download cluster logs action', () => {
    const action = {
      type: DOWNLOAD_CLUSTER_LOGS,
      payload: mockPayloadGet,
    };
    const result = reducer(initialState, action);

    expect(result).toHaveProperty('data', mockPayloadGet.logs.data.data);
  });
});
