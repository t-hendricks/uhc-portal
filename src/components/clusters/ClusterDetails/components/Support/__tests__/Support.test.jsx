import React from 'react';

import { checkAccessibility, screen, withState } from '~/testUtils';

import Support from '../Support';

import { baseProps, notificationContactsWithContacts } from './Support.fixtures';

jest.mock('~/components/clusters/ClusterDetails/components/Support/SupportActions', () => {
  const originalModule = jest.requireActual(
    '~/components/clusters/ClusterDetails/components/Support/SupportActions',
  );

  return {
    __esModule: true,
    ...originalModule,
    default: {
      ...originalModule.default,
      getSupportCases: jest.fn(() => ({ type: 'foo' })),
      clearNotificationContacts: jest.fn(() => ({ type: 'foo' })),
      clearDeleteNotificationContacts: jest.fn(() => ({ type: 'foo' })),
      getNotificationContacts: jest.fn(() => ({ type: 'foo' })),
      deleteNotificationContact: jest.fn(() => ({ type: 'foo' })),
      addNotification: jest.fn(() => ({ type: 'foo' })),
    },
  };
});

const baseState = {
  clusters: {
    details: {
      cluster: {
        subscription: { id: 'mySubId', plan: { type: 'ROSA' } },
        external_id: 'myClusterUUID',
        openshift_version: '4.14.4',
      },
    },
  },
};

const withNotificationsState = {
  ...baseState,
  clusterSupport: {
    notificationContacts: notificationContactsWithContacts,
    deleteContactResponse: {},
    addContactResponse: {},
  },
};

describe('<Support /> ', () => {
  it('is accessible without notification contacts', async () => {
    const { container } = withState(baseState).render(<Support {...baseProps} />);
    expect(await screen.findByText('Support cases')).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'Open support case' })).not.toHaveAttribute(
      'aria-disabled',
      'true',
    );
    expect(screen.getByRole('button', { name: 'Add notification contact' })).not.toHaveAttribute(
      'aria-disabled',
      'true',
    );

    await checkAccessibility(container);
  });

  it('is accessible with notification contacts', async () => {
    const { container } = withState(withNotificationsState).render(<Support {...baseProps} />);
    expect(await screen.findByText('Support cases')).toBeInTheDocument();
    expect(screen.getByText('***REMOVED***')).toBeInTheDocument();

    const tableRowActions = screen.getAllByRole('button', { name: 'Kebab toggle' });
    tableRowActions.forEach((tableRowAction) => expect(tableRowAction).not.toBeDisabled());

    await checkAccessibility(container);
  });

  it('is disabled', async () => {
    withState(withNotificationsState).render(<Support {...baseProps} isDisabled />);
    expect(await screen.findByText('Support cases')).toBeInTheDocument();

    expect(screen.queryByRole('button', { name: 'Open support case' })).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Add notification contact' }),
    ).not.toBeInTheDocument();

    const tableRowActions = screen.getAllByRole('button', { name: 'Kebab toggle' });

    tableRowActions.forEach((tableRowAction) => expect(tableRowAction).toBeDisabled());
  });
});
