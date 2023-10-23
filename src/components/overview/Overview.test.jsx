import React from 'react';
import { render, screen, checkAccessibility } from '~/testUtils';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import Overview from './Overview';

describe('<Overview />', () => {
  it('contains correct links', async () => {
    const { container } = render(
      <BrowserRouter>
        <Overview />
      </BrowserRouter>,
    );

    expect(
      screen.getByText('View all OpenShift cluster types and start creating', { selector: 'a' }),
    ).toHaveAttribute('href', '/create');

    expect(
      screen.getByText('Browse all OpenShift learning resources', { selector: 'a' }),
    ).toHaveAttribute('href', '/openshift/learning-resources');

    await checkAccessibility(container);
  });
});
