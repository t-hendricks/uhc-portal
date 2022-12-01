import React from 'react';
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import '@testing-library/jest-dom';

import ExternalLink from './ExternalLink';

expect.extend(toHaveNoViolations);

describe('<ExternalLink />', () => {
  it('should render with basic options', async () => {
    const { container } = render(
      <ExternalLink href="http://example.com">Hello World</ExternalLink>,
    );
    expect(container).toMatchSnapshot();

    const results = await axe(container);
    expect(results).toHaveNoViolations();

    expect(screen.getByText('(new window or tab)')).toBeInTheDocument();
    expect(container.querySelector('svg')).toBeInTheDocument();
    expect(container.querySelector('a')).toBeInTheDocument();
  });

  it('does not display an icon if "noIcon" is enabled', () => {
    const { container } = render(
      <ExternalLink href="http://example.com" noIcon>
        Hello World
      </ExternalLink>,
    );

    expect(screen.getByText('(new window or tab)')).toBeInTheDocument();
    expect(container.querySelector('svg')).not.toBeInTheDocument();
    expect(container.querySelector('.pf-c-button')).not.toBeInTheDocument();
  });

  it('does does not set a target if "noTarget" is enabled ', () => {
    const { container } = render(
      <ExternalLink href="http://example.com" noTarget>
        Hello World
      </ExternalLink>,
    );

    expect(screen.queryByText('(new window or tab)')).not.toBeInTheDocument();
    expect(container.querySelector('svg')).toBeInTheDocument();
    expect(container.querySelector('.pf-c-button')).not.toBeInTheDocument();
  });

  it('displays as a button if "isButton" is enabled', () => {
    const { container } = render(
      <ExternalLink href="http://example.com" isButton>
        Hello World
      </ExternalLink>,
    );

    expect(screen.getByText('(new window or tab)')).toBeInTheDocument();
    expect(container.querySelector('svg')).toBeInTheDocument();
    expect(container.querySelector('.pf-c-button')).toBeInTheDocument();
  });
});
