import { detectFeatures, features } from './featureActions';
import { SET_FEATURE } from '../constants/featureConstants';
import authorizationsService from '../../services/authorizationsService';

jest.mock('../../services/authorizationsService');

const flushPromises = () => new Promise(setImmediate);

const testFeatures = async (enabled, error) => {
  const mockDispatch = jest.fn();
  authorizationsService.mockImplementation(() => ({
    selfAccessReview: () => (error ? Promise.reject(new Error('Error')) : Promise.resolve({ data: { allowed: enabled } })),
  }));
  detectFeatures()(mockDispatch);
  await flushPromises();
  expect(mockDispatch).toHaveBeenCalledTimes(features.length);
  features.forEach((f, i) => {
    expect(mockDispatch).toHaveBeenNthCalledWith(i + 1, {
      type: SET_FEATURE,
      payload: {
        feature: f.name,
        enabled,
      },
    });
  });
};

describe('featureActions', () => {
  describe('detectFeatures', () => {
    it('dispatches successfully', () => {
      testFeatures(true);
      testFeatures(false);
    });
    it('handles error', () => {
      testFeatures(false, true);
    });
  });
});
