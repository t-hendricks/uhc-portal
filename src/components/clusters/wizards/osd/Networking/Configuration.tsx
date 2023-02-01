import React from 'react';

import { Form, Grid, GridItem, Title, Text, FormGroup, Alert } from '@patternfly/react-core';

import { ocmResourceType, trackEvents, TrackEvent } from '~/common/analytics';
import links from '~/common/installLinks.mjs';
import { normalizedProducts } from '~/common/subscriptionTypes';
import { constants } from '~/components/clusters/CreateOSDPage/CreateOSDForm/CreateOSDFormConstants';
import { PLACEHOLDER_VALUE } from '~/components/clusters/CreateOSDPage/CreateOSDForm/FormSections/NetworkingSection/AvailabilityZoneSelection';
import ExternalLink from '~/components/common/ExternalLink';
import useAnalytics from '~/hooks/useAnalytics';
import {
  CheckboxField,
  RadioGroupField,
  RadioGroupOption,
} from '~/components/clusters/wizards/form';
import { useFormState } from '~/components/clusters/wizards/hooks';
import { CloudProviderType } from '~/components/clusters/wizards/common/constants';
import { FieldId } from '~/components/clusters/wizards/osd/constants';
import { ClusterPrivacyType } from './constants';

export const Configuration = () => {
  const track = useAnalytics();
  const {
    values: {
      [FieldId.CloudProvider]: cloudProvider,
      [FieldId.Product]: product,
      [FieldId.Byoc]: byoc,
      [FieldId.ClusterPrivacy]: clusterPrivacy,
      [FieldId.ConfigureProxy]: configureProxy,
      [FieldId.InstallToVpc]: installToVpc,
      [FieldId.UsePrivateLink]: usePrivateLink,
      [FieldId.FirstAvailabilityZone]: availZoneOne,
      [FieldId.SecondAvailabilityZone]: availZoneTwo,
      [FieldId.ThirdAvailabilityZone]: availZoneThree,
    },
    values,
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

  const onClusterPrivacyChange = (value: string) => {
    if (value === ClusterPrivacyType.External) {
      setFieldValue(FieldId.UsePrivateLink, false);

      const availabilityZones = [availZoneOne, availZoneTwo, availZoneThree];
      const hasSubnets = Object.keys(values).some(
        (formValue) =>
          formValue.startsWith(FieldId.PublicSubnetId) ||
          formValue.startsWith(FieldId.PrivateSubnetId),
      );
      const noAvailZones = availabilityZones.every(
        (zone) => zone === undefined || zone === PLACEHOLDER_VALUE,
      );

      if (!hasSubnets && noAvailZones) {
        setFieldValue(FieldId.InstallToVpc, false);

        // Also unset "Configure a cluster-wide proxy" if enabled
        if (configureProxy) {
          setFieldValue(FieldId.ConfigureProxy, false);
        }
      }
    }
  };

  const onPrivateLinkChange = (checked: boolean) => {
    setFieldValue(FieldId.UsePrivateLink, checked);

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

  const clusterPrivacyOptions: RadioGroupOption[] = [
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
      <Grid hasGutter>
        <GridItem>
          <Title headingLevel="h3">Networking configuration</Title>
          <Text className="pf-u-mt-sm">Configure network access for your cluster.</Text>
        </GridItem>

        {showClusterPrivacy && (
          <>
            <GridItem>
              <Title headingLevel="h4" size="xl" className="privacy-heading">
                Cluster privacy
              </Title>
              <Text className="pf-u-mt-sm">
                Install your cluster with all public or private API endpoints and application
                routes.
              </Text>
            </GridItem>

            <GridItem span={6}>
              <RadioGroupField
                name={FieldId.ClusterPrivacy}
                options={clusterPrivacyOptions}
                onChange={onClusterPrivacyChange}
              />
            </GridItem>

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
              <Text className="pf-u-mt-sm">
                By default, a new VPC will be created for your cluster. Alternatively, you may opt
                to install to an existing VPC below.
              </Text>
            </GridItem>

            <GridItem span={6}>
              <FormGroup fieldId={FieldId.InstallToVpc}>
                <CheckboxField
                  name={FieldId.InstallToVpc}
                  label="Install into an existing VPC"
                  input={{ onChange: onInstallIntoVPCchange }}
                  isDisabled={usePrivateLink || configureProxy}
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
      </Grid>
    </Form>
  );
};
