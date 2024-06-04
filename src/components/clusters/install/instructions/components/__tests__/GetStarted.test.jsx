import React from 'react';

import { checkAccessibility, render, screen, within } from '~/testUtils';

import GetStarted from '../GetStarted';

const defaultProps = {
  docURL: '',
  cloudProviderID: '',
};

describe('<GetStarted />', () => {
  describe('GetStarted w/ customizations', () => {
    const customizationsProps = {
      ...defaultProps,
      customizations: 'example.doc.link',
    };

    it('is accessible', async () => {
      const { container } = render(<GetStarted {...customizationsProps} />);
      await checkAccessibility(container);
    });

    it('should have a Get Started link', () => {
      render(<GetStarted {...customizationsProps} />);
      expect(screen.getByRole('link', { name: 'Get started' })).toBeInTheDocument();
    });

    it('should have a copybox', () => {
      render(<GetStarted {...customizationsProps} />);

      const copyBox = screen.getByTestId('copy-command');
      expect(copyBox).toBeInTheDocument();
      expect(within(copyBox).getByRole('textbox')).toHaveAttribute('readonly');
    });

    it('should have a customizations link', () => {
      render(<GetStarted {...customizationsProps} />);

      expect(screen.getByRole('link', { name: /install with customizations/ })).toHaveAttribute(
        'href',
        customizationsProps.customizations,
      );
    });
  });

  describe('GetStarted w/o customizations', () => {
    it('is accessible', async () => {
      const { container } = render(<GetStarted {...defaultProps} />);
      await checkAccessibility(container);
    });

    it('should have a Get Started link', () => {
      render(<GetStarted {...defaultProps} />);
      expect(screen.getByRole('link', { name: 'Get started' })).toBeInTheDocument();
    });

    it('should have a copybox', () => {
      render(<GetStarted {...defaultProps} />);

      const copyBox = screen.getByTestId('copy-command');
      expect(copyBox).toBeInTheDocument();
      expect(within(copyBox).getByRole('textbox')).toHaveAttribute('readonly');
    });

    it('should not have a customizations link', () => {
      expect(
        screen.queryByRole('link', { name: /install with customizations/ }),
      ).not.toBeInTheDocument();
    });
  });

  describe('GetStarted for UPI', () => {
    const upiProps = {
      ...defaultProps,
      isUPI: true,
    };

    it('is accessible', async () => {
      const { container } = render(<GetStarted {...upiProps} />);
      await checkAccessibility(container);
    });

    it('should have a Get Started button', () => {
      render(<GetStarted {...upiProps} />);
      expect(screen.getByRole('link', { name: 'Get started' })).toBeInTheDocument();
    });

    it('should not have a copybox', () => {
      render(<GetStarted {...upiProps} />);
      const copyBox = screen.queryByTestId('copy-command');
      expect(copyBox).not.toBeInTheDocument();
    });
  });
});
