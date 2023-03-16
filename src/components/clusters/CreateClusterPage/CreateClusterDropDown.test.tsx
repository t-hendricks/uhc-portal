import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { axe, toHaveNoViolations } from 'jest-axe';
import CreateClusterDropDown from './CreateClusterDropDown';

expect.extend(toHaveNoViolations);

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
