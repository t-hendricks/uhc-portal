import React from 'react';
import { RadioButtonField } from 'formik-pf';

import { Form, Flex, Grid, GridItem, Title, Text, FormGroup, Alert } from '@patternfly/react-core';

import { ocmResourceType, trackEvents, TrackEvent } from '~/common/analytics';
import links from '~/common/installLinks.mjs';
import { normalizedProducts } from '~/common/subscriptionTypes';
import { constants } from '~/components/clusters/CreateOSDPage/CreateOSDForm/CreateOSDFormConstants';
import { PLACEHOLDER_VALUE } from '~/components/clusters/CreateOSDPage/CreateOSDForm/FormSections/NetworkingSection/AvailabilityZoneSelection';
import ExternalLink from '~/components/common/ExternalLink';
import useAnalytics from '~/hooks/useAnalytics';
import { CloudProviderType } from '../ClusterSettings/CloudProvider/types';
import { FieldId } from '../constants';
import { useFormState } from '../hooks';
import { ClusterPrivacyType } from './constants';
import { CheckboxField } from '../common/form';

export const Configuration = () => {
  const track = useAnalytics();
  const {
    values: {
      [FieldId.CloudProvider]: cloudProvider,
      [FieldId.Product]: product,
      [FieldId.Byoc]: byoc,
      [FieldId.MultiAz]: multiAz,
      [FieldId.Region]: region,
      [FieldId.ClusterPrivacy]: clusterPrivacy,
      [FieldId.ConfigureProxy]: configureProxy,
      [FieldId.InstallToVpc]: installToVpc,
      [FieldId.UsePrivateLink]: usePrivatLink,
      ...otherValues
    },
    setFieldValue,
  } = useFormState();
  const isByoc = byoc === 'true';
  const isPrivateCluster = clusterPrivacy === ClusterPrivacyType.Internal;
  const showClusterPrivacy =
    cloudProvider === CloudProviderType.Aws || (cloudProvider === CloudProviderType.Gcp && isByoc);
  const showConfigureProxy =
    isByoc && [normalizedProducts.OSD, normalizedProducts.OSDTrial].includes(product);
  const trackOcmResourceType =
    product === normalizedProducts.ROSA ? ocmResourceType.MOA : ocmResourceType.OSD;

  const trackCheckedState = (trackEvent: TrackEvent, checked: boolean) =>
    track(trackEvent, {
      resourceType: trackOcmResourceType,
      customProperties: {
        checked,
      },
    });

  const shouldUncheckInstallToVPC = () => {
    const availabilityZones = [otherValues.az_0, otherValues.az_1, otherValues.az_2];
    const hasSubnets = Object.keys(otherValues).some(
      (formValue) =>
        formValue.startsWith('public_subnet_id') || formValue.startsWith('private_subnet_id'),
    );

    const noAvailZones = availabilityZones.every(
      (zone) => zone === undefined || zone === PLACEHOLDER_VALUE,
    );

    if (!hasSubnets && noAvailZones) {
      setFieldValue(FieldId.InstallToVpc, false);
    }
  };

  const onClusterPrivacyChange = (event: React.ChangeEvent<any>) => {
    const { value } = event.target;

    if (value === ClusterPrivacyType.External) {
      setFieldValue(FieldId.UsePrivateLink, false);
      shouldUncheckInstallToVPC();
    }
  };

  const onPrivateLinkChange = (checked: boolean) => {
    if (checked) {
      setFieldValue(FieldId.InstallToVpc, true);
    }
  };

  const onClusterProxyChange = (checked: boolean) => {
    trackCheckedState(trackEvents.ConfigureClusterWideProxy, checked);
    setFieldValue(FieldId.ConfigureProxy, checked);

    if (checked && !installToVpc) {
      setFieldValue(FieldId.InstallToVpc, true);
      trackCheckedState(trackEvents.InstallIntoVPC, checked);
    }
  };

  const onInstallIntoVPCchange = (checked: boolean) => {
    setFieldValue(FieldId.InstallToVpc, checked);
    trackCheckedState(trackEvents.InstallIntoVPC, checked);
  };

  const clusterPrivacyOptions = [
    {
      value: ClusterPrivacyType.External,
      label: 'Public',
      description: 'Access Kubernetes API endpoint and application routes from the internet.',
    },
    {
      value: ClusterPrivacyType.Internal,
      label: 'Private',
      description:
        'Access Kubernetes API endpoint and application routes from direct private connections only.',
    },
  ];

  return (
    <Form>
      <Grid hasGutter md={6}>
        <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsLg' }}>
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
                  routes.
                </Text>
              </GridItem>

              <div onChange={onClusterPrivacyChange}>
                {clusterPrivacyOptions.map((option) => (
                  <RadioButtonField
                    name={FieldId.ClusterPrivacy}
                    label={option.label}
                    value={option.value}
                    className="pf-u-mb-md"
                    description={option.description}
                  />
                ))}
              </div>

              {isPrivateCluster && (
                <GridItem>
                  <Alert
                    isInline
                    variant="warning"
                    title="You will not be able to access your cluster until you edit network settings in your cloud provider."
                  >
                    {cloudProvider === CloudProviderType.Aws && (
                      <ExternalLink href={links.OSD_AWS_PRIVATE_CONNECTIONS}>
                        Learn more about configuring network settings
                      </ExternalLink>
                    )}
                  </Alert>
                </GridItem>
              )}
            </>
          )}

          {isByoc && (
            <>
              <GridItem>
                <Title headingLevel="h4" size="xl" className="privacy-heading">
                  Virtual Private Cloud (VPC)
                </Title>
                <Text>
                  By default, a new VPC will be created for your cluster. Alternatively, you may opt
                  to install to an existing VPC below.
                </Text>
              </GridItem>

              <GridItem>
                <FormGroup fieldId={FieldId.InstallToVpc}>
                  <CheckboxField
                    name={FieldId.InstallToVpc}
                    label="Install into an existing VPC"
                    input={{ onChange: onInstallIntoVPCchange }}
                    isDisabled={usePrivatLink || configureProxy}
                  />

                  <div className="pf-u-ml-lg pf-u-mt-md">
                    {isPrivateCluster && cloudProvider === CloudProviderType.Aws && (
                      <CheckboxField
                        name={FieldId.UsePrivateLink}
                        label="Use a PrivateLink"
                        input={{
                          onChange: onPrivateLinkChange,
                          description: constants.privateLinkHint,
                        }}
                      />
                    )}
                    {showConfigureProxy && (
                      <div className="pf-u-mt-md">
                        <CheckboxField
                          name={FieldId.ConfigureProxy}
                          label="Configure a cluster-wide proxy"
                          input={{
                            onChange: onClusterProxyChange,
                            description: constants.clusterProxyHint,
                          }}
                        />
                      </div>
                    )}
                  </div>
                </FormGroup>
              </GridItem>
            </>
          )}
        </Flex>
      </Grid>
    </Form>
  );
};
