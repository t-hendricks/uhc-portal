import React from 'react';
import { render, screen, checkAccessibility } from '~/testUtils';

import { PreviewLabel, GA_DATE, createdPostGa } from '~/components/clusters/common/PreviewLabel';

describe('PreviewLabel', () => {
  it('shows preview label when pre GA date', async () => {
    const gadate = new Date(GA_DATE);
    gadate.setSeconds(GA_DATE.getSeconds() - 1);
    expect(createdPostGa(gadate.toISOString())).toBe(false);
    const { container } = render(<PreviewLabel creationDateStr={gadate.toISOString()} />);

    expect(container.querySelector('.pf-c-label')).toBeInTheDocument();
    expect(screen.getByText('Preview')).toBeInTheDocument();
    await checkAccessibility(container);
  });

  it('does not display preview label on GA date', () => {
    const gadate = new Date(GA_DATE);
    expect(createdPostGa(gadate.toISOString())).toBe(true);

    const { container } = render(<PreviewLabel creationDateStr={gadate.toISOString()} />);

    expect(container.querySelector('.pf-c-label')).not.toBeInTheDocument();
    expect(screen.queryByText('Preview')).not.toBeInTheDocument();
  });

  it('does not display preview label after GA date', () => {
    const gadate = new Date(GA_DATE);
    gadate.setSeconds(GA_DATE.getSeconds() + 1);
    expect(createdPostGa(gadate.toISOString())).toBe(true);

    const { container } = render(<PreviewLabel creationDateStr={gadate.toISOString()} />);

    expect(container.querySelector('.pf-c-label')).not.toBeInTheDocument();
    expect(screen.queryByText('Preview')).not.toBeInTheDocument();
  });
});
