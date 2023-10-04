import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { waitForElementToBeRemoved } from '@testing-library/react';
import '@testing-library/jest-dom';

import { render, screen, checkAccessibility, fireEvent } from '~/testUtils';
import RosaServicePageEmptyState from './RosaServicePageEmptyState';
import clusterService from '../../../services/clusterService';

jest.mock('../../../services/clusterService');
clusterService.getClusters.mockResolvedValue({
  data: { kind: 'ClusterList', page: 0, size: 0, total: 0, items: [] },
});

describe('<RosaServicePageEmptyState />', () => {
  it('contains correct links', async () => {
    const { container } = render(
      <BrowserRouter>
        <RosaServicePageEmptyState />
      </BrowserRouter>,
    );

    expect(document.querySelector('span[role="progressbar"]')).toBeVisible();
    await waitForElementToBeRemoved(document.querySelector('span[role="progressbar"]'));
    expect(screen.getByText('View prerequisites', { selector: 'a' })).toHaveAttribute(
      'href',
      '/create/rosa/getstarted',
    );

    const selfServiceButton = screen.getByText('Self-service deployment');
    fireEvent.click(selfServiceButton);
    expect(
      screen.getByText(
        'Create fully-managed OpenShift clusters in minutes with self-service deployment from the AWS Console, so you can get up and running quickly.',
      ),
    ).toBeVisible();

    const seamlessIntegrationButton = screen.getByText(
      'Seamless integration with other AWS services',
    );
    fireEvent.click(seamlessIntegrationButton);
    expect(
      screen.getByText(
        'A native AWS service accessed on demand from the AWS Management Console so you can get up and running quickly. Take advantage of seamless integration with other AWS cloud native services.',
      ),
    ).toBeVisible();

    const maximumAvailabilityButton = screen.getByText('Maximum availability');
    fireEvent.click(maximumAvailabilityButton);
    expect(
      screen.getByText(
        'Deploy clusters across multiple Availability Zones in supported regions to maximize availability.',
      ),
    ).toBeVisible();

    const deployApplicationsButton = screen.getByText('Deploy applications where they need to be');
    fireEvent.click(deployApplicationsButton);
    expect(
      screen.getByText(
        'Red Hat OpenShift Service on AWS delivers the production-ready application platform that many enterprises already use on-premises, simplifying the ability to shift workloads to the AWS public cloud as business needs dictate.',
      ),
    );

    const flexibleConsumptionButton = screen.getByText('Flexible consumption-based pricing');
    fireEvent.click(flexibleConsumptionButton);
    expect(
      screen.getByText(
        'Scale as per your business needs and pay as you go with flexible pricing with an on-demand hourly or annual billing model.',
      ),
    );

    const fullyManagedButton = screen.getByText('Fully-managed service');
    fireEvent.click(fullyManagedButton);
    expect(
      screen.getByText(
        'Focus on applications, not infrastructure, by using the fully-managed OpenShift service backed by enterprise class SLA.',
      ),
    );

    expect(
      screen.getByText('Learn more about our pricing models here.', { selector: 'a' }),
    ).toHaveAttribute('href', 'https://aws.amazon.com/rosa/pricing');

    checkAccessibility(container);
  });
});
