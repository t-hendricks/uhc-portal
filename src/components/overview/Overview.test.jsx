import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import { render, screen, checkAccessibility } from '~/testUtils';
import Overview from './Overview';
// import docLinks from '../../common/installLinks.mjs';

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

    checkAccessibility(container);
  });
});
