import React from 'react';
import { render, screen, checkAccessibility } from '~/testUtils';
import { CompatRouter } from 'react-router-dom-v5-compat';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import Overview from './Overview';

describe('<Overview />', () => {
  it('contains correct links', async () => {
    const { container } = render(
      <BrowserRouter>
        <CompatRouter>
          <Overview />
        </CompatRouter>
      </BrowserRouter>,
    );

    expect(
      screen.getByText('View all OpenShift cluster types', {
        selector: 'a',
      }),
    ).toHaveAttribute('href', '/create');

    expect(
      screen.getByText('Browse all OpenShift learning resources', { selector: 'a' }),
    ).toHaveAttribute('href', '/openshift/learning-resources');

    await checkAccessibility(container);
  });
});
