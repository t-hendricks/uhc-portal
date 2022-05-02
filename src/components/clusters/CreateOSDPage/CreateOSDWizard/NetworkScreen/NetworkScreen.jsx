import React from 'react';
import PropTypes from 'prop-types';
import {
  Alert,
  Form,
  Grid,
  GridItem,
  Title,
  Text, FormFieldGroup, FormGroup, Tooltip,
} from '@patternfly/react-core';
import { Field } from 'redux-form';
import { ReduxCheckbox } from '../../../../common/ReduxFormComponents';
import RadioButtons from '../../../../common/ReduxFormComponents/RadioButtons';
import { constants } from '../../CreateOSDForm/CreateOSDFormConstants';
import ExternalLink from '../../../../common/ExternalLink';
import links from '../../../../../common/installLinks.mjs';
import { normalizedProducts } from '../../../../../common/subscriptionTypes';
import { PLACEHOLDER_VALUE } from '../../CreateOSDForm/FormSections/NetworkingSection/AvailabilityZoneSelection';

function NetworkScreen(props) {
  const {
    change,
    privateClusterSelected,
    showClusterPrivacy,
    showVPCCheckbox,
    showClusterWideProxyCheckbox,
    cloudProviderID,
    privateLinkSelected,
    forcePrivateLink,
    configureProxySelected,
    isByoc,
    product,
    formValues,
  } = props;

  const { OSD, OSDTrial } = normalizedProducts;
  const isByocOSD = isByoc && [OSD, OSDTrial].includes(product);
  // show only if the product is ROSA with VPC or BYOC/CCS OSD with VPC
  // Do not need to check for VPC here, since checking the "Configure a cluster-wide proxy" checkbox
  // automatically checks the "Install into an existing VPC" checkbox in the UI
  const showConfigureProxy = showClusterWideProxyCheckbox || isByocOSD;

  const findSubnetData = () => {
    const availabilityZones = [formValues.az_0, formValues.az_1, formValues.az_2];
    const hasSubnets = Object.keys(formValues).some(
      formValue => formValue.startsWith('public_subnet_id')
      || formValue.startsWith('private_subnet_id'),
    );

    const noAvailZones = availabilityZones.every(
      zone => zone === undefined
      || zone === PLACEHOLDER_VALUE,
    );

    if (!hasSubnets && noAvailZones) {
      change('install_to_vpc', false);
    }
  };

  const onClusterPrivacyChange = (_, value) => {
    if (value === 'external') {
      change('use_privatelink', false);
      findSubnetData();
    }
  };

  const onPrivateLinkChange = (checked) => {
    if (checked) {
      change('install_to_vpc', true);
    }
  };

  if (forcePrivateLink && privateClusterSelected && !privateLinkSelected) {
    change('install_to_vpc', true);
    change('use_privatelink', true);
  }

  const onClusterProxyChange = (checked) => {
    change('configure_proxy', checked);
    if (checked) {
      change('install_to_vpc', true);
    }
  };

  const privateLinkAndClusterSelected = privateLinkSelected && privateClusterSelected;
  const installToVPCCheckbox = (
    <Field
      component={ReduxCheckbox}
      name="install_to_vpc"
      label="Install into an existing VPC"
      isDisabled={(privateLinkAndClusterSelected || configureProxySelected)}
    />
  );

  return (
    <Form onSubmit={(event) => { event.preventDefault(); return false; }}>
      <Grid hasGutter>
        <GridItem>
          <Title headingLevel="h3">Networking configuration</Title>
        </GridItem>
        <GridItem>
          <Text>
            Configure network access for your cluster.
          </Text>
        </GridItem>

        {showClusterPrivacy && (
          <>
            <GridItem>
              <Title headingLevel="h4" size="xl" className="privacy-heading">Cluster privacy</Title>
            </GridItem>
            <GridItem>
              <Text>
                Install your cluster with  all public or all private API endpoint and
                application routes.
                You can customize these options after installation.
              </Text>
            </GridItem>
            <Field
              component={RadioButtons}
              name="cluster_privacy"
              ariaLabel="Cluster privacy"
              onChange={onClusterPrivacyChange}
              options={[
                {
                  value: 'external',
                  ariaLabel: 'Public',
                  label: (
                    <>
                      Public
                      <div className="radio-helptext">
                        Access Kubernetes API endpoint and application routes from the internet.
                      </div>
                    </>),
                },
                {
                  value: 'internal',
                  ariaLabel: 'Private',
                  label: (
                    <>
                      Private
                      <div className="radio-helptext">
                        Access Kubernetes API endpoint and application routes from
                        direct private connections only.
                      </div>
                    </>
                  ),
                },
              ]}
              disableDefaultValueHandling
            />

            {privateClusterSelected && (
              <GridItem>
                <Alert
                  className="bottom-alert"
                  variant="warning"
                  isInline
                  title="You will not be able to access your cluster until you edit network settings in your cloud provider."
                >
                  {cloudProviderID === 'aws' && (
                    <span>
                      Follow the
                      {' '}
                      <ExternalLink href={links.OSD_AWS_PRIVATE_CONNECTIONS}>
                        documentation
                      </ExternalLink>
                      {' '}
                      for how to do that.
                    </span>
                  )}
                </Alert>
              </GridItem>
            )}
          </>
        )}

        {showVPCCheckbox && (
          <>
            <GridItem>
              <Title headingLevel="h4" size="xl" className="privacy-heading">
                Virtual Private Cloud (VPC)
              </Title>
              <Text>
                By default, a new VPC will be created for your cluster.
                Alternatively, you may opt to install to an existing VPC below.
              </Text>
            </GridItem>
            <GridItem>
              <FormGroup fieldId="install-to-vpc">
                {privateClusterSelected ? (
                  <Tooltip
                    position="top-start"
                    enableFlip
                    content={(
                      <p>
                        Private clusters must be installed into an existing VPC
                        {' '}
                        using a PrivateLink.
                      </p>
                    )}
                  >
                    {installToVPCCheckbox}
                  </Tooltip>
                ) : installToVPCCheckbox}
                <FormFieldGroup>
                  {privateClusterSelected && cloudProviderID === 'aws' && (
                  <FormGroup>
                    <Field
                      component={ReduxCheckbox}
                      name="use_privatelink"
                      label="Use a PrivateLink"
                      onChange={onPrivateLinkChange}
                      isDisabled={forcePrivateLink && privateClusterSelected}
                      helpText={(
                        <>
                          {constants.privateLinkHint}
                        </>
                      )}
                    />
                  </FormGroup>
                  )}
                  {showConfigureProxy && (
                  <FormGroup>
                    <Field
                      component={ReduxCheckbox}
                      name="configure_cluster_proxy"
                      label="Configure a cluster-wide proxy"
                      onChange={onClusterProxyChange}
                      helpText={(
                        <>
                          {constants.clusterProxyHint}
                        </>
                      )}
                    />
                  </FormGroup>
                  )}
                </FormFieldGroup>
              </FormGroup>
            </GridItem>
          </>
        )}
      </Grid>
    </Form>
  );
}

NetworkScreen.propTypes = {
  change: PropTypes.func.isRequired,
  privateClusterSelected: PropTypes.bool,
  cloudProviderID: PropTypes.string,
  showClusterPrivacy: PropTypes.bool,
  showVPCCheckbox: PropTypes.bool,
  showClusterWideProxyCheckbox: PropTypes.bool,
  privateLinkSelected: PropTypes.bool,
  forcePrivateLink: PropTypes.bool,
  configureProxySelected: PropTypes.bool,
  isByoc: PropTypes.bool,
  product: PropTypes.string,
  formValues: PropTypes.object,
};

export default NetworkScreen;
