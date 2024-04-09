import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { CompatRouter } from 'react-router-dom-v5-compat';

import { checkAccessibility, render, screen } from '~/testUtils';

import Overview from './Overview';

import '@testing-library/jest-dom';

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
