import React from 'react';
import { render, screen, checkAccessibility } from '~/testUtils';
import * as PreviewLabelFile from '~/components/clusters/common/PreviewLabel';
import ClusterTypeLabel from './ClusterTypeLabel';
import fixtures from '../ClusterDetails/__tests__/ClusterDetails.fixtures';

describe('ClusterTypeLabel', () => {
  jest.spyOn(PreviewLabelFile, 'PreviewLabel').mockImplementation(() => <span>PREVIEW LABEL</span>);

  it('shows preview label for ROSA hypershift', async () => {
    const { cluster } = fixtures.ROSAHypershiftClusterDetails;

    const { container } = render(<ClusterTypeLabel cluster={cluster} />);
    expect(screen.getByText('PREVIEW LABEL')).toBeInTheDocument();
    await checkAccessibility(container);
  });

  it('does not show preview label for classic ROSA', () => {
    const { cluster } = fixtures.ROSAClusterDetails;
    render(<ClusterTypeLabel cluster={cluster} />);

    expect(screen.queryByText('PREVIEW LABEL')).not.toBeInTheDocument();
  });
});
