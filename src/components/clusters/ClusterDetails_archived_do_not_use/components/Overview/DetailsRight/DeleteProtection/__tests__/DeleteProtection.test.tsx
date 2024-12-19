import React from 'react';
import * as reactRedux from 'react-redux';

import { openModal } from '~/components/common/Modal/ModalActions';
import modals from '~/components/common/Modal/modals';
import { screen, withState } from '~/testUtils';

import DeleteProtection from '../DeleteProtection';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
}));

jest.mock('~/components/common/Modal/ModalActions');
jest.mock('../deleteProtectionActions');

const props = {
  clusterID: 'fake-cluster',
  canToggle: true,
  protectionEnabled: true,
};

const state = {
  clusters: { details: { fulfilled: true } },
  deleteProtection: { updateDeleteProtection: { fulfilled: false } },
};

describe('<DeleteProtection />', () => {
  const noPermissionProps = {
    ...props,
    canToggle: false,
  };
  it('Shows cluster delete protection is enabled', async () => {
    withState(state).render(<DeleteProtection {...props} />);
    expect(screen.getByText('Delete Protection: Enabled')).toBeInTheDocument();
  });

  it('Shows cluster delete protection is disabled', () => {
    const protectionDisabledprops = {
      ...props,
      protectionEnabled: false,
    };
    withState(state).render(<DeleteProtection {...protectionDisabledprops} />);
    expect(screen.getByText('Delete Protection: Disabled')).toBeInTheDocument();
  });

  it('Disables the "Enable" button if not enough permission', () => {
    const disabledEnableButtonProps = {
      ...noPermissionProps,
      protectionEnabled: false,
    };
    withState(state).render(<DeleteProtection {...disabledEnableButtonProps} />);

    expect(screen.getByRole('button', { name: 'Enable' })).toHaveAttribute('aria-disabled', 'true');
  });

  it('Disables the "Disable" button if not enough permission', () => {
    withState(state).render(<DeleteProtection {...noPermissionProps} />);

    expect(screen.getByRole('button', { name: 'Disable' })).toHaveAttribute(
      'aria-disabled',
      'true',
    );
  });

  it('Disables the "Disable" button when refreshing', () => {
    const refreshingState = {
      deleteProtection: { updateDeleteProtection: { pending: true } },
    };
    withState(refreshingState).render(<DeleteProtection {...props} />);

    expect(screen.getByRole('button', { name: 'Disable' })).toHaveAttribute(
      'aria-disabled',
      'true',
    );
  });

  it('Enables the "Disable" button when refreshing completed', () => {
    const refreshingState = {
      clusters: { details: { fulfilled: true } },
    };
    withState(refreshingState).render(<DeleteProtection {...props} />);

    expect(screen.getByRole('button', { name: 'Disable' })).toHaveAttribute(
      'aria-disabled',
      'false',
    );
  });

  it('Displays N/A when cluster is uninstalling', () => {
    const newProps = {
      ...props,
      isUninstalling: true,
    };
    withState(state).render(<DeleteProtection {...newProps} />);

    expect(screen.getByText('N/A')).toBeInTheDocument();
  });
});

describe('Delete protection - redux actions', () => {
  jest.mock('~/redux/hooks', () => ({
    useGlobalState: jest.fn(),
  }));

  const useDispatchMock = jest.spyOn(reactRedux, 'useDispatch');
  const mockedDispatch = jest.fn();
  useDispatchMock.mockReturnValue(mockedDispatch);

  afterEach(() => {
    useDispatchMock.mockClear();
    mockedDispatch.mockClear();
  });

  it('Opens the modal', async () => {
    const { user } = withState(state).render(<DeleteProtection {...props} />);
    await user.click(screen.getByRole('button'));
    expect(openModal).toHaveBeenCalledWith(modals.DELETE_PROTECTION, {
      clusterID: 'fake-cluster',
      protectionEnabled: true,
    });
  });
});
