import featuresReducer from './featuresReducer';
import { SET_FEATURE } from '../constants/featureConstants';

describe('featuresReducer', () => {
  const initialState = {};
  const payload = {
    feature: 'FOO_FEATURE',
    enabled: true,
  };

  describe('when action should not be handled by this reducer', () => {
    it('leaves the state unmodified', () => {
      const action = { payload, type: 'UNRELATED_TYPE' };
      const result = featuresReducer(initialState, action);

      expect(result).toEqual(initialState);
    });
  });

  describe('when feature is resolved', () => {
    it('update feature', () => {
      const action = { payload, type: SET_FEATURE };
      const result = featuresReducer(initialState, action);

      expect(result).toEqual({ [payload.feature]: payload.enabled });
    });
  });
});
