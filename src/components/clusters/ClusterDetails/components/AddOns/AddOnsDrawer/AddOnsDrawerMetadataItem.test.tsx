import React from 'react';
import { render, screen, checkAccessibility, within } from '@testUtils';
import AddOnsMetaDataItem from './AddOnsDrawerMetadataItem';

const defaultProps = {
  activeCardDocsLink: 'https://example.com/veryfakedocs',
  installedAddOnOperatorVersion: 'v0.0.1',
  addonID: 'ocm-addon-test-operator',
  clusterID: '26gncsk7r4gunlutodqqdvfcfe9a44e9',
  externalClusterID: 'b659908a-b00e-4e21-93de-34b9eb61751e',
  subscriptionPlanID: 'OSD',
};

describe('<AddOnsMetaDataItem />', () => {
  it('presents accessible content', async () => {
    const { container } = render(<AddOnsMetaDataItem {...defaultProps} />);

    await checkAccessibility(container);
  });

  it('shows both operator version and doc link', () => {
    render(<AddOnsMetaDataItem {...defaultProps} />);

    expect(screen.getByRole('link')).toBeInTheDocument();
    expect(within(screen.getByRole('link')).getByText(/View Documentation/)).toBeInTheDocument();
    expect(screen.getByRole('link').getAttribute('href')).toEqual(defaultProps.activeCardDocsLink);
    expect(screen.getByText('Current Version')).toBeInTheDocument();
    expect(screen.getByText('v0.0.1')).toBeInTheDocument();
  });

  it('shows only doc link when operator version is not present', () => {
    const { installedAddOnOperatorVersion, ...props } = defaultProps;
    render(<AddOnsMetaDataItem {...props} />);

    expect(screen.queryByText('v0.0.1')).not.toBeInTheDocument();
    expect(screen.getByRole('link')).toBeInTheDocument();
  });

  it('shows only operation version when no doc link is provided', () => {
    const { activeCardDocsLink, ...props } = defaultProps;
    render(<AddOnsMetaDataItem {...props} />);

    expect(screen.getByText('v0.0.1')).toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('shows nothing if no link or operation version are provided', () => {
    const { activeCardDocsLink, installedAddOnOperatorVersion, ...props } = defaultProps;
    render(<AddOnsMetaDataItem {...props} />);

    expect(screen.queryByText('v0.0.1')).not.toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });
});
