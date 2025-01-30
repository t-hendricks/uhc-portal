import React from 'react';

import { checkAccessibility, render, screen } from '~/testUtils';
import { ClusterStatus } from '~/types/clusters_mgmt.v1';

import ClusterStatusErrorDisplay from './ClusterStatusErrorDisplay';

const baseStatus: ClusterStatus = {
  provision_error_code: 'OCM3055',
  provision_error_message: 'this is some error message',
  description: 'this is some description',
};

const defaultProps = {
  clusterStatus: { ...baseStatus },
};

describe('<ClusterStatusErrorDisplay />', () => {
  it('is accessible', async () => {
    const { container } = render(<ClusterStatusErrorDisplay {...defaultProps} />);
    await checkAccessibility(container);
  });

  it('displays provision error message', () => {
    render(<ClusterStatusErrorDisplay {...defaultProps} />);
    expect(screen.getByText('this is some error message')).toBeInTheDocument();
  });

  describe('error code', () => {
    it('is not displayed by default', () => {
      render(<ClusterStatusErrorDisplay {...defaultProps} />);
      expect(screen.queryByText(/OCM3055/)).not.toBeInTheDocument();
    });

    it('is displayed when showErrorCode is ON', () => {
      render(<ClusterStatusErrorDisplay {...defaultProps} showErrorCode />);
      expect(screen.getByText(/OCM3055/)).toBeInTheDocument();
    });

    it('is displayed when showErrorCode is ON, and is inlined with the error message', () => {
      render(<ClusterStatusErrorDisplay {...defaultProps} showErrorCode />);
      expect(screen.getByText('OCM3055 this is some error message')).toBeInTheDocument();
    });
  });

  describe('description', () => {
    it('is not displayed by default', () => {
      render(<ClusterStatusErrorDisplay {...defaultProps} />);
      expect(screen.queryByText(/this is some description/)).not.toBeInTheDocument();
    });

    it('is displayed when showDescription is ON', () => {
      render(<ClusterStatusErrorDisplay {...defaultProps} showDescription />);
      expect(screen.getByText(/this is some description/)).toBeInTheDocument();
    });
  });

  describe('URLs embedded in text', () => {
    const errorMessage = "that's a bummer :/  visit http://example.com to learn more.";
    const errorDescription =
      "i mean, i really don't know what else to tell you, besides that you should probably go visit http://example.com, which really has all the tea - no cap.";
    const errorMessageProps = {
      ...defaultProps,
      clusterStatus: {
        ...baseStatus,
        provision_error_message: errorMessage,
      },
    };
    const descriptionProps = {
      ...defaultProps,
      clusterStatus: {
        ...baseStatus,
        description: errorDescription,
      },
      showDescription: true,
    };

    it('are rendered accessibly', () => {
      render(<ClusterStatusErrorDisplay {...errorMessageProps} />);
      expect(screen.getByText(/that's a bummer.*/)).toBeInTheDocument();
      expect(screen.getByText('http://example.com')).toHaveRole('link');
    });

    describe('are rendered as links', () => {
      it('within provision error message', () => {
        render(<ClusterStatusErrorDisplay {...errorMessageProps} />);
        expect(screen.getByText(/that's a bummer.*/)).toBeInTheDocument();
        expect(screen.getByText('http://example.com')).toHaveAttribute('href');
      });

      it('within description', () => {
        render(<ClusterStatusErrorDisplay {...descriptionProps} />);
        expect(screen.getByText(/i mean, i really.*/)).toBeInTheDocument();
        expect(screen.getByText('http://example.com')).toHaveAttribute('href');
      });
    });
  });
});
