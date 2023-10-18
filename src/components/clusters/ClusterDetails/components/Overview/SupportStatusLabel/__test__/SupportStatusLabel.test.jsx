import React from 'react';
// import { shallow } from 'enzyme';
import { render, checkAccessibility, screen } from '~/testUtils';

import SupportStatusLabel from '../SupportStatusLabel';

const supportStatuses = {
  4.5: 'Full Support',
  4.4: 'Maintenance Support',
  4.3: 'Extended Update Support',
  4.2: 'End Of Life',
  4.1: 'some other status',
};
const getSupportStatus = jest.fn();

const defaultProps = {
  getSupportStatus,
  clusterVersion: '4.5',
};

describe('<SupportStatusLabel />', () => {
  // let wrapper;
  // let getSupportStatus;
  // beforeEach(() => {
  //   getSupportStatus = jest.fn();
  //   wrapper = shallow(
  //     <SupportStatusLabel getSupportStatus={getSupportStatus} clusterVersion="4.5" />,
  //   );
  // });
  beforeEach(() => {
    getSupportStatus.mockClear();
  });

  it('is accessible', async () => {
    const { container } = render(<SupportStatusLabel {...defaultProps} />);
    await checkAccessibility(container);
  });

  it('should fetch status on initial mount', () => {
    expect(getSupportStatus).not.toHaveBeenCalled();
    render(<SupportStatusLabel {...defaultProps} />);
    expect(getSupportStatus).toHaveBeenCalled();
  });

  it('should render skeleton when pending', () => {
    const { container } = render(<SupportStatusLabel {...defaultProps} pending />);
    expect(container.querySelector('.pf-c-skeleton')).toBeInTheDocument();
  });

  it('should show N/A when support status is unknown', () => {
    render(<SupportStatusLabel {...defaultProps} fulfilled />);
    expect(screen.getByText('N/A')).toBeInTheDocument();
  });

  it('should show N/A for a pre-release version', () => {
    render(
      <SupportStatusLabel {...defaultProps} clusterVersion="4.5.0-0.nightly-2020-07-14-052310" />,
    );
    expect(screen.getByText('N/A')).toBeInTheDocument();
  });

  describe('should render for every possible support status', () => {
    const newProps = {
      ...defaultProps,
      fulfilled: true,
      supportStatus: supportStatuses,
    };

    it('renders for Full Support', () => {
      render(<SupportStatusLabel {...newProps} clusterVersion="4.5" />);

      expect(screen.getByText('Full support')).toHaveClass('pf-c-label__content');
    });

    it('renders for Maintenance Support', () => {
      render(<SupportStatusLabel {...newProps} clusterVersion="4.4" />);

      expect(screen.getByText('Maintenance support')).toHaveClass('pf-c-label__content');
    });

    it('renders for Extended Update Support', () => {
      render(<SupportStatusLabel {...newProps} clusterVersion="4.3" />);

      expect(screen.getByText('Extended update support')).toHaveClass('pf-c-label__content');
    });

    it('renders for End of Life', () => {
      render(<SupportStatusLabel {...newProps} clusterVersion="4.2" />);

      expect(screen.getByText('End of life')).toHaveClass('pf-c-label__content');
    });

    it('renders for an unrecognized status', () => {
      render(<SupportStatusLabel {...newProps} clusterVersion="4.1" />);

      expect(screen.getByText('some other status')).toHaveClass('pf-c-label__content');
    });
  });
});
