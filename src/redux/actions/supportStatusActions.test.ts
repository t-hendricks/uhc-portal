import getOCPLifeCycleStatus from '~/services/productLifeCycleService';
import { getSupportStatus } from './supportStatusActions';
import GET_SUPPORT_STATUS from '../constants/supportStatusConstants';

jest.mock('~/services/productLifeCycleService');

describe('getSupportStatus action', () => {
  it('dispatches successfully', () => {
    // Arrange
    (getOCPLifeCycleStatus as jest.Mock).mockReturnValueOnce('whatever the result');

    // Act
    const returnedAction = getSupportStatus();

    // Assert
    expect(returnedAction).toEqual({
      type: GET_SUPPORT_STATUS,
      payload: 'whatever the result',
    });
  });
});
