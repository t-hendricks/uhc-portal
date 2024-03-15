import reducer, { initialState } from '../supportStatusReducer';
import GET_SUPPORT_STATUS from '../supportStatusConstants';
import {
  FULFILLED_ACTION,
  PENDING_ACTION,
  REJECTED_ACTION,
} from '../../../../../../../redux/reduxHelpers';

describe('support status reducer', () => {
  const mockPayload = {
    data: {
      data: [
        {
          versions: [
            { name: '4.5', type: 'Full support' },
            { name: '4.4', type: 'Maintainence support' },
            { name: '4.3', type: 'End of life' },
          ],
        },
      ],
    },
  };

  describe('should not handle unrelated actions', () => {
    it('leaves the state unmodified', () => {
      const action = { type: 'HOLY_GUACAMOLE' };
      const result = reducer(initialState, action);

      expect(result).toEqual(initialState);
    });
  });

  it('should handle GET_SUPPORT_STATUS, action state pending', () => {
    const action = { type: PENDING_ACTION(GET_SUPPORT_STATUS) };
    const result = reducer(initialState, action);

    expect(result).toMatchObject({ fulfilled: false, error: false, pending: true });
  });

  it('should handle GET_SUPPORT_STATUS, action state rejected', () => {
    const action = { type: REJECTED_ACTION(GET_SUPPORT_STATUS), payload: mockPayload };
    const result = reducer(initialState, action);

    expect(result).toMatchObject({ fulfilled: false, pending: false, error: true });
  });

  it('should handle GET_SUPPORT_STATUS, action state fulfilled', () => {
    const action = { type: FULFILLED_ACTION(GET_SUPPORT_STATUS), payload: mockPayload };
    const result = reducer(initialState, action);

    expect(result).toHaveProperty('supportStatus', {
      4.5: 'Full support',
      4.4: 'Maintainence support',
      4.3: 'End of life',
    });
    expect(result).toMatchObject({ fulfilled: true, pending: false, error: false });
  });
});
