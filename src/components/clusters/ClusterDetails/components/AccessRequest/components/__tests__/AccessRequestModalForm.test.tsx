import React from 'react';
import * as reactRedux from 'react-redux';

import { closeModal } from '~/components/common/Modal/ModalActions';
import { postAccessRequestDecision } from '~/redux/actions/accessRequestActions';
import { useGlobalState } from '~/redux/hooks';
import { act, render, screen, within } from '~/testUtils';

import { AccessRequestState } from '../../model/AccessRequestState';
import AccessRequestModalForm from '../AccessRequestModalForm';

jest.mock('~/redux/hooks', () => ({
  useGlobalState: jest.fn(),
}));

jest.mock('../AccessRequestStateIcon', () => () => <div>access request state icon mock</div>);
jest.mock('../AccessRequestDetails', () => () => <div>access request details mock</div>);
jest.mock('~/components/common/ErrorBox', () => () => <div>error-box</div>);

jest.mock('~/components/common/Modal/ModalActions', () => ({
  closeModal: jest.fn(),
}));
jest.mock('react-redux', () => {
  const config = {
    __esModule: true,
    ...jest.requireActual('react-redux'),
  };
  return config;
});

jest.mock('~/redux/actions/accessRequestActions', () => ({
  postAccessRequestDecision: jest.fn(),
}));

const useGlobalStateMock = useGlobalState as jest.Mock;
const closeModalMock = closeModal as jest.Mock;
const postAccessRequestDecisionMock = postAccessRequestDecision as jest.Mock;

describe('AccessRequestModalForm', () => {
  const useDispatchMock = jest.spyOn(reactRedux, 'useDispatch');
  const dispatchMock = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();
    useDispatchMock.mockReturnValue(dispatchMock);
    closeModalMock.mockReturnValue('closeModalValue');
    postAccessRequestDecisionMock.mockReturnValue('postAccessRequestDecisionValue');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('undefined access request', () => {
    // Arrange
    useGlobalStateMock.mockReturnValueOnce({});
    useGlobalStateMock.mockReturnValueOnce({});
    useGlobalStateMock.mockReturnValueOnce({});

    // Act
    render(
      <div data-testid="parent-div">
        <AccessRequestModalForm />
      </div>,
    );

    // Assert
    expect(screen.getByTestId('parent-div').children.length).toBe(0);
  });

  describe('it renders properly', () => {
    it('is not editMode', () => {
      // Arrange
      useGlobalStateMock.mockReturnValueOnce({ accessRequest: {} });
      useGlobalStateMock.mockReturnValueOnce({});
      useGlobalStateMock.mockReturnValueOnce({});

      // Act
      render(<AccessRequestModalForm />);

      // Assert
      expect(
        within(
          screen.getByRole('heading', {
            name: /access request details/i,
          }),
        ).getByText(/access request details/i),
      ).toBeInTheDocument();
    });
    it('is editMode', async () => {
      // Arrange
      useGlobalStateMock.mockReturnValueOnce({
        accessRequest: { status: { state: AccessRequestState.PENDING } },
      });
      useGlobalStateMock.mockReturnValueOnce({});
      useGlobalStateMock.mockReturnValueOnce({});

      // Act
      // eslint-disable-next-line testing-library/no-unnecessary-act
      await act(() => render(<AccessRequestModalForm />));

      // Assert
      expect(
        within(
          screen.getByRole('heading', {
            name: /access request details/i,
          }),
        ).getByText(/access request details/i),
      ).toBeInTheDocument();
      expect(screen.getByText(/decision/i)).toBeInTheDocument();
    });

    it('shows error after submit error', async () => {
      // Arrange
      const onCloseMock = jest.fn();
      useGlobalStateMock.mockReturnValueOnce({
        accessRequest: { status: { state: AccessRequestState.PENDING } },
        onClose: onCloseMock,
      });
      useGlobalStateMock.mockReturnValueOnce({});
      useGlobalStateMock.mockReturnValueOnce({});
      const { user, rerender } = render(<AccessRequestModalForm />);
      await user.click(
        screen.getByRole('radio', {
          name: /approve/i,
        }),
      );
      await user.click(
        within(screen.getByRole('contentinfo')).getByRole('button', {
          name: /save/i,
        }),
      );

      // Act
      useGlobalStateMock.mockReturnValueOnce({
        accessRequest: { status: { state: AccessRequestState.PENDING } },
        onClose: onCloseMock,
      });
      useGlobalStateMock.mockReturnValueOnce({
        error: {},
      });
      useGlobalStateMock.mockReturnValueOnce({});
      rerender(<AccessRequestModalForm />);

      // Assert
      expect(onCloseMock).toHaveBeenCalledTimes(0);
      expect(dispatchMock).toHaveBeenCalledTimes(1);
      expect(screen.getByText(/error-box/i)).toBeInTheDocument();
    });
  });

  describe('modal functionallity', () => {
    it('closes', async () => {
      // Arrange
      const onCloseMock = jest.fn();
      useGlobalStateMock.mockReturnValueOnce({ accessRequest: {}, onClose: onCloseMock });
      useGlobalStateMock.mockReturnValueOnce({});
      useGlobalStateMock.mockReturnValueOnce({});

      const { user } = render(<AccessRequestModalForm />);

      // Act
      await user.click(
        within(screen.getByRole('contentinfo')).getByRole('button', {
          name: /close/i,
        }),
      );

      // Assert
      expect(onCloseMock).toHaveBeenCalledTimes(1);
      expect(dispatchMock).toHaveBeenCalledTimes(1);
      expect(dispatchMock).toHaveBeenCalledWith('closeModalValue');
    });

    it('properly disable save button in case not filling form', async () => {
      // Arrange
      useGlobalStateMock.mockReturnValueOnce({
        accessRequest: { status: { state: AccessRequestState.PENDING } },
      });
      useGlobalStateMock.mockReturnValueOnce({});
      useGlobalStateMock.mockReturnValueOnce({});

      // Act
      // eslint-disable-next-line testing-library/no-unnecessary-act
      await act(() => render(<AccessRequestModalForm />));

      // Assert
      expect(
        screen.getByRole('button', {
          name: /save/i,
        }),
      ).toHaveAttribute('disabled');
      expect(
        screen.getByRole('button', {
          name: /cancel/i,
        }),
      ).not.toHaveAttribute('disabled');
    });

    it('properly enable save button in case of approve', async () => {
      // Arrange
      useGlobalStateMock.mockReturnValueOnce({
        accessRequest: { status: { state: AccessRequestState.PENDING } },
      });
      useGlobalStateMock.mockReturnValueOnce({});
      useGlobalStateMock.mockReturnValueOnce({});

      // Act
      const { user } = render(<AccessRequestModalForm />);
      await user.click(
        screen.getByRole('radio', {
          name: /approve/i,
        }),
      );

      // Assert
      expect(
        screen.getByRole('button', {
          name: /save/i,
        }),
      ).not.toHaveAttribute('disabled');
      expect(
        screen.getByRole('button', {
          name: /cancel/i,
        }),
      ).not.toHaveAttribute('disabled');
    });

    it('properly disable save button in case of deny', async () => {
      // Arrange
      useGlobalStateMock.mockReturnValueOnce({
        accessRequest: { status: { state: AccessRequestState.PENDING } },
      });
      useGlobalStateMock.mockReturnValueOnce({});
      useGlobalStateMock.mockReturnValueOnce({});

      // Act
      const { user } = render(<AccessRequestModalForm />);
      await user.click(
        screen.getByRole('radio', {
          name: /deny/i,
        }),
      );

      // Assert
      expect(
        screen.getByRole('button', {
          name: /save/i,
        }),
      ).toHaveAttribute('disabled');
      expect(
        screen.getByRole('button', {
          name: /cancel/i,
        }),
      ).not.toHaveAttribute('disabled');
    });

    it('properly enable save button in case of deny and form fields properly filled', async () => {
      // Arrange
      useGlobalStateMock.mockReturnValueOnce({
        accessRequest: { status: { state: AccessRequestState.PENDING } },
      });
      useGlobalStateMock.mockReturnValueOnce({});
      useGlobalStateMock.mockReturnValueOnce({});

      const { user } = render(<AccessRequestModalForm />);
      await user.click(
        screen.getByRole('radio', {
          name: /deny/i,
        }),
      );
      expect(
        screen.getByRole('button', {
          name: /save/i,
        }),
      ).toHaveAttribute('disabled');

      // Act
      await user.type(
        screen.getByRole('textbox', {
          name: /access request justification/i,
        }),
        '1234567890abcdef',
      );

      // Assert
      expect(
        screen.getByRole('button', {
          name: /save/i,
        }),
      ).not.toHaveAttribute('disabled');
    });

    it('save button disabled in case of validation failure', async () => {
      // Arrange
      useGlobalStateMock.mockReturnValueOnce({
        accessRequest: { status: { state: AccessRequestState.PENDING } },
      });
      useGlobalStateMock.mockReturnValueOnce({});
      useGlobalStateMock.mockReturnValueOnce({});

      const { user } = render(<AccessRequestModalForm />);
      await user.click(
        screen.getByRole('radio', {
          name: /deny/i,
        }),
      );
      expect(
        screen.getByRole('button', {
          name: /save/i,
        }),
      ).toHaveAttribute('disabled');

      // Act
      await user.type(
        screen.getByRole('textbox', {
          name: /access request justification/i,
        }),
        '1234567890abcdef#',
      );

      // Assert
      expect(
        screen.getByRole('button', {
          name: /save/i,
        }),
      ).toHaveAttribute('disabled');
    });

    it('submits', async () => {
      // Arrange
      const onCloseMock = jest.fn();
      useGlobalStateMock.mockReturnValueOnce({
        accessRequest: { status: { state: AccessRequestState.PENDING } },
        onClose: onCloseMock,
      });
      useGlobalStateMock.mockReturnValueOnce({});
      useGlobalStateMock.mockReturnValueOnce({});

      const { user } = render(<AccessRequestModalForm />);
      await user.click(
        screen.getByRole('radio', {
          name: /approve/i,
        }),
      );

      // Act
      await user.click(
        within(screen.getByRole('contentinfo')).getByRole('button', {
          name: /save/i,
        }),
      );

      // Assert
      expect(dispatchMock).toHaveBeenCalledTimes(1);
      expect(dispatchMock).toHaveBeenCalledWith('postAccessRequestDecisionValue');
    });

    it('closes after submit', async () => {
      // Arrange
      const onCloseMock = jest.fn();
      useGlobalStateMock.mockReturnValueOnce({
        accessRequest: { status: { state: AccessRequestState.PENDING } },
        onClose: onCloseMock,
      });
      useGlobalStateMock.mockReturnValueOnce({});
      useGlobalStateMock.mockReturnValueOnce({});
      const { user, rerender } = render(<AccessRequestModalForm />);
      await user.click(
        screen.getByRole('radio', {
          name: /approve/i,
        }),
      );
      await user.click(
        within(screen.getByRole('contentinfo')).getByRole('button', {
          name: /save/i,
        }),
      );

      // Act
      useGlobalStateMock.mockReturnValueOnce({
        accessRequest: { status: { state: AccessRequestState.PENDING } },
        onClose: onCloseMock,
      });
      useGlobalStateMock.mockReturnValueOnce({ fulfilled: true });
      useGlobalStateMock.mockReturnValueOnce({});
      rerender(<AccessRequestModalForm />);

      // Assert
      expect(onCloseMock).toHaveBeenCalledTimes(1);
      expect(dispatchMock).toHaveBeenCalledTimes(2);
      expect(dispatchMock).toHaveBeenCalledWith('closeModalValue');
    });
  });
});
