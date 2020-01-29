import reducer from '../ModalReducer';
import shouldShowModal from '../ModalSelectors';

describe('Modal Selector', () => {
  it('should return true if modal name matches', () => {
    const activeModalState = { modal: { modalName: 'test-modal' } };
    const result = shouldShowModal(activeModalState, 'test-modal');

    expect(result).toBeTruthy();
  });

  it('should return false if modal name does not matches', () => {
    const state = { modal: reducer.initialState };
    const result = shouldShowModal(state, 'test-modal');

    expect(result).toBeFalsy();
  });
});
