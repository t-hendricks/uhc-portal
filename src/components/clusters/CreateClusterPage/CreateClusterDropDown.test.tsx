import React from 'react';
import { render, axe } from '@testUtils';
import { MemoryRouter } from 'react-router-dom';
import CreateClusterDropDown from './CreateClusterDropDown';

describe('CreateClusterDropDown', () => {
  it('is accessible', async () => {
    const { container } = render(
      <MemoryRouter>
        <CreateClusterDropDown />
      </MemoryRouter>,
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('matches snapshot', () => {
    const { container } = render(
      <MemoryRouter>
        <CreateClusterDropDown />
      </MemoryRouter>,
    );
    expect(container).toMatchSnapshot();
  });
});
