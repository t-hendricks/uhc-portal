import { logWindowActions } from '../LogWindowActions';
import { clusterService } from '../../../../../../services';
import { logWindowConstants } from '../LogWindowConstants';

jest.mock('../../../../../../services/clusterService.js');

describe('LogWindowActions', () => {
  let mockDispatch;
  beforeEach(() => {
    mockDispatch = jest.fn();
  });

  it('dispatches successfully', () => {
    logWindowActions.getLogs()(mockDispatch);
    expect(mockDispatch).toBeCalledWith({
      payload: expect.anything(),
      type: logWindowConstants.GET_LOGS,
    });
  });

  it('calls clusterService.getLogs', () => {
    const fakeId = '1234';
    logWindowActions.getLogs(fakeId)(mockDispatch);
    expect(clusterService.getLogs).toBeCalledWith(fakeId);
  });

  it('dispatches successfully', () => {
    logWindowActions.clearLogs()(mockDispatch);
    expect(mockDispatch).toBeCalledWith({
      type: logWindowConstants.CLEAR_LOGS,
    });
  });
});
