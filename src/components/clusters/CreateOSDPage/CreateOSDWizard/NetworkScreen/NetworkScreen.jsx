import React from 'react';
import PropTypes from 'prop-types';
import {
  Alert,
  Form,
  Grid,
  GridItem,
  Title,
  Text,
  FormFieldGroup,
  FormGroup,
  Tooltip,
} from '@patternfly/react-core';
import { Field } from 'redux-form';
import { ReduxCheckbox } from '../../../../common/ReduxFormComponents';
import RadioButtons from '../../../../common/ReduxFormComponents/RadioButtons';
import { constants } from '../../CreateOSDForm/CreateOSDFormConstants';
import ExternalLink from '../../../../common/ExternalLink';
import links from '../../../../../common/installLinks.mjs';
import { normalizedProducts } from '~/common/subscriptionTypes';
import { PLACEHOLDER_VALUE } from '../../CreateOSDForm/FormSections/NetworkingSection/AvailabilityZoneSelection';
import useAnalytics from '~/hooks/useAnalytics';
import { ocmResourceType, trackEvents } from '~/common/analytics';
import { SubnetSelectField } from './SubnetSelectField';

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
    isHypershiftSelected,
  } = props;
  const { OSD, OSDTrial } = normalizedProducts;
  const isByocOSD = isByoc && [OSD, OSDTrial].includes(product);
  const publicSubnetRef = React.useRef();

  // show only if the product is ROSA with VPC or BYOC/CCS OSD with VPC
  // Do not need to check for VPC here, since checking the "Configure a cluster-wide proxy" checkbox
  // automatically checks the "Install into an existing VPC" checkbox in the UI
  const showConfigureProxy = showClusterWideProxyCheckbox || isByocOSD;

  const track = useAnalytics();

  const trackOcmResourceType =
    product === normalizedProducts.ROSA ? ocmResourceType.MOA : ocmResourceType.OSD;

  const trackCheckedState = (trackEvent, checked) =>
    track(trackEvent, {
      resourceType: trackOcmResourceType,
      customProperties: {
        checked,
      },
    });

  const shouldUncheckInstallToVPC = () => {
    const availabilityZones = [formValues.az_0, formValues.az_1, formValues.az_2];
    const hasSubnets = Object.keys(formValues).some(
      (formValue) =>
        formValue.startsWith('public_subnet_id') || formValue.startsWith('private_subnet_id'),
    );

    const noAvailZones = availabilityZones.every(
      (zone) => zone === undefined || zone === PLACEHOLDER_VALUE,
    );

    if (!hasSubnets && noAvailZones) {
      change('install_to_vpc', false);
    }
  };

  const onClusterPrivacyChange = (_, value) => {
    const { cluster_privacy_public_subnet: publicSubnet, cluster_privacy: clusterPrivacy } =
      formValues;
    if (value === 'external') {
      if (!isHypershiftSelected) {
        // hypershift always uses private link and vpc
        change('use_privatelink', false);
        shouldUncheckInstallToVPC();
      }

      // When toggling from Private to Public, if a previous public subnet ID was selected,
      // use that previous value to rehydrate the dropdown.
      if (publicSubnetRef.current && clusterPrivacy === 'internal') {
        change('cluster_privacy_public_subnet', publicSubnetRef.current);
      }
    } else {
      publicSubnetRef.current = publicSubnet;
      change('cluster_privacy_public_subnet', { subnet_id: '', availability_zone: '' });
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
    trackCheckedState(trackEvents.ConfigureClusterWideProxy, checked);
    change('configure_proxy', checked);
    if (checked && !formValues.install_to_vpc) {
      change('install_to_vpc', true);
      trackCheckedState(trackEvents.InstallIntoVPC, checked);
    }
  };

  const onInstallIntoVPCchange = (checked) => {
    change('install_to_vpc', checked);
    trackCheckedState(trackEvents.InstallIntoVPC, checked);
  };

  const privateLinkAndClusterSelected = privateLinkSelected && privateClusterSelected;
  const installToVPCCheckbox = (
    <Field
      component={ReduxCheckbox}
      name="install_to_vpc"
      label="Install into an existing VPC"
      onChange={onInstallIntoVPCchange}
      isDisabled={privateLinkAndClusterSelected || configureProxySelected}
    />
  );
  const configureClusterProxyField = (
    <Field
      component={ReduxCheckbox}
      name="configure_proxy"
      label="Configure a cluster-wide proxy"
      onChange={onClusterProxyChange}
      helpText={
        <div className="ocm-c--reduxcheckbox-description">{constants.clusterProxyHint}</div>
      }
    />
  );

  return (
    <Form
      onSubmit={(event) => {
        event.preventDefault();
        return false;
      }}
    >
      <Grid hasGutter>
        <GridItem>
          <Title headingLevel="h3">Networking configuration</Title>
        </GridItem>
        <GridItem>
          <Text>Configure network access for your cluster.</Text>
        </GridItem>

        {showClusterPrivacy && (
          <>
            <GridItem>
              <Title headingLevel="h4" size="xl" className="privacy-heading">
                Cluster privacy
              </Title>
            </GridItem>
            <GridItem>
              <Text>
                {/* eslint-disable-next-line max-len */}
                Install your cluster with all public or private API endpoints and application
                routes.{' '}
                {isHypershiftSelected && 'You can customize these options after installation.'}
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
                      <div className="ocm-c--reduxradiobutton-description">
                        Access Kubernetes API endpoint and application routes from the internet.
                      </div>
                    </>
                  ),
                  extraField: isHypershiftSelected && !privateClusterSelected && (
                    <Field
                      component={SubnetSelectField}
                      name="cluster_privacy_public_subnet"
                      label="Public subnet ID"
                      className="pf-u-mt-md pf-u-ml-lg"
                      isRequired
                      withAutoSelect={false}
                      selectedVPC={formValues.selected_vpc_id}
                      privacy="public"
                      isNewCluster
                    />
                  ),
                },
                {
                  value: 'internal',
                  ariaLabel: 'Private',
                  label: (
                    <>
                      Private
                      <div className="ocm-c--reduxradiobutton-description">
                        Access Kubernetes API endpoint and application routes from direct private
                        connections only.
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
                  variant="warning"
                  isInline
                  title="You will not be able to access your cluster until you edit network settings in your cloud provider."
                >
                  {cloudProviderID === 'aws' && (
                    <ExternalLink href={links.OSD_AWS_PRIVATE_CONNECTIONS}>
                      Learn more about configuring network settings
                    </ExternalLink>
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
                {isHypershiftSelected
                  ? 'Install into a Virtual Private Cloud (VPC)'
                  : 'Virtual Private Cloud (VPC)'}
              </Title>
            </GridItem>
            <GridItem>
              <Text>
                {isHypershiftSelected
                  ? 'To install a hosted ROSA cluster, you must have a VPC. Specify your VPC details based on your selected region and account.'
                  : 'By default, a new VPC will be created for your cluster. Alternatively, you may opt to install to an existing VPC below.'}
              </Text>
            </GridItem>
            {isHypershiftSelected ? (
              <GridItem>
                <Alert
                  variant="info"
                  isInline
                  title="Hosted control plane for ROSA clusters are installed and managed in your AWS VPC through a fully private connection using AWS PrivateLink."
                >
                  <ExternalLink href={links.VIRTUAL_PRIVATE_CLOUD_URL}>
                    Learn more about networking on hosted clusters
                  </ExternalLink>
                </Alert>
                <FormGroup>
                  <FormFieldGroup>{configureClusterProxyField}</FormFieldGroup>
                </FormGroup>
              </GridItem>
            ) : (
              <GridItem>
                <FormGroup fieldId="install-to-vpc">
                  {privateClusterSelected ? (
                    <Tooltip
                      position="top-start"
                      enableFlip
                      content={
                        <p>
                          Private clusters must be installed into an existing VPC and have
                          PrivateLink enabled.
                        </p>
                      }
                    >
                      {installToVPCCheckbox}
                    </Tooltip>
                  ) : (
                    installToVPCCheckbox
                  )}
                  <FormFieldGroup>
                    {privateClusterSelected && cloudProviderID === 'aws' && (
                      <FormGroup>
                        <Field
                          component={ReduxCheckbox}
                          name="use_privatelink"
                          label="Use a PrivateLink"
                          onChange={onPrivateLinkChange}
                          isDisabled={forcePrivateLink && privateClusterSelected}
                          helpText={
                            <div className="ocm-c--reduxcheckbox-description">
                              {constants.privateLinkHint}
                            </div>
                          }
                        />
                      </FormGroup>
                    )}
                    {showConfigureProxy && <FormGroup>{configureClusterProxyField}</FormGroup>}
                  </FormFieldGroup>
                </FormGroup>
              </GridItem>
            )}
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
  isHypershiftSelected: PropTypes.bool,
};

export default NetworkScreen;
