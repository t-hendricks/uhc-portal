import React from 'react';

import { render, checkAccessibility, screen } from '~/testUtils';

import AddOnsCard from '../AddOnsCard';
import AddOnsConstants from '../../AddOnsConstants';

describe('<AddOnsCard />', () => {
  const onClick = jest.fn();

  const props = {
    addOn: {
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum',
      enabled: true,
      has_external_resources: false,
      hidden: false,
      id: 'dummy-id',
      kind: 'AddOn',
      label: 'api.openshift.com/dummy',
      name: 'Dummy Name',
      operator_name: 'dummy-operator',
      parameters: {
        items: [
          {
            id: 'dummy item',
            enabled: true,
          },
        ],
      },
    },
    installedAddOn: {
      state: AddOnsConstants.INSTALLATION_STATE.READY,
    },
    requirements: { fulfilled: true, errorMsgs: [] },
    onClick,
    activeCard: 'dummy-id',
  };
  // beforeEach(() => {
  //   wrapper = shallow(<AddOnsCard {...props} />);
  // });

  afterEach(() => {
    onClick.mockClear();
  });

  it('is accessible', async () => {
    const { container } = render(<AddOnsCard {...props} />);
    await checkAccessibility(container);
  });

  it('should render reduced description to 60 char length', () => {
    render(<AddOnsCard {...props} />);
    const cardBody = screen.getByTestId('cardBody');

    expect(cardBody.textContent).toHaveLength(60);
  });

  it('should have a label that matches installed addon state', () => {
    render(<AddOnsCard {...props} />);
    expect(screen.getByText('Installed')).toBeInTheDocument();
  });
});
