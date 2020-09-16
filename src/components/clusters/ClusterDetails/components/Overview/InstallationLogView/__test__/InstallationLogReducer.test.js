import reducer, { initialState } from '../InstallationLogReducer';
import { GET_LOGS, CLEAR_LOGS } from '../InstallationLogConstants';
import { FULFILLED_ACTION } from '../../../../../../../redux/reduxHelpers';

describe('installation logs Redcuer', () => {
  const mockPayload = {
    logType: 'install',
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

  describe('get action', () => {
    const action = { type: FULFILLED_ACTION(GET_LOGS), payload: mockPayload };
    let result;
    it('should handle get logs action', () => {
      result = reducer(initialState, action);

      expect(result).toHaveProperty('lines', mockPayload.data.content);
      expect(result).toHaveProperty('len', 1);
    });

    it('should handle subsequent get actions correctly (with offset)', () => {
      action.payload.data.content = '\nline2\nline3';
      const expected = 'level=debug msg="  Getting source \\"\nline2\nline3';
      result = reducer(result, action);

      expect(result).toHaveProperty('lines', expected);
      expect(result).toHaveProperty('len', 4);
    });

    it('should handle subsequent get actions correctly (when switching type)', () => {
      const differentTypeAction = {
        type: FULFILLED_ACTION(GET_LOGS),
        payload: {
          ...mockPayload,
          logType: 'uninstall',
          data: {
            ...mockPayload.data,
            content: 'different logs',
          },
        },
      };
      result = reducer(result, differentTypeAction);

      expect(result).toHaveProperty('lines', 'different logs');
      expect(result).toHaveProperty('len', 1);
    });


    it('should handle get logs action when no lines were returned', () => {
      const noLinesAction = {
        type: FULFILLED_ACTION(GET_LOGS),
        payload: {
          ...mockPayload,
          data: {
            ...mockPayload.data,
            content: undefined,
          },
        },
      };
      result = reducer(initialState, noLinesAction);

      expect(result).toHaveProperty('lines', '');
      expect(result).toHaveProperty('len', 0);
    });
  });

  it('should handle clear logs action', () => {
    const action = { type: CLEAR_LOGS };
    const result = reducer(initialState, action);

    expect(result).toHaveProperty('lines', initialState.lines);
  });
});
