import React from 'react';

import { checkAccessibility, render, screen, within } from '~/testUtils';
import { Decision } from '~/types/access_transparency.v1';

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

    it('when single decision', () => {
      // Act
      render(
        <AccessRequestDetails
          accessRequest={{
            decisions: [
              {
                decision: Decision.decision.APPROVED,
                created_at: '2022-06-23T00:04:46.521394Z',
                decided_by: 'whatever the user',
                justification: 'whatever',
              },
            ],
          }}
        />,
      );

      // Assert
      expect(screen.getByText(/subscription id/i)).toBeInTheDocument();
      expect(screen.getByText(/service request id/i)).toBeInTheDocument();
      expect(screen.getByText(/created time/i)).toBeInTheDocument();
      expect(screen.getByText(/respond by/i)).toBeInTheDocument();
      expect(screen.getByText(/request duration/i)).toBeInTheDocument();
      expect(screen.getByText(/justification/i)).toBeInTheDocument();
      expect(screen.getByTestId('justification-field-value')).toBeInTheDocument();
      expect(screen.getByTestId('decision-text')).toBeInTheDocument();
      expect(
        within(screen.getByTestId('decision-text')).getByText(/approved/i),
      ).toBeInTheDocument();
      expect(
        within(screen.getByTestId('decision-text')).getByText(/6\/22\/2022/i),
      ).toBeInTheDocument();
      expect(
        within(screen.getByTestId('decision-text')).getByText(/whatever the user/i),
      ).toBeInTheDocument();
    });

    it('when multiple decisions', () => {
      // Act
      render(
        <AccessRequestDetails
          accessRequest={{
            decisions: [
              {
                decision: Decision.decision.APPROVED,
                created_at: '2022-06-23T00:04:46.521394Z',
                decided_by: 'whatever the user',
                justification: 'whatever',
              },
              {
                decision: Decision.decision.DENIED,
                created_at: '2021-02-03T00:04:46.521394Z',
                decided_by: 'user1',
                justification: 'just1',
              },
            ],
          }}
        />,
      );

      // Assert
      expect(screen.getByText(/subscription id/i)).toBeInTheDocument();
      expect(screen.getByText(/service request id/i)).toBeInTheDocument();
      expect(screen.getByText(/created time/i)).toBeInTheDocument();
      expect(screen.getByText(/respond by/i)).toBeInTheDocument();
      expect(screen.getByText(/request duration/i)).toBeInTheDocument();
      expect(screen.getByText(/justification/i)).toBeInTheDocument();
      expect(screen.getByTestId('justification-field-value')).toBeInTheDocument();
      expect(screen.getByTestId('decision-text')).toBeInTheDocument();
      expect(within(screen.getByTestId('decision-text')).getByText(/denied/i)).toBeInTheDocument();
      expect(
        within(screen.getByTestId('decision-text')).getByText(/2\/2\/2021/i),
      ).toBeInTheDocument();
      expect(within(screen.getByTestId('decision-text')).getByText(/user1/i)).toBeInTheDocument();
    });
  });
});
