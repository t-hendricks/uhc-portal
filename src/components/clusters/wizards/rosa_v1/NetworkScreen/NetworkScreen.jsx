import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';

import {
  Alert,
  Form,
  FormFieldGroup,
  FormGroup,
  Grid,
  GridItem,
  Text,
  Title,
  Tooltip,
} from '@patternfly/react-core';

import { ocmResourceType, trackEvents } from '~/common/analytics';
import { getDefaultSecurityGroupsSettings } from '~/common/securityGroupsHelpers';
import { normalizedProducts } from '~/common/subscriptionTypes';
import { validateRequiredPublicSubnetId } from '~/common/validators';
import { isExactMajorMinor } from '~/common/versionHelpers';
import { getSelectedAvailabilityZones } from '~/common/vpcHelpers';
import { constants } from '~/components/clusters/common/CreateOSDFormConstants';
import { DefaultIngressFields } from '~/components/clusters/common/DefaultIngressFields';
import { SubnetSelectField } from '~/components/clusters/common/SubnetSelectField';
import { canConfigureDayOneManagedIngress } from '~/components/clusters/wizards/rosa/constants';
import { CheckboxDescription } from '~/components/common/CheckboxDescription';
import ExternalLink from '~/components/common/ExternalLink';
import { RadioButtons, ReduxCheckbox } from '~/components/common/ReduxFormComponents';
import useAnalytics from '~/hooks/useAnalytics';
import { isRestrictedEnv } from '~/restrictedEnv';

import links from '../../../../../common/installLinks.mjs';

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
  const publicSubnetIdRef = React.useRef();

  // show only if the product is ROSA with VPC or BYOC/CCS OSD with VPC
  // Do not need to check for VPC here, since checking the "Configure a cluster-wide proxy" checkbox
  // automatically checks the "Install into an existing VPC" checkbox in the UI
  const showConfigureProxy = showClusterWideProxyCheckbox || isByocOSD;

  const showIngressSection = isByoc && !isHypershiftSelected;

  const isManagedIngressAllowed = canConfigureDayOneManagedIngress(clusterVersionRawId);
  const isOcp413 = isExactMajorMinor(clusterVersionRawId, 4, 13);

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
    const hasEmptyByoVpcInfo = formValues.machinePoolsSubnets.every(
      (mpSubnet) =>
        !mpSubnet.privateSubnetId && !mpSubnet.publicSubnetId && !mpSubnet.availabilityZone,
    );

    if (hasEmptyByoVpcInfo) {
      change('install_to_vpc', false);

      if (formValues.configure_proxy) {
        change('configure_proxy', false);
      }

      // Clear also associated security groups when the wizard has this option
      if (formValues.securityGroups) {
        change('securityGroups', getDefaultSecurityGroupsSettings());
      }
    }
  };

  const onClusterPrivacyChange = (_, value) => {
    const { cluster_privacy_public_subnet_id: publicSubnetId, cluster_privacy: clusterPrivacy } =
      formValues;
    if (value === 'external') {
      change('use_privatelink', false);

      if (!isHypershiftSelected) {
        shouldUncheckInstallToVPC();
      }

      // When toggling from Private to Public, if a previous public subnet ID was selected,
      // use that previous value to rehydrate the dropdown.
      if (publicSubnetIdRef.current && clusterPrivacy === 'internal') {
        change('cluster_privacy_public_subnet_id', publicSubnetIdRef.current);
      }
    } else {
      publicSubnetIdRef.current = publicSubnetId;
      change('cluster_privacy_public_subnet_id', '');
    }
  };

  const onPrivateLinkChange = (_event, checked) => {
    if (checked) {
      change('install_to_vpc', true);
    }
  };

  if (forcePrivateLink && privateClusterSelected && !privateLinkSelected) {
    change('install_to_vpc', true);
    change('use_privatelink', true);
  }

  const onClusterProxyChange = (_event, checked) => {
    trackCheckedState(trackEvents.ConfigureClusterWideProxy, checked);
    change('configure_proxy', checked);
    if (checked && !formValues.install_to_vpc) {
      change('install_to_vpc', true);
      trackCheckedState(trackEvents.InstallIntoVPC, checked);
    }
  };

  const onInstallIntoVPCchange = (_event, checked) => {
    change('install_to_vpc', checked);
    if (!checked) {
      if (formValues.shared_vpc.is_selected) {
        change('shared_vpc', {
          is_allowed: formValues.shared_vpc.is_allowed,
          is_selected: false,
          base_dns_domain: '',
          hosted_zone_id: '',
          hosted_zone_role_arn: '',
        });
      }
      if (formValues.securityGroups) {
        change('securityGroups', getDefaultSecurityGroupsSettings());
      }
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
      helpText={<CheckboxDescription>{constants.clusterProxyHint}</CheckboxDescription>}
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
                  label: 'Public',
                  description:
                    'Access Kubernetes API endpoint and application routes from the internet.',
                  extraField: isHypershiftSelected && !privateClusterSelected && (
                    <Field
                      component={SubnetSelectField}
                      name="cluster_privacy_public_subnet_id"
                      label="Public subnet name"
                      className="pf-v5-u-mt-md pf-v5-u-ml-lg"
                      isRequired
                      validate={validateRequiredPublicSubnetId}
                      withAutoSelect={false}
                      selectedVPC={formValues.selected_vpc}
                      privacy="public"
                      allowedAZs={getSelectedAvailabilityZones(
                        formValues.selected_vpc,
                        formValues.machinePoolsSubnets,
                      )}
                    />
                  ),
                },
                {
                  value: 'internal',
                  label: 'Private',
                  description:
                    'Access Kubernetes API endpoint and application routes from direct private connections only.',
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
                          <CheckboxDescription>{constants.privateLinkHint}</CheckboxDescription>
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

        {showIngressSection && (
          <>
            <GridItem>
              <Title headingLevel="h4" size="xl">
                Application ingress settings
              </Title>
              <Text className="pf-v5-u-mt-sm">
                Ingress is configured by default.{' '}
                {isManagedIngressAllowed
                  ? 'Customize settings if needed.'
                  : 'It can be customized for 4.14 clusters or newer.'}
                {isOcp413 && (
                  <>
                    {' '}
                    For 4.13 clusters, refer to{' '}
                    <ExternalLink href={links.MANAGED_INGRESS_KNOWLEDGE_BASE}>
                      this knowledge base article
                    </ExternalLink>
                    .
                  </>
                )}
              </Text>
            </GridItem>

            {isManagedIngressAllowed && (
              <Field
                component={RadioButtons}
                name="applicationIngress"
                ariaLabel="Use application ingress defaults"
                isDisabled={!isManagedIngressAllowed}
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
                        className="pf-v5-u-mt-md pf-v5-u-ml-lg"
                        isDay2={false}
                        canShowLoadBalancer={false}
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
