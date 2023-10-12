import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import { render, screen, checkAccessibility } from '~/testUtils';
import Overview from './Overview';
import docLinks from '../../common/installLinks.mjs';

describe('<OverviewEmptyState />', () => {
  it('contains correct links', async () => {
    const { container } = render(
      <BrowserRouter>
        <Overview />
      </BrowserRouter>,
    );

    expect(screen.getByText('Create cluster', { selector: 'a' })).toHaveAttribute(
      'href',
      '/create',
    );

    expect(screen.getByText('Register a cluster', { selector: 'a' })).toHaveAttribute(
      'href',
      '/register',
    );

    expect(screen.getByText('Learn more about OpenShift', { selector: 'a' })).toHaveAttribute(
      'href',
      docLinks.WHAT_IS_OPENSHIFT,
    );

    expect(screen.getByText('Browse all OpenShift offerings', { selector: 'a' })).toHaveAttribute(
      'href',
      '/create',
    );

    expect(
      screen.getByText('See all OpenShift learning resources', { selector: 'a' }),
    ).toHaveAttribute('href', '/openshift/learning-resources');

    checkAccessibility(container);
  });
});
