import { baseRequestState, FULFILLED_ACTION } from '~/redux/reduxHelpers';

import { deleteProtectionConstants } from '../deleteProtectionActions';
import reducer, { initialState } from '../deleteProtectionReducer';

describe('Delete protection reducer', () => {
  it('should ignore unrelated action', () => {
    const action = { type: 'FAKE-ACTION' };
    const result = reducer(initialState, action as any);

    expect(result).toEqual(initialState);
  });

  it('handles UPDATE_DELETE_PROTECTION action', () => {
    const action = {
      type: FULFILLED_ACTION(deleteProtectionConstants.UPDATE_DELETE_PROTECTION),
      payload: {
        enabled: false,
        href: '/api/clusters_mgmt/v1/clusters/fake-cluster/delete_protection',
      },
    };
    const result = reducer(initialState, action as any);

    expect(result).toHaveProperty('updateDeleteProtection', {
      ...baseRequestState,
      fulfilled: true,
    });
  });

  it('handles CLEAR_UPDATE_DELETE_PROTECTION_RESPONSE action', () => {
    const action = {
      type: deleteProtectionConstants.CLEAR_UPDATE_DELETE_PROTECTION_RESPONSE,
    };
    const result = reducer(initialState, action as any);

    expect(result).toHaveProperty('updateDeleteProtection', {
      ...baseRequestState,
    });
  });
});
