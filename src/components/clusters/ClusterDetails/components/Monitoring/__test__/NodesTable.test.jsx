import React from 'react';
import { render, checkAccessibility } from '~/testUtils';
import NodesTable from '../components/NodesTable';

describe('<NodesTable />', () => {
  it('is accessible', async () => {
    const { container } = render(<NodesTable />);
    await checkAccessibility(container);
  });
});
