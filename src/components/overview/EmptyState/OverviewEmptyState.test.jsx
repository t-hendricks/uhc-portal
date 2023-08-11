import React from 'react';
import { render, screen, checkAccessibility } from '@testUtils';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import OverviewEmptyState from './OverviewEmptyState';
import docLinks from '../../../common/installLinks.mjs';

describe('<OverviewEmptyState />', () => {
  it('contains correct links', async () => {
    const { container } = render(
      <BrowserRouter>
        <OverviewEmptyState />
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
