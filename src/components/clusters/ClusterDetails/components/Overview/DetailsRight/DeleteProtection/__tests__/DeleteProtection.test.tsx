import React from 'react';
import * as reactRedux from 'react-redux';

import { openModal } from '~/components/common/Modal/ModalActions';
import modals from '~/components/common/Modal/modals';
import { render, screen } from '~/testUtils';

import DeleteProtection from '../DeleteProtection';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
}));

jest.mock('~/components/common/Modal/ModalActions');

jest.mock('~/redux/hooks', () => ({
  useGlobalState: jest.fn(),
}));

const props = {
  clusterID: 'fake-cluster',
  canToggle: true,
  protectionEnabled: true,
  pending: false,
};

describe('<DeleteProtection />', () => {
  const noPermissionProps = {
    ...props,
    canToggle: false,
  };
  it('Shows cluster delete protection is enabled', () => {
    render(<DeleteProtection {...props} />);
    expect(screen.getByText('Delete Protection: Enabled')).toBeInTheDocument();
  });

  it('Shows cluster delete protection is disabled', () => {
    const protectionDisabledprops = {
      ...props,
      protectionEnabled: false,
    };
    render(<DeleteProtection {...protectionDisabledprops} />);
    expect(screen.getByText('Delete Protection: Disabled')).toBeInTheDocument();
  });

  it('Disables the "Enable" button if not enough permission', () => {
    const disabledEnableButtonProps = {
      ...noPermissionProps,
      protectionEnabled: false,
    };
    render(<DeleteProtection {...disabledEnableButtonProps} />);

    expect(screen.getByRole('button', { name: 'Enable' })).toHaveAttribute('aria-disabled', 'true');
  });

  it('Disables the "Disable" button if not enough permission', () => {
    render(<DeleteProtection {...noPermissionProps} />);

    expect(screen.getByRole('button', { name: 'Disable' })).toHaveAttribute(
      'aria-disabled',
      'true',
    );
  });

  it('Disables the "Disable" button when refreshing', () => {
    const refreshingProps = {
      ...props,
      pending: true,
    };
    render(<DeleteProtection {...refreshingProps} />);

    expect(screen.getByRole('button', { name: 'Disable' })).toHaveAttribute(
      'aria-disabled',
      'true',
    );
  });
});

describe('Delete protection - modal action', () => {
  const useDispatchMock = jest.spyOn(reactRedux, 'useDispatch');
  const mockedDispatch = jest.fn();
  useDispatchMock.mockReturnValue(mockedDispatch);

  afterEach(() => {
    useDispatchMock.mockClear();
    mockedDispatch.mockClear();
  });

  it('Opens the modal', async () => {
    const { user } = render(<DeleteProtection {...props} />);
    await user.click(screen.getByRole('button'));
    expect(openModal).toHaveBeenCalledWith(modals.DELETE_PROTECTION, {
      clusterID: 'fake-cluster',
      protectionEnabled: true,
    });
  });
});
