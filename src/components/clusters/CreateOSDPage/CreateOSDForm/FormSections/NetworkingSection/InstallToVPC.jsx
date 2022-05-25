import React from 'react';
import PropTypes from 'prop-types';
import {
  Title,
  GridItem,
  Alert,
} from '@patternfly/react-core';
import { Field } from 'redux-form';

import links from '../../../../../../common/installLinks.mjs';
import SubnetFields from './SubnetFields';
import AWSSubnetFields from '../../../CreateOSDWizard/VPCScreen/AWSSubnetFields';
import PopoverHint from '../../../../../common/PopoverHint';
import ExternalLink from '../../../../../common/ExternalLink';
import GCPNetworkConfigSection from './GCPNetworkConfigSection';
import ReduxCheckbox from '../../../../../common/ReduxFormComponents/ReduxCheckbox';
import { constants } from '../../CreateOSDFormConstants';

function InstallToVPC({
  selectedRegion, isMultiAz, selected, privateLinkSelected, cloudProviderID, isWizard,
}) {
  return (
    <>
      {
          selected && cloudProviderID === 'aws' && (
            <>
              <GridItem>
                <Title headingLevel="h4" size="md">
                  Existing VPC
                  <PopoverHint
                    iconClassName="pf-u-ml-sm"
                    hint={(
                      <>
                        Your VPC must have public and private subnets.
                        Public subnets are associated with appropriate Ingress rules.
                        Private subnets need appropriate routes and tables.
                        {' '}
                        <ExternalLink href={links.INSTALL_AWS_VPC}>
                          Learn more about installing into an existing VPC
                        </ExternalLink>
                      </>
                  )}
                  />
                </Title>
                To install into an existing VPC you need to ensure that your VPC is configured
                with a public and a private subnet for each availability zone that you want
                the cluster installed into.
                {' '}
                <ExternalLink href={links.INSTALL_AWS_CUSTOM_VPC_REQUIREMENTS}>
                  Learn all about VPC
                </ExternalLink>
              </GridItem>
              {isWizard ? (
                <>
                  <Alert
                    variant="info"
                    isInline
                    title="You will need to match these VPC subnets when you define the CIDR ranges."
                  />
                  <AWSSubnetFields
                    isMultiAz={isMultiAz}
                    selectedRegion={selectedRegion}
                    privateLinkSelected={privateLinkSelected}
                  />
                </>
              ) : (
                <>
                  <Field
                    component={ReduxCheckbox}
                    name="use_privatelink"
                    label="Use a PrivateLink"
                    helpText={(
                      <>
                        {constants.privateLinkHint}
                      </>
                  )}
                  />
                  <SubnetFields
                    isMultiAz={isMultiAz}
                    selectedRegion={selectedRegion}
                    privateLinkSelected={privateLinkSelected}
                  />
                </>
              )}
            </>
          )
        }
      {
          selected && cloudProviderID === 'gcp' && (
            <>
              <GridItem>
                <Title headingLevel="h4" size="md">
                  Existing VPC
                  <PopoverHint
                    iconClassName="pf-u-ml-sm"
                    hint={(
                      <>
                        {'Your VPC must have control plane and compute subnets. The control plane subnet is where you deploy your control plane machines to. The compute subnet is where you deploy your compute machines to. '}
                        {' '}
                        <ExternalLink href={links.INSTALL_GCP_VPC}>
                          Learn more about installing into an existing VPC
                        </ExternalLink>
                      </>
                  )}
                  />
                </Title>
                To install into an existing VPC you need to ensure that your VPC is configured
                with a control plane subnet and compute subnet.
              </GridItem>

              <GCPNetworkConfigSection isWizard={isWizard} />

            </>
          )
      }
    </>
  );
}

InstallToVPC.propTypes = {
  selectedRegion: PropTypes.string,
  isMultiAz: PropTypes.bool,
  selected: PropTypes.bool,
  privateLinkSelected: PropTypes.bool,
  cloudProviderID: PropTypes.string,
  isWizard: PropTypes.bool,
};

export default InstallToVPC;
