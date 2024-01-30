import React from 'react';
import { render, screen } from '~/testUtils';
import ClustersWithIssuesCard from '../ClustersWithIssuesCard';

describe('<ClustersWithIssuesCard />', () => {
  it('isError true', () => {
    // Act
    render(
      <ClustersWithIssuesCard totalConnectedClusters={1} totalUnhealthyClusters={0} isError />,
    );

    // Assert
    expect(screen.getByTestId('cluster-with-issues-error')).toBeInTheDocument();
    expect(screen.queryByTestId('cluster-with-issues-unhealthy')).not.toBeInTheDocument();
  });

  describe('isError false', () => {
    it('properly renders without totalConnectedClusters', () => {
      // Act
      render(
        <ClustersWithIssuesCard
          totalConnectedClusters={0}
          totalUnhealthyClusters={0}
          isError={false}
        />,
      );

      // Assert
      expect(screen.getByTestId('cluster-with-issues-no-data')).toBeInTheDocument();
      expect(screen.queryByTestId('cluster-with-issues-error')).not.toBeInTheDocument();
      expect(screen.queryByTestId('cluster-with-issues-unhealthy')).not.toBeInTheDocument();
    });

    describe('properly renders with totalConnectedClusters', () => {
      it('0 totalUnhealthyClusters', () => {
        // Act
        render(
          <ClustersWithIssuesCard
            totalConnectedClusters={1}
            totalUnhealthyClusters={0}
            isError={false}
          />,
        );

        // Assert
        expect(screen.getByTestId('cluster-with-issues-unhealthy')).toBeInTheDocument();
        expect(screen.getByTestId('ok-icon')).toBeInTheDocument();

        const span = screen.getByTestId('cluster-with-issues-unhealthy').querySelector('span');
        expect(span?.textContent).toEqual('0');
        expect(span).toHaveClass('clusters-with-issues-zero');
      });

      it('>0 totalUnhealthyClusters', () => {
        // Act
        render(
          <ClustersWithIssuesCard
            totalConnectedClusters={1}
            totalUnhealthyClusters={1}
            isError={false}
          />,
        );

        // Assert
        expect(screen.getByTestId('cluster-with-issues-unhealthy')).toBeInTheDocument();
        expect(screen.getByTestId('exclamation-icon')).toBeInTheDocument();

        const span = screen.getByTestId('cluster-with-issues-unhealthy').querySelector('span');
        expect(span?.textContent).toEqual('1');
        expect(span).toHaveClass('clusters-with-issues-non-zero');
      });
    });
  });
});
