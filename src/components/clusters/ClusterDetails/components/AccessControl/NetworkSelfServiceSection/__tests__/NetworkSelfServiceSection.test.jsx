import React from 'react';

import { screen, render, checkAccessibility } from '~/testUtils';

import NetworkSelfServiceSection from '../NetworkSelfServiceSection';

jest.useFakeTimers({
  legacyFakeTimers: true, // TODO 'modern'
});

const baseResponse = {
  fulfilled: false,
  pending: false,
  error: false,
};
const fakeGrants = [
  {
    user_arn: 'fake-arn',
    state: 'pending',
    role: {
      id: 'network-mgmt',
    },
    id: 'fake-id-1',
    roleName: 'Network Management',
    console_url: 'http://example.com',
  },
  {
    user_arn: 'fake-arn2',
    state: 'pending',
    role: {
      id: 'read-only',
    },
    id: 'fake-id-2',
    roleName: 'Read Only',
    console_url: 'http://example.com',
  },
];

describe('<NetworkSelfServiceSection />', () => {
  const getRoles = jest.fn();
  const getGrants = jest.fn();
  const deleteGrant = jest.fn();
  const openAddGrantModal = jest.fn();
  const addNotification = jest.fn();

  const props = {
    canEdit: true,
    getRoles,
    getGrants,
    deleteGrant,
    openAddGrantModal,
    addNotification,
    grants: { ...baseResponse, data: [] },
    deleteGrantResponse: baseResponse,
    addGrantResponse: baseResponse,
    clusterHibernating: false,
    isReadOnly: false,
  };

  afterEach(() => {
    getRoles.mockClear();
    getGrants.mockClear();
    deleteGrant.mockClear();
    openAddGrantModal.mockClear();
    addNotification.mockClear();
  });

  it.skip('is accessible with no data', async () => {
    // This test throws an Async callback was not invoked within the 5000 ms timeout specified by jest.setTimeout.Timeout
    // error when trying to check accessibility
    // This is most likely an issue with the internal timers

    const { container } = render(<NetworkSelfServiceSection {...props} />);
    await checkAccessibility(container);
  });

  it('should call getGrants and getRoles on mount', () => {
    expect(getRoles).not.toHaveBeenCalled();
    expect(getGrants).not.toHaveBeenCalled();

    render(<NetworkSelfServiceSection {...props} />);

    expect(getRoles).toHaveBeenCalled();
    expect(getGrants).toHaveBeenCalled();
  });

  it('should open modal when needed', async () => {
    const { user } = render(<NetworkSelfServiceSection {...props} />);
    expect(openAddGrantModal).not.toHaveBeenCalled();
    await user.click(screen.getByRole('button', { name: 'Grant role' }));

    jest.runAllTimers();
    expect(openAddGrantModal).toHaveBeenCalled();
  });

  it('should call getGrants() when a grant is added', () => {
    expect(getGrants).not.toHaveBeenCalled();
    const pendingProps = { ...props, addGrantResponse: { ...baseResponse, pending: true } };

    const { rerender } = render(<NetworkSelfServiceSection {...pendingProps} />);
    expect(getGrants).toHaveBeenCalledTimes(1);

    const fulfilledProps = { ...props, addGrantResponse: { ...baseResponse, fulfilled: true } };

    rerender(<NetworkSelfServiceSection {...fulfilledProps} />);

    expect(getGrants).toHaveBeenCalledTimes(2);
  });

  it('should call getGrants() when a grant is removed', () => {
    expect(getGrants).not.toHaveBeenCalled();
    const pendingProps = { ...props, deleteGrantResponse: { ...baseResponse, pending: true } };

    const { rerender } = render(<NetworkSelfServiceSection {...pendingProps} />);
    expect(getGrants).toHaveBeenCalledTimes(1);

    const fulfilledProps = { ...props, deleteGrantResponse: { ...baseResponse, fulfilled: true } };

    rerender(<NetworkSelfServiceSection {...fulfilledProps} />);

    expect(getGrants).toHaveBeenCalledTimes(2);
  });

  it('should render skeleton when pending and no grants are set', () => {
    const newProps = { ...props, grants: { ...baseResponse, pending: true, data: [] } };
    const { container } = render(<NetworkSelfServiceSection {...newProps} />);
    // There isn't an easy besides class to find skeletons
    expect(container.querySelectorAll('.pf-v5-c-skeleton').length).toBeGreaterThan(0);
  });

  it('displays grant arns in table cells', async () => {
    const newProps = {
      ...props,
      grants: {
        ...baseResponse,
        fulfilled: true,
        data: fakeGrants,
      },
    };
    render(<NetworkSelfServiceSection {...newProps} />);
    expect(screen.getByRole('cell', { name: 'fake-arn' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: 'fake-arn2' })).toBeInTheDocument();
  });

  it('should notify when a grant fails', () => {
    const pendingProps = {
      ...props,
      grants: { ...baseResponse, pending: true, data: fakeGrants },
    };
    const { rerender } = render(<NetworkSelfServiceSection {...pendingProps} />);

    expect(addNotification).not.toHaveBeenCalled();

    const fulfilledProps = {
      ...props,
      grants: {
        ...baseResponse,
        fulfilled: true,
        data: [
          {
            ...fakeGrants[0],
            state: 'failed',
            state_description: 'some failure',
          },
          fakeGrants[1],
        ],
      },
    };
    rerender(<NetworkSelfServiceSection {...fulfilledProps} />);

    expect(addNotification).toHaveBeenCalledWith({
      variant: 'danger',
      title: 'Role creation failed for fake-arn',
      description: 'some failure',
      dismissDelay: 8000,
      dismissable: false,
    });
  });

  it('should notify when a grant succeeds', () => {
    const pendingProps = {
      ...props,
      grants: { ...baseResponse, pending: true, data: fakeGrants },
    };
    const { rerender } = render(<NetworkSelfServiceSection {...pendingProps} />);

    expect(addNotification).not.toHaveBeenCalled();

    const fulfilledProps = {
      ...props,
      grants: {
        ...baseResponse,
        fulfilled: true,
        data: [
          fakeGrants[0],
          {
            ...fakeGrants[1],
            state: 'ready',
          },
        ],
      },
    };
    rerender(<NetworkSelfServiceSection {...fulfilledProps} />);
    expect(addNotification).toHaveBeenCalledWith({
      variant: 'success',
      title: 'Read Only role successfully created for fake-arn2',
      dismissDelay: 8000,
      dismissable: false,
    });
  });

  it('should disable add button when canEdit is false', () => {
    render(
      <NetworkSelfServiceSection
        canEdit={false}
        getRoles={getRoles}
        getGrants={getGrants}
        deleteGrant={deleteGrant}
        openAddGrantModal={openAddGrantModal}
        addNotification={addNotification}
        grants={{ ...baseResponse, fulfilled: true, data: fakeGrants }}
        deleteGrantResponse={baseResponse}
        addGrantResponse={baseResponse}
        clusterHibernating={false}
        isReadOnly={false}
      />,
    );

    expect(screen.getByRole('button', { name: 'Grant role' })).toHaveAttribute(
      'aria-disabled',
      'true',
    );
  });

  it('should disable add button when hibernating', () => {
    render(
      <NetworkSelfServiceSection
        canEdit
        getRoles={getRoles}
        getGrants={getGrants}
        deleteGrant={deleteGrant}
        openAddGrantModal={openAddGrantModal}
        addNotification={addNotification}
        grants={{ ...baseResponse, fulfilled: true, data: fakeGrants }}
        deleteGrantResponse={baseResponse}
        addGrantResponse={baseResponse}
        clusterHibernating
        isReadOnly={false}
      />,
    );
    expect(screen.getByRole('button', { name: 'Grant role' })).toHaveAttribute(
      'aria-disabled',
      'true',
    );
  });

  it('should disable add button when read_only', () => {
    render(
      <NetworkSelfServiceSection
        canEdit
        getRoles={getRoles}
        getGrants={getGrants}
        deleteGrant={deleteGrant}
        openAddGrantModal={openAddGrantModal}
        addNotification={addNotification}
        grants={{ ...baseResponse, fulfilled: true, data: fakeGrants }}
        deleteGrantResponse={baseResponse}
        addGrantResponse={baseResponse}
        clusterHibernating={false}
        isReadOnly
      />,
    );
    expect(screen.getByRole('button', { name: 'Grant role' })).toHaveAttribute(
      'aria-disabled',
      'true',
    );
  });
});
