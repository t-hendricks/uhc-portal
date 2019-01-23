import { openModal, closeModal } from '../ModalActions';
import { OPEN_MODAL, CLOSE_MODAL } from '../ModalConstants';

describe('Modal actions', () => {
  it('should open modal', () => {
    const testModalName = 'test-modal';
    const expectedResults = {
      type: OPEN_MODAL,
      payload: { name: testModalName, data: undefined },
    };

    expect(openModal(testModalName)).toEqual(expectedResults);
  });

  it('should close modal', () => {
    const expectedResults = {
      type: CLOSE_MODAL,
    };

    expect(closeModal()).toEqual(expectedResults);
  });

  it('should open modal with data', () => {
    const testModalName = 'test-modal';
    const expectedResults = {
      type: OPEN_MODAL,
      payload: { name: testModalName, data: 'foo' },
    };

    expect(openModal(testModalName, 'foo')).toEqual(expectedResults);
  });
});
