import React from 'react';
import { render, screen, within } from '~/testUtils';

import LimitedSupportAlert from '../LimitedSupportAlert';

// eslint-disable-next-line react/prop-types
jest.mock('~/common/MarkdownParser', () => ({ children }: { children: React.ReactNode }) => (
  <div data-testid="markdownparser-link-mock">{children}</div>
));

describe('<LimitedSupportAlert />', () => {
  const reasons = [
    {
      kind: 'ClusterLimitedSupportReason',
      href: '/api/clusters_mgmt/v1/limited_support_reasons/reasonId1',
      id: 'reasonId1',
      summary: 'the version of the cluster id too far behind',
      details: 'More details about the version being too far behind the supported version',
      creation_time: '2021-07-23T20:19:53.053814Z',
      detection_type: 'auto',
    },
    {
      kind: 'ClusterLimitedSupportReason',
      href: '/api/clusters_mgmt/v1/limited_support_reasons/reasonId2',
      id: 'reasonId2',
      summary: 'This is another sample reason',
      details: 'This is the detailed information about another sample reason',
      creation_time: '2021-07-23T20:19:53.053814Z',
      detection_type: 'auto',
    },
    {
      kind: 'ClusterLimitedSupportReason',
      href: '/api/clusters_mgmt/v1/limited_support_reasons/reasonId3',
      id: 'reasonId3',
      summary: 'This is another sample reason',
      details: '<a href="https://redhat.com">redhat</a>',
      creation_time: '2021-07-23T20:19:53.053814Z',
      detection_type: 'auto',
    },
  ];

  it('Limited support is not shown if no limited support warnings', () => {
    const { container } = render(<LimitedSupportAlert limitedSupportReasons={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('All limited support items are shown if multiple', async () => {
    const { user } = render(<LimitedSupportAlert limitedSupportReasons={reasons} />);

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(
      within(screen.getByRole('alert')).getByText(
        'This cluster has limited support due to multiple reasons.',
      ),
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Danger alert details' }));

    const dlGroups = screen.getAllByTestId('dl-group');
    expect(dlGroups).toHaveLength(reasons.length);

    dlGroups.forEach((dlGroup, index) => {
      expect(within(dlGroup).getByText(reasons[index].summary));
      expect(within(dlGroup).getByText(reasons[index].details));
    });
  });

  it('No link is shown if neither ROSA nor OSD', () => {
    render(<LimitedSupportAlert limitedSupportReasons={reasons} />);

    const singleActionLink = within(screen.getByRole('alert')).queryByRole('link');
    expect(singleActionLink).not.toBeInTheDocument();
  });

  it('OSD link is shown for OSD cluster', () => {
    render(<LimitedSupportAlert limitedSupportReasons={reasons} isOSD />);

    const singleActionLink = within(screen.getByRole('alert')).getByRole('link');
    expect(singleActionLink).toHaveTextContent(/Learn more/);
    expect(singleActionLink).toHaveAttribute(
      'href',
      'https://docs.openshift.com/dedicated/osd_architecture/osd_policy/osd-service-definition.html#limited-support_osd-service-definition',
    );
  });

  it('ROSA link is shown for ROSA cluster', () => {
    render(<LimitedSupportAlert limitedSupportReasons={reasons} isROSA />);

    const singleActionLink = within(screen.getByRole('alert')).getByRole('link');
    expect(singleActionLink).toHaveTextContent(/Learn more/);
    expect(singleActionLink).toHaveAttribute(
      'href',
      'https://docs.openshift.com/rosa/rosa_architecture/rosa_policy_service_definition/rosa-service-definition.html#rosa-limited-support_rosa-service-definition',
    );
  });

  it('Reasons with no summary', async () => {
    const reasonsWithNoSummary = reasons.map((reason) => {
      const { summary, ...rest } = reason;
      return rest;
    });

    const { user } = render(<LimitedSupportAlert limitedSupportReasons={reasonsWithNoSummary} />);

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(
      within(screen.getByRole('alert')).getByText(
        'This cluster has limited support due to multiple reasons.',
      ),
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Danger alert details' }));

    const dlGroups = screen.getAllByTestId('dl-group');
    expect(dlGroups).toHaveLength(reasonsWithNoSummary.length);

    dlGroups.forEach((dlGroup, index) => {
      expect(within(dlGroup).getByText(reasonsWithNoSummary[index].details));
    });
  });

  it('Reasons with no details', async () => {
    const reasonsWithNoDetails = reasons.map((reason) => {
      const { details, ...rest } = reason;
      return rest;
    });

    const { user } = render(<LimitedSupportAlert limitedSupportReasons={reasonsWithNoDetails} />);

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(
      within(screen.getByRole('alert')).getByText(
        'This cluster has limited support due to multiple reasons.',
      ),
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Danger alert details' }));

    const dlGroups = screen.getAllByTestId('dl-group');
    expect(dlGroups).toHaveLength(reasonsWithNoDetails.length);

    dlGroups.forEach((dlGroup, index) => {
      expect(within(dlGroup).getByText(reasonsWithNoDetails[index].summary));
    });
  });
});
