import { cloudProvidersReducer } from './cloudProvidersReducer';
import { GET_CLOUD_PROVIDERS } from '../constants/cloudProviderConstants';

describe('cloudProvidersReducer', () => {
  const initialState = {};
  const type = GET_CLOUD_PROVIDERS;
  const payload = {
    data: { this: 'is', some: 'data' },
    response: {
      status: 123,
    },
  };

  describe('when action should not be handled by this reducer', () => {
    it('leaves the state unmodified', () => {
      const action = { payload, type: 'UNRELATED_TYPE' };
      const result = cloudProvidersReducer(initialState, action);

      expect(result).toEqual(initialState);
    });
  });

  describe('when action is pending', () => {
    it('set pending to true', () => {
      const action = { type: `${type}_PENDING` };
      const result = cloudProvidersReducer(initialState, action);

      expect(result).toHaveProperty('pending', true);
    });
  });

  describe('when action is rejected', () => {
    it('provides an error message', () => {
      const action = {
        error: new Error('hi'),
        payload: 'some error',
        type: `${type}_REJECTED`,
      };
      const result = cloudProvidersReducer(initialState, action);

      expect(result).toEqual(
        expect.objectContaining({
          error: expect.anything(),
          errorMessage: 'some error',
          pending: false,
        }),
      );
    });
  });

  describe('when action is fulfilled', () => {
    it('provides the cloud providers recieved', () => {
      const action = { payload, type: `${type}_FULFILLED` };
      const result = cloudProvidersReducer(initialState, action);

      expect(result).toEqual({
        providers: action.payload,
        fulfilled: true,
        pending: false,
        error: false,
      });
    });

    it('resets error state even if it was set', () => {
      const action = { payload, type: `${type}_FULFILLED` };
      const state = { cloudProviders: { error: new Error("I'm an error") } };
      const result = cloudProvidersReducer(state, action);

      expect(result).toEqual(expect.objectContaining({ error: false }));
    });
  });
});
