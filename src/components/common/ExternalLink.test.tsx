import React from 'react';
import { render, screen, fireEvent, axe, within } from '@testUtils';
import '@testing-library/jest-dom';
import ExternalLink from './ExternalLink';

const useAnalyticsMock = jest.fn();
jest.mock('~/hooks/useAnalytics', () => jest.fn(() => useAnalyticsMock));

describe('<ExternalLink />', () => {
  it('is accessible as a link', async () => {
    // Arrange
    const { container } = render(
      <ExternalLink href="http://example.com">Hello World</ExternalLink>,
    );

    // Assert
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('is accessible as a button', async () => {
    // Arrange
    const { container } = render(
      <ExternalLink href="http://example.com" isButton>
        Hello World
      </ExternalLink>,
    );

    // Assert
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('shows as a secondary button but is still a link', () => {
    // Arrange
    render(
      <ExternalLink href="http://example.com" isButton>
        Hello World
      </ExternalLink>,
    );

    // Assert
    expect(screen.getByRole('link')).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(screen.getByRole('link').getAttribute('class')).toMatch(/pf-c-button/);
    expect(screen.getByRole('link').getAttribute('class')).toMatch(/secondary/);
  });

  it('shows as a primary button when variant is set', () => {
    // Arrange
    render(
      <ExternalLink href="http://example.com" isButton variant="primary">
        Hello World
      </ExternalLink>,
    );

    // Assert
    expect(screen.getByRole('link')).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(screen.getByRole('link').getAttribute('class')).toMatch(/pf-c-button/);
    expect(screen.getByRole('link').getAttribute('class')).toMatch(/primary/);
  });

  it('shows children  and href is set as link', () => {
    // Arrange
    render(
      <ExternalLink href="http://example.com" className="myClassName">
        Hello World
      </ExternalLink>,
    );

    // Assert
    expect(within(screen.getByRole('link')).getByText(/Hello World/)).toBeInTheDocument();
    expect(screen.getByRole('link').getAttribute('href')).toEqual('http://example.com');
    expect(screen.getByRole('link').getAttribute('class')).toMatch(/myClassName/);
  });

  it('shows children and href is set as button', () => {
    // Arrange
    render(
      <ExternalLink href="http://example.com" isButton className="myClassName">
        Hello World
      </ExternalLink>,
    );

    // Assert
    expect(within(screen.getByRole('link')).getByText(/Hello World/)).toBeInTheDocument();
    expect(screen.getByRole('link').getAttribute('href')).toEqual('http://example.com');
    expect(screen.getByRole('link').getAttribute('class')).toMatch(/myClassName/);
  });

  it('shows (new window or tab) to screenreaders if link', () => {
    // Arrange
    render(<ExternalLink href="http://example.com">Hello World</ExternalLink>);

    // Assert
    expect(screen.getByText(/\(new window or tab\)/)).toBeInTheDocument();
    expect(screen.getByRole('link').getAttribute('target')).toEqual('_blank');
  });

  it('shows (new window or tab) to screenreaders if button', () => {
    // Arrange
    render(
      <ExternalLink href="http://example.com" isButton>
        Hello World
      </ExternalLink>,
    );

    // Assert
    expect(screen.getByText(/\(new window or tab\)/)).toBeInTheDocument();
    expect(screen.getByRole('link').getAttribute('target')).toEqual('_blank');
  });

  it('hides (new window or tab) if noTarget is set and is link', () => {
    // Arrange
    render(
      <ExternalLink href="http://example.com" noTarget>
        Hello World
      </ExternalLink>,
    );

    // Assert
    expect(screen.queryByText(/\(new window or tab\)/)).not.toBeInTheDocument();
    expect(screen.getByRole('link').getAttribute('target')).toEqual('');
  });

  it('hides (new window or tab) if noTarget is set and is button', () => {
    // Arrange
    render(
      <ExternalLink href="http://example.com" noTarget isButton>
        Hello World
      </ExternalLink>,
    );

    // Assert
    expect(screen.queryByText(/\(new window or tab\)/)).not.toBeInTheDocument();
    expect(screen.getByRole('link').getAttribute('target')).toEqual('');
  });

  it('shows new window icon if link', () => {
    // Arrange
    render(<ExternalLink href="http://example.com">Hello World</ExternalLink>);

    // Assert
    // PF doesn't have a unique role or text to identify the icon
    expect(screen.getByTestId('openInNewWindowIcon')).toBeInTheDocument();
  });

  it('shows new window icon if button', () => {
    // Arrange
    render(
      <ExternalLink href="http://example.com" isButton>
        Hello World
      </ExternalLink>,
    );

    // Assert
    // PF doesn't have a unique role or text to identify the icon
    expect(screen.getByTestId('openInNewWindowIcon')).toBeInTheDocument();
  });

  it('hides new window icon if link', () => {
    // Arrange
    render(
      <ExternalLink href="http://example.com" noIcon>
        Hello World
      </ExternalLink>,
    );

    // Assert
    // PF doesn't have a unique role or text to identify the icon
    expect(screen.queryByTestId('openInNewWindowIcon')).not.toBeInTheDocument();
  });

  it('hides new window icon if button', () => {
    // Arrange
    render(
      <ExternalLink href="http://example.com" noIcon isButton>
        Hello World
      </ExternalLink>,
    );

    // Assert
    // PF doesn't have a unique role or text to identify the icon
    expect(screen.queryByTestId('openInNewWindowIcon')).not.toBeInTheDocument();
  });

  describe('useAnalytics', () => {
    const mockPathname = jest.fn();
    Object.defineProperty(window, 'location', {
      value: {
        get pathname() {
          return mockPathname();
        },
      },
    });
    beforeEach(() => {
      useAnalyticsMock.mockClear();
      mockPathname.mockClear();
    });

    it('is called for unknown pathname', () => {
      // Arrange
      mockPathname.mockReturnValue('/foo');
      render(<ExternalLink href="http://example.com">Hello World</ExternalLink>);

      // Act
      fireEvent.click(screen.getByRole('link'));

      // Assert
      expect(useAnalyticsMock).toHaveBeenCalled();
      expect(useAnalyticsMock).toHaveBeenCalledWith(
        { event: 'Link Clicked', link_name: 'external-link' },
        {
          customProperties: {
            link_url: 'http://example.com',
            module: 'openshift',
            ocm_resource_type: 'all',
          },
        },
      );
    });

    it('is called for rosa pathname', () => {
      // Arrange
      mockPathname.mockReturnValue('/rosa');
      render(<ExternalLink href="http://example.com">Hello World</ExternalLink>);

      // Act
      fireEvent.click(screen.getByRole('link'));

      // Arrange
      expect(useAnalyticsMock).toHaveBeenCalled();
      expect(useAnalyticsMock).toHaveBeenCalledWith(
        { event: 'Link Clicked', link_name: 'external-link' },
        {
          customProperties: {
            link_url: 'http://example.com',
            module: 'openshift',
            ocm_resource_type: 'moa',
          },
        },
      );
    });

    it('is called for osd trial pathname', () => {
      // Arrange
      mockPathname.mockReturnValue('/osdtrial');
      render(<ExternalLink href="http://example.com">Hello World</ExternalLink>);

      // Act
      fireEvent.click(screen.getByRole('link'));

      // Assert
      expect(useAnalyticsMock).toHaveBeenCalled();
      expect(useAnalyticsMock).toHaveBeenCalledWith(
        { event: 'Link Clicked', link_name: 'external-link' },
        {
          customProperties: {
            link_url: 'http://example.com',
            module: 'openshift',
            ocm_resource_type: 'osdtrial',
          },
        },
      );
    });

    it('is called for osd pathname', () => {
      // Arrange
      mockPathname.mockReturnValue('/osd');
      render(<ExternalLink href="http://example.com">Hello World</ExternalLink>);

      // Act
      fireEvent.click(screen.getByRole('link'));

      // Assert
      expect(useAnalyticsMock).toHaveBeenCalled();
      expect(useAnalyticsMock).toHaveBeenCalledWith(
        { event: 'Link Clicked', link_name: 'external-link' },
        {
          customProperties: {
            link_url: 'http://example.com',
            module: 'openshift',
            ocm_resource_type: 'osd',
          },
        },
      );
    });

    it('is called for crc pathname', () => {
      // Arrange
      mockPathname.mockReturnValue('/crc');
      render(<ExternalLink href="http://example.com">Hello World</ExternalLink>);

      // Act
      fireEvent.click(screen.getByRole('link'));

      // Assert
      expect(useAnalyticsMock).toHaveBeenCalled();
      expect(useAnalyticsMock).toHaveBeenCalledWith(
        { event: 'Link Clicked', link_name: 'external-link' },
        {
          customProperties: {
            link_url: 'http://example.com',
            module: 'openshift',
            ocm_resource_type: 'crc',
          },
        },
      );
    });
  });
});
