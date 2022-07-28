import flavoursReducer, { initialState } from './flavoursReducer';

import mockdata from '../../../mockdata/api/clusters_mgmt/v1/flavours/osd-4.json';

describe('flavoursReducer', () => {
  it('initial value', () => {
    const state = flavoursReducer(undefined, { type: 'some_other_action' });
    expect(state.pending).toBe(false);
    expect(state.fulfilled).toBe(false);
    expect(state).toEqual(initialState);
  });

  const pendingState = flavoursReducer(initialState, { type: 'GET_DEFAULT_FLAVOUR_PENDING' });
  it('handles PENDING action', () => {
    expect(pendingState.pending).toBe(true);
    expect(pendingState.fulfilled).toBe(false);
  });

  it('handles FULFILLED action', () => {
    const action = {
      type: 'GET_DEFAULT_FLAVOUR_FULFILLED',
      payload: {
        // axios fields
        status: 200,
        data: mockdata,
      },
    };
    const state = flavoursReducer(pendingState, action);
    expect(state.pending).toBe(false);
    expect(state.fulfilled).toBe(true);
    expect(state.byID['osd-4'].aws.compute_instance_type).toBe('m5.xlarge');
    expect(state.byID['osd-4'].gcp.compute_instance_type).toBe('custom-4-16384');
  });
});
