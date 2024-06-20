import React from 'react';

import { checkAccessibility, render, screen } from '~/testUtils';

import AccessRequestDetails from '../AccessRequestDetails';

describe('AccessRequestDetails', () => {
  it('undefined content', () => {
    render(
      <div data-testid="parent-div">
        <AccessRequestDetails />
      </div>,
    );
    expect(screen.getByTestId('parent-div').children.length).toBe(0);
  });

  it('is accessible empty content', async () => {
    // Act
    const { container } = render(<AccessRequestDetails accessRequest={{}} />);

    // Assert
    await checkAccessibility(container);
  });

  describe('is properly rendering', () => {
    it('when empty content', () => {
      // Act
      render(<AccessRequestDetails accessRequest={{}} />);

      // Assert
      expect(screen.getByText(/subscription id/i)).toBeInTheDocument();
      expect(screen.getByText(/service request id/i)).toBeInTheDocument();
      expect(screen.getByText(/created time/i)).toBeInTheDocument();
      expect(screen.getByText(/respond by/i)).toBeInTheDocument();
      expect(screen.getByText(/request duration/i)).toBeInTheDocument();
      expect(screen.getByText(/justification/i)).toBeInTheDocument();
      expect(screen.getByTestId('justification-field-value')).toBeInTheDocument();
    });
    it('when hidding justification', () => {
      // Act
      render(<AccessRequestDetails accessRequest={{}} hideJustification />);

      // Assert
      expect(screen.queryByTestId('justification-field-value')).not.toBeInTheDocument();
    });
  });
});
