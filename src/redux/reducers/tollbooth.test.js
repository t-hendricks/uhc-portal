import tollboothReducer from './tollbooth';
import { ACTION_TYPE as tollboothActionType } from '../actions/tollbooth';

describe('tollboothReducer', () => {
  const initialState = {};
  const type = tollboothActionType;
  const data = { this: 'is', some: 'data' };
  const baseAction = {
    type,
    payload: {
      data,
      response: {
        status: 123,
      },
    },
  };

  describe('when action is normal', () => {
    it('leaves the state unmodified', () => {
      const action = { ...baseAction, type: `${type}` };
      const result = tollboothReducer(initialState, action);

      expect(result).toEqual(initialState);
    });
  });

  describe('when action is pending', () => {
    it('leaves the state unmodified', () => {
      const action = { ...baseAction, type: `${type}_PENDING` };
      const result = tollboothReducer(initialState, action);

      expect(result).toEqual(initialState);
    });
  });

  describe('when action is rejected', () => {
    it('provides an error token', () => {
      const action = { ...baseAction, error: true, type: `${type}_REJECTED` };
      const result = tollboothReducer(initialState, action);

      expect(result).toEqual(
        expect.objectContaining({
          token: expect.objectContaining({
            error: expect.anything(),
          }),
        }),
      );
    });
  });

  describe('when action is fulfilled', () => {
    it('provides the token received', () => {
      const action = { ...baseAction, type: `${type}_FULFILLED` };
      const result = tollboothReducer(initialState, action);

      expect(result).toEqual({ token: { ...data } });
    });
  });
});
