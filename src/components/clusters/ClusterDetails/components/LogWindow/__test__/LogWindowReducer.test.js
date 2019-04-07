import reducer, { initialState } from '../LogWindowReducer';
import { GET_LOGS, CLEAR_LOGS } from '../LogWindowConstants';
import helpers from '../../../../../../common/helpers';

describe('Modal Redcuer', () => {
  const mockPayload = {
    data: {
      kind: 'Log',
      id: 'hive',
      href: '/api/clusters_mgmt/v1/clusters/123/logs/hive',
      content: 'level=debug msg="  Getting source \\"',
    },
  };

  describe('should not handle unrelated actions', () => {
    it('leaves the state unmodified', () => {
      const action = { type: 'HOLY_GUACAMOLE' };
      const result = reducer(initialState, action);

      expect(result).toEqual(initialState);
    });
  });

  it('should handle get logs action', () => {
    const action = { type: helpers.FULFILLED_ACTION(GET_LOGS), payload: mockPayload };
    const result = reducer(initialState, action);

    expect(result).toHaveProperty('logs.lines', mockPayload.data.content);
  });

  it('should handle clear logs action', () => {
    const action = { type: CLEAR_LOGS };
    const result = reducer(initialState, action);

    expect(result).toHaveProperty('logs.lines', initialState.logs.lines);
  });
});
