import { clustersConstants } from '../constants';

import techPreviewActions from './techPreviewActions';

describe('getTechPreviewStatus', () => {
  it('getTechPreviewPending returns expected action', () => {
    const returnedAction = techPreviewActions.getTechPreviewStatusPending('myProduct', 'myType');
    expect(returnedAction).toEqual({
      type: `${clustersConstants.GET_TECH_PREVIEW}_PENDING`,
      payload: { product: 'myProduct', type: 'myType' },
    });
  });

  it('getTechPreviewError returns expected action', () => {
    const returnedAction = techPreviewActions.getTechPreviewStatusError('myProduct', 'myType');
    expect(returnedAction).toEqual({
      type: `${clustersConstants.GET_TECH_PREVIEW}_REJECTED`,
      payload: { product: 'myProduct', type: 'myType' },
    });
  });

  it('getTechPreviewFulfilled returns expected action', () => {
    const myData = { id: 'myProductTechnologyPreview' };
    const returnedAction = techPreviewActions.getTechPreviewStatusFulfilled(
      'myProduct',
      'myType',
      myData,
    );
    expect(returnedAction).toEqual({
      type: `${clustersConstants.GET_TECH_PREVIEW}_FULFILLED`,
      payload: { product: 'myProduct', type: 'myType', data: myData },
    });
  });
});
