import wizardConnector from '~/components/clusters/wizards/common/WizardConnector';
import { render, screen } from '~/testUtils';
import React from 'react';
import InstallToVPC from '~/components/clusters/wizards/rosa_v1/VPCScreen/InstallToVPC';
import links from '~/common/installLinks.mjs';
import { useGlobalState } from '~/redux/hooks';

const defaultProps = {
  selectedRegion: 'us-east-1',
  isMultiAz: false,
  privateLinkSelected: false,
  cloudProviderID: 'aws',
  isSharedVpcSelected: false,
  hostedZoneDomainName: 'cluster-name.base-domain-name.devshift.org',
  selectedVPC: { id: '', name: '' },
  selectedAZs: [],
};

jest.mock('~/redux/hooks', () => ({
  useGlobalState: jest.fn(),
}));

describe('<InstallToVPC> (AWS)', () => {
  beforeEach(() => {
    useGlobalState.mockReturnValue({
      applyControlPlaneToAll: false,
      controlPlane: [],
      infra: [],
      worker: [],
    });
  });

  it.each([[false], [true]])('should have a Shared VPC section', (isHypershift) => {
    const ConnectedInstallToVPC = wizardConnector(InstallToVPC);
    render(<ConnectedInstallToVPC {...defaultProps} isHypershiftSelected={isHypershift} />);

    expect(screen.getByText('AWS shared VPC')).toBeInTheDocument();
  });

  it.each([[false], [true]])('should show a link to AWS VPC requirements', (isHypershift) => {
    const ConnectedInstallToVPC = wizardConnector(InstallToVPC);
    render(<ConnectedInstallToVPC {...defaultProps} isHypershiftSelected={isHypershift} />);

    expect(screen.getByRole('link', { name: /Learn more about VPC/ })).toHaveAttribute(
      'href',
      links.INSTALL_AWS_CUSTOM_VPC_REQUIREMENTS,
    );
  });
});
