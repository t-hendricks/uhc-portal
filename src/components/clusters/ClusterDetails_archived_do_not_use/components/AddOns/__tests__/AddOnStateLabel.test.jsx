import React from 'react';

import { checkAccessibility, render, screen } from '~/testUtils';

import AddOnsConstants from '../AddOnsConstants';
import AddOnStateLabel from '../AddOnStateLabel';

describe('<AddOnsStateLabel />', () => {
  it('is accessible', async () => {
    const { container } = render(
      <AddOnStateLabel
        addOn={{}}
        installedAddOn={{
          state: AddOnsConstants.INSTALLATION_STATE.READY,
        }}
        requirements={{ fulfilled: true, errorMsgs: [] }}
      />,
    );
    await checkAccessibility(container);
  });

  it('should render installed label if state is ready', () => {
    const { container } = render(
      <AddOnStateLabel
        addOn={{}}
        installedAddOn={{
          state: AddOnsConstants.INSTALLATION_STATE.READY,
        }}
        requirements={{ fulfilled: true, errorMsgs: [] }}
      />,
    );

    expect(container.querySelector(`[ data-icon="checkCircle"]`)).toBeInTheDocument();
    expect(screen.getByText('Installed')).toBeInTheDocument();
  });

  it('should render prerequisites not met if addon has requirements', () => {
    const props = {
      addOn: {
        requirements: [
          {
            id: 'my-cluster-req',
            resource: 'cluster',
            data: {
              cloud_providerd: 'gcp',
            },
            enabled: true,
          },
        ],
      },
      requirements: { fulfilled: false, errorMsgs: [] },
    };

    const { container } = render(<AddOnStateLabel {...props} />);

    expect(container.querySelector(`[ data-icon="cubes"]`)).toBeInTheDocument();
    expect(screen.getByText('Prerequisites not met')).toBeInTheDocument();
  });

  it('should render installing if addon is pending ', () => {
    const props = {
      addOn: {},
      requirements: { fulfilled: true, errorMsgs: [] },
      installedAddOn: {
        state: AddOnsConstants.INSTALLATION_STATE.PENDING,
      },
    };

    const { container } = render(<AddOnStateLabel {...props} />);

    expect(container.querySelector(`[ data-icon="inProgress"]`)).toBeInTheDocument();
    expect(screen.getByText('Installing')).toBeInTheDocument();
  });

  it('should render installing if addon is  installing', () => {
    const props = {
      addOn: {},
      requirements: { fulfilled: true, errorMsgs: [] },
      installedAddOn: {
        state: AddOnsConstants.INSTALLATION_STATE.INSTALLING,
      },
    };

    const { container } = render(<AddOnStateLabel {...props} />);

    expect(container.querySelector(`[ data-icon="inProgress"]`)).toBeInTheDocument();
    expect(screen.getByText('Installing')).toBeInTheDocument();
  });

  it('should render uninstalling if addon is deleted', () => {
    const props = {
      addOn: {},
      requirements: { fulfilled: true, errorMsgs: [] },
      installedAddOn: {
        state: AddOnsConstants.INSTALLATION_STATE.DELETED,
      },
    };

    const { container } = render(<AddOnStateLabel {...props} />);

    expect(container.querySelector(`[ data-icon="inProgress"]`)).toBeInTheDocument();
    expect(screen.getByText('Uninstalling')).toBeInTheDocument();
  });

  it('should render uninstalling if addon is deleting', () => {
    const props = {
      addOn: {},
      requirements: { fulfilled: true, errorMsgs: [] },
      installedAddOn: {
        state: AddOnsConstants.INSTALLATION_STATE.DELETING,
      },
    };

    const { container } = render(<AddOnStateLabel {...props} />);

    expect(container.querySelector(`[ data-icon="inProgress"]`)).toBeInTheDocument();
    expect(screen.getByText('Uninstalling')).toBeInTheDocument();
  });

  it('should render add-on failed if addon state is failed', () => {
    const props = {
      addOn: {},
      requirements: { fulfilled: true, errorMsgs: [] },
      installedAddOn: {
        state: AddOnsConstants.INSTALLATION_STATE.FAILED,
      },
    };

    const { container } = render(<AddOnStateLabel {...props} />);

    expect(container.querySelector(`[ data-icon="exclamationCircle"]`)).toBeInTheDocument();
    expect(screen.getByText('Add-on failed')).toBeInTheDocument();
  });

  it('should render unknown if addon state is unknown', () => {
    const props = {
      addOn: {},
      requirements: { fulfilled: true, errorMsgs: [] },
      installedAddOn: {
        state: 'something wrong',
      },
    };

    const { container } = render(<AddOnStateLabel {...props} />);

    expect(container.querySelector(`[ data-icon="unknown"]`)).toBeInTheDocument();
    expect(screen.getByText('Unknown')).toBeInTheDocument();
  });
});
