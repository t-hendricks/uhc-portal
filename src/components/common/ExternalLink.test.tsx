import React from 'react';
import { render, screen, fireEvent, axe } from '@testUtils';
import '@testing-library/jest-dom';
import ExternalLink from './ExternalLink';

const useAnalyticsMock = jest.fn();
jest.mock('~/hooks/useAnalytics', () => jest.fn(() => useAnalyticsMock));

describe('<ExternalLink />', () => {
  it('should render with basic options', async () => {
    const { container } = render(
      <ExternalLink href="http://example.com">Hello World</ExternalLink>,
    );
    expect(container).toMatchSnapshot();

    const results = await axe(container);
    expect(results).toHaveNoViolations();

    expect(screen.getByRole('link')).toHaveTextContent('Hello World');
    expect(container.querySelector('a[href="http://example.com"]')).toBeInTheDocument();
    expect(screen.getByText('(new window or tab)')).toBeInTheDocument();
    expect(screen.getByTestId('openInNewWindowIcon')).toBeInTheDocument();
    expect(screen.queryByTestId('externalLinkAsButton')).not.toBeInTheDocument();
  });

  it('does not display an icon if "noIcon" is enabled', () => {
    render(
      <ExternalLink href="http://example.com" noIcon>
        Hello World
      </ExternalLink>,
    );

    expect(screen.getByText('(new window or tab)')).toBeInTheDocument();
    expect(screen.queryByTestId('openInNewWindowIcon')).not.toBeInTheDocument();
  });

  it('does does not set a target if "noTarget" is enabled ', () => {
    render(
      <ExternalLink href="http://example.com" noTarget>
        Hello World
      </ExternalLink>,
    );

    expect(screen.queryByText('(new window or tab)')).not.toBeInTheDocument();
    expect(screen.getByTestId('openInNewWindowIcon')).toBeInTheDocument();
  });

  it('displays as a button if "isButton" is enabled', () => {
    const { container } = render(
      <ExternalLink href="http://example.com" isButton>
        Hello World
      </ExternalLink>,
    );

    expect(screen.getByText('(new window or tab)')).toBeInTheDocument();
    expect(screen.getByTestId('openInNewWindowIcon')).toBeInTheDocument();
    expect(screen.getByTestId('externalLinkAsButton')).toBeInTheDocument();
    // Ensure button is styled as a button, but is still a link:
    expect(screen.getByRole('link')).toHaveTextContent('Hello World');
    expect(container.querySelector('a[href="http://example.com"]')).toBeInTheDocument();
    expect(container.querySelector('button')).not.toBeInTheDocument();
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
      render(<ExternalLink href="http://example.com">Hello World</ExternalLink>);
    });
    it('is called for unknown pathname', () => {
      mockPathname.mockReturnValue('/foo');
      fireEvent.click(screen.getByRole('link'));

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
      mockPathname.mockReturnValue('/rosa');
      fireEvent.click(screen.getByRole('link'));

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
      mockPathname.mockReturnValue('/osdtrial');
      fireEvent.click(screen.getByRole('link'));

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
      mockPathname.mockReturnValue('/osd');
      fireEvent.click(screen.getByRole('link'));

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
      mockPathname.mockReturnValue('/crc');
      fireEvent.click(screen.getByRole('link'));

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
