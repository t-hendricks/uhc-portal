import reducer from '../ModalReducer';
import { OPEN_MODAL, CLOSE_MODAL } from '../ModalConstants';

describe('Modal Redcuer', () => {
  const { initialState } = reducer;

  describe('should not handle unrelated actions', () => {
    it('leaves the state unmodified', () => {
      const action = { type: 'HOLY_GUACAMOLE' };
      const result = reducer(initialState, action);

      expect(result).toEqual(initialState);
    });
  });


  it('should handle open modal action', () => {
    const action = { type: OPEN_MODAL, payload: { name: 'test-modal' } };
    const result = reducer(initialState, action);

    expect(result).toHaveProperty('activeModal.modalName', 'test-modal');
  });

  it('should handle close modal action', () => {
    const activeModalState = { activeModal: { modalName: 'test-modal' } };
    const action = { type: CLOSE_MODAL };
    const result = reducer(activeModalState, action);

    expect(result).toEqual(initialState);
  });

  it('should handle open modal action with data', () => {
    const action = { type: OPEN_MODAL, payload: { name: 'test-modal', data: 'foo' } };
    const result = reducer(initialState, action);

    expect(result).toHaveProperty('activeModal.modalName', 'test-modal');
    expect(result).toHaveProperty('activeModal.data', 'foo');
  });
});
