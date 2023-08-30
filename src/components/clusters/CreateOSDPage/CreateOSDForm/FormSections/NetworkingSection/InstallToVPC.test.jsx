import wizardConnector from '~/components/clusters/CreateOSDPage/CreateOSDWizard/WizardConnector';
import { render, screen } from '~/testUtils';
import React from 'react';
import InstallToVPC from '~/components/clusters/CreateOSDPage/CreateOSDForm/FormSections/NetworkingSection/InstallToVPC';
import links from '~/common/installLinks.mjs';

const defaultProps = {
  selectedRegion: 'us-east-1',
  isMultiAz: false,
  privateLinkSelected: false,
  cloudProviderID: 'aws',
  isSharedVpcSelected: false,
  hostedZoneDomainName: 'cluster-name.base-domain-name.devshift.org',
};

describe('<InstallToVPC> (AWS)', () => {
  it('should have a Shared VPC section', () => {
    const ConnectedReviewClusterScreen = wizardConnector(InstallToVPC);
    render(<ConnectedReviewClusterScreen {...defaultProps} />);

    expect(screen.getByText('AWS shared VPC')).toBeInTheDocument();
  });

  it('should show a link to AWS VPC requirements', () => {
    const ConnectedReviewClusterScreen = wizardConnector(InstallToVPC);
    render(<ConnectedReviewClusterScreen {...defaultProps} />);

    expect(screen.getByRole('link', { name: /Learn more about VPC/ })).toHaveAttribute(
      'href',
      links.INSTALL_AWS_CUSTOM_VPC_REQUIREMENTS,
    );
  });
});

describe('<InstallToVPC> (GCP)', () => {
  it('should not have a Shared VPC section', () => {
    const ConnectedReviewClusterScreen = wizardConnector(InstallToVPC);
    const newProps = { ...defaultProps, cloudProviderID: 'gcp' };
    render(<ConnectedReviewClusterScreen {...newProps} />);

    expect(screen.queryByText('AWS shared VPC')).not.toBeInTheDocument();
  });
});
