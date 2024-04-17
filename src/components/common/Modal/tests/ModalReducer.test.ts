import { CLOSE_MODAL, OPEN_MODAL } from '../ModalConstants';
import reducer, { State } from '../ModalReducer';

describe('Modal Redcuer', () => {
  const { initialState } = reducer;

  describe('should not handle unrelated actions', () => {
    it('leaves the state unmodified', () => {
      const action: any = { type: 'HOLY_GUACAMOLE' };
      const result = reducer(initialState, action);
      expect(result).toEqual(initialState);
    });
  });

  it('should handle open modal action', () => {
    const action: any = { type: OPEN_MODAL, payload: { name: 'test-modal' } };
    const result = reducer(initialState, action);
    expect(result).toHaveProperty('modalName', 'test-modal');
  });

  it('should handle close modal action', () => {
    const activeModalState: State = { modalName: 'test-modal', data: {} };
    const action: any = { type: CLOSE_MODAL };
    const result = reducer(activeModalState, action);
    expect(result).toEqual(initialState);
  });

  it('should handle open modal action with data', () => {
    const action: any = { type: OPEN_MODAL, payload: { name: 'test-modal', data: 'foo' } };
    const result = reducer(initialState, action);
    expect(result).toHaveProperty('modalName', 'test-modal');
    expect(result).toHaveProperty('data', 'foo');
  });
});
