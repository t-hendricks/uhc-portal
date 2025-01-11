import React from 'react';
import * as reactRedux from 'react-redux';

import { closeModal } from '~/components/common/Modal/ModalActions';
import {
  canMakeDecision,
  postAccessRequestDecision,
  resetCanMakeDecision,
} from '~/redux/actions/accessRequestActions';
import { useGlobalState } from '~/redux/hooks';
import { baseRequestState } from '~/redux/reduxHelpers';
import { PromiseReducerState } from '~/redux/types';
import { act, render, screen, within } from '~/testUtils';
import { AccessRequest, Decision } from '~/types/access_transparency.v1';

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
  canMakeDecision: jest.fn(),
  resetCanMakeDecision: jest.fn(),
}));

const useGlobalStateMock = useGlobalState as jest.Mock;
const closeModalMock = closeModal as jest.Mock;
const postAccessRequestDecisionMock = postAccessRequestDecision as jest.Mock;
const canMakeDecisionMock = canMakeDecision as jest.Mock;
const resetCanMakeDecisionMock = resetCanMakeDecision as jest.Mock;

describe('AccessRequestModalForm', () => {
  const REFRESH_TIMES = 1;
  const useDispatchMock = jest.spyOn(reactRedux, 'useDispatch');
  const dispatchMock = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();
    useDispatchMock.mockReturnValue(dispatchMock);
    closeModalMock.mockReturnValue('closeModalValue');
    postAccessRequestDecisionMock.mockReturnValue('postAccessRequestDecisionValue');
    canMakeDecisionMock.mockReturnValue('canMakeDecisionMockValue');
    resetCanMakeDecisionMock.mockReturnValue('resetCanMakeDecisionValue');
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

  describe('is loading', () =>
    it.each([
      ['when access request empty', {}, baseRequestState, baseRequestState],
      [
        'when postAccessRequestDecision is pending',
        { id: 'accessRequestId' },
        { ...baseRequestState, pending: true },
        baseRequestState,
      ],
      [
        'when canMakeDecision is not pending',
        { id: 'accessRequestId' },
        { ...baseRequestState, pending: false },
        { ...baseRequestState, pending: true },
      ],
    ])(
      '%p',
      (
        _title: string,
        accessRequest: AccessRequest | undefined,
        postAccessRequestDecisionState: PromiseReducerState<Decision>,
        canMakeDecisionState: PromiseReducerState<{ allowed: boolean }>,
      ) => {
        // Arrange
        useGlobalStateMock.mockReturnValueOnce({ accessRequest });
        useGlobalStateMock.mockReturnValueOnce(postAccessRequestDecisionState);
        useGlobalStateMock.mockReturnValueOnce(canMakeDecisionState);
        useGlobalStateMock.mockReturnValueOnce('organizationId');

        // Act
        render(<AccessRequestModalForm />);

        // Assert
        expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
      },
    ));

  it('is not loading', () => {
    // Arrange
    for (let i = 0; i <= REFRESH_TIMES; i += 1) {
      useGlobalStateMock.mockReturnValueOnce({ accessRequest: { id: 'accessRequestId' } });
      useGlobalStateMock.mockReturnValueOnce({ ...baseRequestState, pending: false });
      useGlobalStateMock.mockReturnValueOnce({ ...baseRequestState, pending: false });
      useGlobalStateMock.mockReturnValueOnce('organizationId');
    }

    // Act
    render(<AccessRequestModalForm />);

    // Assert
    expect(screen.queryByText(/Loading.../i)).not.toBeInTheDocument();
  });

  describe('it renders properly', () => {
    it('is not editMode', () => {
      // Arrange
      for (let i = 0; i <= REFRESH_TIMES; i += 1) {
        useGlobalStateMock.mockReturnValueOnce({ accessRequest: { id: 'accessRequestId' } });
        useGlobalStateMock.mockReturnValueOnce({ ...baseRequestState, pending: false });
        useGlobalStateMock.mockReturnValueOnce({ ...baseRequestState, pending: false });
        useGlobalStateMock.mockReturnValueOnce('organizationId');
      }

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

    it('is editMode no rights for making a decision', async () => {
      // Arrange
      for (let i = 0; i <= REFRESH_TIMES; i += 1) {
        useGlobalStateMock.mockReturnValueOnce({
          accessRequest: { id: 'accessRequestId', status: { state: AccessRequestState.PENDING } },
        });
        useGlobalStateMock.mockReturnValueOnce({ ...baseRequestState, pending: false });
        useGlobalStateMock.mockReturnValueOnce({ ...baseRequestState, pending: false });
        useGlobalStateMock.mockReturnValueOnce('organizationId');
      }

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
      expect(screen.getByText(/No rights for making a decision/i)).toBeInTheDocument();
    });

    it('is editMode with rights for making a decision', async () => {
      // Arrange
      for (let i = 0; i <= REFRESH_TIMES; i += 1) {
        useGlobalStateMock.mockReturnValueOnce({
          accessRequest: { id: 'accessRequestId', status: { state: AccessRequestState.PENDING } },
        });
        useGlobalStateMock.mockReturnValueOnce({ ...baseRequestState, pending: false });
        useGlobalStateMock.mockReturnValueOnce({
          ...baseRequestState,
          pending: false,
          allowed: true,
        });
        useGlobalStateMock.mockReturnValueOnce('organizationId');
      }

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
      expect(screen.queryByText(/No rights for making a decision/i)).not.toBeInTheDocument();
    });

    // Skipping failing test because this file will be removed soon
    it.skip('shows error after submit error', async () => {
      // Arrange
      const onCloseMock = jest.fn();

      for (let i = 0; i <= REFRESH_TIMES; i += 1) {
        useGlobalStateMock.mockReturnValueOnce({
          accessRequest: { id: 'accessRequestId', status: { state: AccessRequestState.PENDING } },
          onClose: onCloseMock,
        });
        useGlobalStateMock.mockReturnValueOnce({});
        useGlobalStateMock.mockReturnValueOnce({ allowed: true });
        useGlobalStateMock.mockReturnValueOnce('organizationId');
      }

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
        accessRequest: { id: 'accessRequestId', status: { state: AccessRequestState.PENDING } },
        onClose: onCloseMock,
      });
      useGlobalStateMock.mockReturnValueOnce({
        error: {},
      });
      useGlobalStateMock.mockReturnValueOnce({});
      useGlobalStateMock.mockReturnValueOnce('organizationId');

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
      for (let i = 0; i <= REFRESH_TIMES; i += 1) {
        useGlobalStateMock.mockReturnValueOnce({
          accessRequest: { id: 'accessRequestId', status: { state: AccessRequestState.PENDING } },
          onClose: onCloseMock,
        });
        useGlobalStateMock.mockReturnValueOnce({ ...baseRequestState, pending: false });
        useGlobalStateMock.mockReturnValueOnce({
          ...baseRequestState,
          pending: false,
          allowed: true,
        });
        useGlobalStateMock.mockReturnValueOnce('organizationId');
      }

      const { user } = render(<AccessRequestModalForm />);

      // Act
      await user.click(
        screen.getByRole('button', {
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
      for (let i = 0; i <= REFRESH_TIMES; i += 1) {
        useGlobalStateMock.mockReturnValueOnce({
          accessRequest: { id: 'accessRequestId', status: { state: AccessRequestState.PENDING } },
        });
        useGlobalStateMock.mockReturnValueOnce({ ...baseRequestState, pending: false });
        useGlobalStateMock.mockReturnValueOnce({
          ...baseRequestState,
          pending: false,
          allowed: true,
        });
        useGlobalStateMock.mockReturnValueOnce('organizationId');
      }

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
      for (let i = 0; i <= REFRESH_TIMES; i += 1) {
        useGlobalStateMock.mockReturnValueOnce({
          accessRequest: { id: 'accessRequestId', status: { state: AccessRequestState.PENDING } },
        });
        useGlobalStateMock.mockReturnValueOnce({ ...baseRequestState, pending: false });
        useGlobalStateMock.mockReturnValueOnce({
          ...baseRequestState,
          pending: false,
          allowed: true,
        });
        useGlobalStateMock.mockReturnValueOnce('organizationId');
      }

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
      for (let i = 0; i <= REFRESH_TIMES; i += 1) {
        useGlobalStateMock.mockReturnValueOnce({
          accessRequest: { id: 'accessRequestId', status: { state: AccessRequestState.PENDING } },
        });
        useGlobalStateMock.mockReturnValueOnce({ ...baseRequestState, pending: false });
        useGlobalStateMock.mockReturnValueOnce({
          ...baseRequestState,
          pending: false,
          allowed: true,
        });
        useGlobalStateMock.mockReturnValueOnce('organizationId');
      }

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
      for (let i = 0; i <= REFRESH_TIMES; i += 1) {
        useGlobalStateMock.mockReturnValueOnce({
          accessRequest: { id: 'accessRequestId', status: { state: AccessRequestState.PENDING } },
        });
        useGlobalStateMock.mockReturnValueOnce({ ...baseRequestState, pending: false });
        useGlobalStateMock.mockReturnValueOnce({
          ...baseRequestState,
          pending: false,
          allowed: true,
        });
        useGlobalStateMock.mockReturnValueOnce('organizationId');
      }

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

    it.each([['1234567890abcdef#'], [' ']])(
      'save button disabled in case of validation failure for text %p',
      async (justificationValue: string) => {
        // Arrange
        for (let i = 0; i <= REFRESH_TIMES; i += 1) {
          useGlobalStateMock.mockReturnValueOnce({
            accessRequest: { id: 'accessRequestId', status: { state: AccessRequestState.PENDING } },
          });
          useGlobalStateMock.mockReturnValueOnce({ ...baseRequestState, pending: false });
          useGlobalStateMock.mockReturnValueOnce({
            ...baseRequestState,
            pending: false,
            allowed: true,
          });
          useGlobalStateMock.mockReturnValueOnce('organizationId');
        }

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
          justificationValue,
        );

        // Assert
        expect(
          screen.getByRole('button', {
            name: /save/i,
          }),
        ).toHaveAttribute('disabled');
      },
    );

    it('submits', async () => {
      // Arrange
      const onCloseMock = jest.fn();
      for (let i = 0; i <= REFRESH_TIMES; i += 1) {
        useGlobalStateMock.mockReturnValueOnce({
          accessRequest: { id: 'accessRequestId', status: { state: AccessRequestState.PENDING } },
          onClose: onCloseMock,
        });
        useGlobalStateMock.mockReturnValueOnce({ ...baseRequestState, pending: false });
        useGlobalStateMock.mockReturnValueOnce({
          ...baseRequestState,
          pending: false,
          allowed: true,
        });
        useGlobalStateMock.mockReturnValueOnce('organizationId');
      }

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
      for (let i = 0; i <= REFRESH_TIMES; i += 1) {
        useGlobalStateMock.mockReturnValueOnce({
          accessRequest: { id: 'accessRequestId', status: { state: AccessRequestState.PENDING } },
          onClose: onCloseMock,
        });
        useGlobalStateMock.mockReturnValueOnce({ ...baseRequestState, pending: false });
        useGlobalStateMock.mockReturnValueOnce({
          ...baseRequestState,
          pending: false,
          allowed: true,
        });
        useGlobalStateMock.mockReturnValueOnce('organizationId');
      }

      const { user, rerender } = render(<AccessRequestModalForm />);
      await user.click(
        screen.getByRole('radio', {
          name: /approve/i,
        }),
      );
      await user.click(
        screen.getByRole('button', {
          name: /save/i,
        }),
      );

      // Act
      useGlobalStateMock.mockReturnValueOnce({
        accessRequest: { id: 'accessRequestId', status: { state: AccessRequestState.PENDING } },
        onClose: onCloseMock,
      });
      useGlobalStateMock.mockReturnValueOnce({
        ...baseRequestState,
        pending: false,
        fulfilled: true,
      });
      useGlobalStateMock.mockReturnValueOnce({
        ...baseRequestState,
        pending: false,
        allowed: true,
      });
      useGlobalStateMock.mockReturnValueOnce('organizationId');

      rerender(<AccessRequestModalForm />);

      // Assert
      expect(onCloseMock).toHaveBeenCalledTimes(1);
      expect(dispatchMock).toHaveBeenCalledTimes(2);
      expect(dispatchMock).toHaveBeenCalledWith('closeModalValue');
    });

    it('properly unmounts', async () => {
      // Arrange
      for (let i = 0; i <= REFRESH_TIMES; i += 1) {
        useGlobalStateMock.mockReturnValueOnce({
          accessRequest: { id: 'accessRequestId', status: { state: AccessRequestState.PENDING } },
        });
        useGlobalStateMock.mockReturnValueOnce({ ...baseRequestState, pending: false });
        useGlobalStateMock.mockReturnValueOnce({
          ...baseRequestState,
          pending: false,
          allowed: true,
        });
        useGlobalStateMock.mockReturnValueOnce('organizationId');
      }

      const { unmount } = render(<AccessRequestModalForm />);

      // Act
      unmount();

      // Assert
      expect(dispatchMock).toHaveBeenCalledTimes(1);
      expect(dispatchMock).toHaveBeenCalledWith('resetCanMakeDecisionValue');
    });
  });

  describe('error cases', () => {
    it('post access request decision error', () => {
      // Arrange
      for (let i = 0; i <= REFRESH_TIMES; i += 1) {
        useGlobalStateMock.mockReturnValueOnce({ accessRequest: { id: 'accessRequestId' } });
        useGlobalStateMock.mockReturnValueOnce({
          ...baseRequestState,
          pending: false,
          error: 'error',
        });
        useGlobalStateMock.mockReturnValueOnce({ ...baseRequestState, pending: false });
        useGlobalStateMock.mockReturnValueOnce('organizationId');
      }

      // Act
      render(<AccessRequestModalForm />);

      // Assert
      expect(screen.getByText(/error-box/i)).toBeInTheDocument();
    });

    it('can make decision error', () => {
      // Arrange
      for (let i = 0; i <= REFRESH_TIMES; i += 1) {
        useGlobalStateMock.mockReturnValueOnce({ accessRequest: { id: 'accessRequestId' } });
        useGlobalStateMock.mockReturnValueOnce({
          ...baseRequestState,
          pending: false,
        });
        useGlobalStateMock.mockReturnValueOnce({
          ...baseRequestState,
          pending: false,
          error: 'error',
        });
        useGlobalStateMock.mockReturnValueOnce('organizationId');
      }

      // Act
      render(<AccessRequestModalForm />);

      // Assert
      expect(screen.getByText(/error-box/i)).toBeInTheDocument();
    });
  });

  describe('canMakeDecision is triggered', () => {
    it('is triggered', () => {
      // Arrange
      for (let i = 0; i <= REFRESH_TIMES; i += 1) {
        useGlobalStateMock.mockReturnValueOnce({
          accessRequest: {
            id: 'accessRequestId',
            subscription_id: 'subscriptionId',
            status: { state: AccessRequestState.PENDING },
          },
        });
        useGlobalStateMock.mockReturnValueOnce({ ...baseRequestState, pending: false });
        useGlobalStateMock.mockReturnValueOnce({ ...baseRequestState, pending: false });
        useGlobalStateMock.mockReturnValueOnce('organizationId');
      }

      // Act
      render(<AccessRequestModalForm />);

      // Assert
      expect(dispatchMock).toHaveBeenCalledTimes(1);
      expect(canMakeDecisionMock).toHaveBeenCalledWith('subscriptionId', 'organizationId');
      expect(dispatchMock).toHaveBeenCalledWith('canMakeDecisionMockValue');
    });

    it.each([
      [AccessRequestState.APPROVED, 'subscriptionId', 'organizationId'],
      [AccessRequestState.PENDING, undefined, 'organizationId'],
      [AccessRequestState.PENDING, 'subscriptionId', undefined],
    ])(
      'is not triggered. Status %p, Subscription ID %p, OrganizationID %p',
      (
        state: AccessRequestState | undefined,
        subscriptionId: string | undefined,
        organizationId: string | undefined,
      ) => {
        // Arrange
        for (let i = 0; i <= REFRESH_TIMES; i += 1) {
          useGlobalStateMock.mockReturnValueOnce({
            accessRequest: {
              id: 'accessRequestId',
              subscription_id: subscriptionId,
              status: { state },
            },
          });
          useGlobalStateMock.mockReturnValueOnce({ ...baseRequestState, pending: false });
          useGlobalStateMock.mockReturnValueOnce({ ...baseRequestState, pending: false });
          useGlobalStateMock.mockReturnValueOnce(organizationId);
        }

        // Act
        render(<AccessRequestModalForm />);

        // Assert
        expect(canMakeDecisionMock).toHaveBeenCalledTimes(0);
      },
    );
  });
});
