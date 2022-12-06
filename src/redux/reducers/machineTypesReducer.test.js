import machineTypesReducer, { initialState } from './machineTypesReducer';
import { GET_MACHINE_TYPES } from '../constants/machineTypesConstants';

describe('clusterMachineTypesReducer', () => {
  const type = GET_MACHINE_TYPES;
  const payload = {
    data: { items: ['foo', 'bar'] },
    response: {
      status: 123,
    },
  };

  describe('when action should not be handled by this reducer', () => {
    it('leaves the state unmodified', () => {
      const action = { payload, type: 'UNRELATED_TYPE' };
      const result = machineTypesReducer(initialState, action);

      expect(result).toEqual(initialState);
    });
  });

  describe('when action is pending', () => {
    it('set pending to true', () => {
      const action = { type: `${type}_PENDING` };
      const result = machineTypesReducer(initialState, action);

      expect(result.pending).toEqual(true);
    });
  });

  describe('when action is rejected', () => {
    it('provides an error message', () => {
      const action = {
        error: new Error('hi'),
        payload: 'some error',
        type: `${type}_REJECTED`,
      };
      const result = machineTypesReducer(initialState, action);

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
    it('provides the types received', () => {
      const action = { payload, type: `${type}_FULFILLED` };
      const result = machineTypesReducer(initialState, action);

      expect(result).toEqual({
        types: action.payload,
        typesByID: {},
        fulfilled: true,
        pending: false,
        error: false,
      });
    });

    it('resets error state even if it was set', () => {
      const action = { payload, type: `${type}_FULFILLED` };
      const state = { clusterMachineTypes: { error: new Error("I'm an error") } };
      const result = machineTypesReducer(state, action);

      expect(result).toEqual(
        expect.objectContaining({
          error: false,
        }),
      );
    });

    it('maps the machine types by ID', () => {
      const action = {
        payload: {
          aws: [{ id: 'foo' }],
          gcp: [{ id: 'bar' }],
        },
        type: `${type}_FULFILLED`,
      };
      const result = machineTypesReducer(initialState, action);

      expect(result).toEqual({
        types: action.payload,
        typesByID: {
          foo: { id: 'foo' },
          bar: { id: 'bar' },
        },
        fulfilled: true,
        pending: false,
        error: false,
      });
    });
  });
});
