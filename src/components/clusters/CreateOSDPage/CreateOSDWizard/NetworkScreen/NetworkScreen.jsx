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

import { normalizedProducts } from '~/common/subscriptionTypes';
import { validateRequiredMachinePoolsSubnet } from '~/common/validators';
import useAnalytics from '~/hooks/useAnalytics';
import { ocmResourceType, trackEvents } from '~/common/analytics';
import { isRestrictedEnv } from '~/restrictedEnv';
import { canConfigureManagedIngress } from '~/components/clusters/wizards/rosa/constants';
import { ReduxCheckbox } from '../../../../common/ReduxFormComponents';
import RadioButtons from '../../../../common/ReduxFormComponents/RadioButtons';
import { constants } from '../../CreateOSDForm/CreateOSDFormConstants';
import ExternalLink from '../../../../common/ExternalLink';
import links from '../../../../../common/installLinks.mjs';
import { PLACEHOLDER_VALUE } from '../../CreateOSDForm/FormSections/NetworkingSection/AvailabilityZoneSelection';

import { SubnetSelectField } from './SubnetSelectField';
import { DefaultIngressFields } from './DefaultIngressFields';

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
    clusterVersionRawId,
    applicationIngress,
  } = props;
  const { OSD, OSDTrial } = normalizedProducts;
  const isByocOSD = isByoc && [OSD, OSDTrial].includes(product);
  const publicSubnetRef = React.useRef();

  // show only if the product is ROSA with VPC or BYOC/CCS OSD with VPC
  // Do not need to check for VPC here, since checking the "Configure a cluster-wide proxy" checkbox
  // automatically checks the "Install into an existing VPC" checkbox in the UI
  const showConfigureProxy = showClusterWideProxyCheckbox || isByocOSD;

  const isManagedIngresAllowed = canConfigureManagedIngress(clusterVersionRawId);

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
      change('use_privatelink', false);

      if (!isHypershiftSelected) {
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
    if (!checked && formValues.shared_vpc.is_allowed) {
      change('shared_vpc', {
        is_allowed: true,
        is_selected: false,
        base_dns_domain: '',
        hosted_zone_id: '',
        hosted_zone_role_arn: '',
      });
    }
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
              isDisabled={isRestrictedEnv()}
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
                      label="Public subnet name"
                      className="pf-u-mt-md pf-u-ml-lg"
                      isRequired
                      validate={validateRequiredMachinePoolsSubnet}
                      withAutoSelect={false}
                      selectedVPC={formValues.selected_vpc_id}
                      privacy="public"
                      isNewCluster
                      allowedAZ={[
                        ...new Set(
                          formValues.machine_pools_subnets.map(
                            (subnet) => subnet.availability_zone,
                          ),
                        ),
                      ]}
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

        {isHypershiftSelected && <GridItem>{configureClusterProxyField}</GridItem>}

        {showVPCCheckbox && !isHypershiftSelected && (
          <>
            <GridItem>
              <Title headingLevel="h4" size="xl" className="privacy-heading">
                Virtual Private Cloud (VPC)
              </Title>
            </GridItem>
            <GridItem>
              <Text>
                By default, a new VPC will be created for your cluster. Alternatively, you may opt
                to install to an existing VPC below.
              </Text>
            </GridItem>
            <GridItem>
              <FormGroup fieldId="install-to-vpc">
                {privateClusterSelected ? (
                  <Tooltip
                    position="top-start"
                    enableFlip
                    content={
                      <p>
                        Private clusters must be installed into an existing VPC and have PrivateLink
                        enabled.
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
          </>
        )}

        {cloudProviderID === 'aws' && !isHypershiftSelected && (
          <>
            <GridItem>
              <Title headingLevel="h4" size="xl">
                Application ingress settings
              </Title>
              <Text className="pf-u-mt-sm">
                Ingress is configured by default.{' '}
                {isManagedIngresAllowed
                  ? 'Customize settings if needed.'
                  : 'It can be customized for clusters 4.13 or newer.'}
              </Text>
            </GridItem>

            {isManagedIngresAllowed && (
              <Field
                component={RadioButtons}
                name="applicationIngress"
                ariaLabel="Use application ingress defaults"
                isDisabled={!isManagedIngresAllowed}
                disableDefaultValueHandling
                options={[
                  {
                    value: 'default',
                    ariaLabel: 'Default settings',
                    label: 'Default settings',
                    // Do not show the form when "default" is requested
                  },
                  {
                    value: 'custom',
                    ariaLabel: 'Custom settings',
                    label: 'Custom settings',
                    extraField: applicationIngress !== 'default' && (
                      <DefaultIngressFields
                        hasSufficientIngressEditVersion
                        className="pf-u-mt-md pf-u-ml-lg"
                      />
                    ),
                  },
                ]}
              />
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
  clusterVersionRawId: PropTypes.string.isRequired,
  applicationIngress: PropTypes.string,
};

export default NetworkScreen;
