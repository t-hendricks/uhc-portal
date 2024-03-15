import getSupportStatus from '../supportStatusActions';
import getOCPLifeCycleStatus from '../../../../../../../services/productLifeCycleService';
import GET_SUPPORT_STATUS from '../supportStatusConstants';

jest.mock('../../../../../../../services/productLifeCycleService');

describe('getSupportStatus action', () => {
  let mockDispatch;
  beforeEach(() => {
    mockDispatch = jest.fn();
  });

  it('dispatches successfully', () => {
    getSupportStatus()(mockDispatch);
    expect(mockDispatch).toBeCalledWith({
      payload: expect.anything(),
      type: GET_SUPPORT_STATUS,
    });
  });

  it('calls productLifeCycleService.getOCPLifeCycleStatus', () => {
    getSupportStatus()(mockDispatch);
    expect(getOCPLifeCycleStatus).toBeCalled();
  });
});
