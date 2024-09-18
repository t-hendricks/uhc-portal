import React from 'react';

import { checkAccessibility, render, screen } from '~/testUtils';

import RosaServicePage from './RosaServicePage';

describe('<RosaServicePage />', () => {
  it('is accessible', async () => {
    const { container } = render(<RosaServicePage />);
    await checkAccessibility(container);
  });

  it('has a link for "begin setup"', () => {
    render(<RosaServicePage />);

    expect(screen.getByText('Begin setup', { selector: 'a' })).toHaveAttribute(
      'href',
      '/openshift/create/rosa/getstarted',
    );
  });

  it('has a working link for "self-service deployment"', async () => {
    const { user } = render(<RosaServicePage />);

    const selfServiceButton = screen.getByText('Self-service deployment');
    await user.click(selfServiceButton);
    expect(
      screen.getByText(
        'Create fully-managed OpenShift clusters in minutes so you can get up and running quickly.',
      ),
    ).toBeVisible();
  });

  it('has a working link for "seamless integration"', async () => {
    const { user } = render(<RosaServicePage />);
    const seamlessIntegrationButton = screen.getByText(
      'Seamless integration with other AWS services',
    );
    await user.click(seamlessIntegrationButton);
    expect(
      screen.getByText(
        'A native AWS service accessed on demand from the AWS Management Console. Take advantage of seamless integration with other AWS cloud native services.',
      ),
    ).toBeVisible();
  });

  it('has a working link for "maximum availability"', async () => {
    const { user } = render(<RosaServicePage />);
    const maximumAvailabilityButton = screen.getByText('Maximum availability');
    await user.click(maximumAvailabilityButton);
    expect(
      screen.getByText(
        'Deploy clusters across multiple Availability Zones in supported regions to maximize availability.',
      ),
    ).toBeVisible();
  });

  it('has a working link for "deploying applications"', async () => {
    const { user } = render(<RosaServicePage />);

    const deployApplicationsButton = screen.getByText('Deploy applications where they need to be');
    await user.click(deployApplicationsButton);
    expect(
      screen.getByText(
        'Red Hat OpenShift Service on AWS delivers the production-ready application platform that many enterprises already use on-premises, simplifying the ability to shift workloads to the AWS public cloud as business needs dictate.',
      ),
    );

    const flexibleConsumptionButton = screen.getByText('Flexible consumption-based pricing');
    await user.click(flexibleConsumptionButton);
    expect(
      screen.getByText(
        'Scale as per your business needs and pay as you go with flexible pricing with an on-demand hourly or annual billing model.',
      ),
    );

    const fullyManagedButton = screen.getByText('Fully-managed service');
    await user.click(fullyManagedButton);
    expect(
      screen.getByText(
        'Fully-managed OpenShift service, backed by a global Site Reliability Engineering (SRE) team and an enterprise class SLA, enabling customers to focus on applications, not managing infrastructure.',
      ),
    );

    expect(screen.getByText('Learn more about pricing', { selector: 'a' })).toHaveAttribute(
      'href',
      'https://aws.amazon.com/rosa/pricing',
    );
  });

  it('has a working link for "flexible consumption"', async () => {
    const { user } = render(<RosaServicePage />);

    const flexibleConsumptionButton = screen.getByText('Flexible consumption-based pricing');
    await user.click(flexibleConsumptionButton);
    expect(
      screen.getByText(
        'Scale as per your business needs and pay as you go with flexible pricing with an on-demand hourly or annual billing model.',
      ),
    );
  });

  it('has a working link for "fully-managed service"', async () => {
    const { user } = render(<RosaServicePage />);

    const fullyManagedButton = screen.getByText('Fully-managed service');
    await user.click(fullyManagedButton);
    expect(
      screen.getByText(
        'Fully-managed OpenShift service, backed by a global Site Reliability Engineering (SRE) team and an enterprise class SLA, enabling customers to focus on applications, not managing infrastructure.',
      ),
    );

    expect(screen.getByText('Learn more about pricing', { selector: 'a' })).toHaveAttribute(
      'href',
      'https://aws.amazon.com/rosa/pricing',
    );
  });
});
