import React, { ReactElement, useMemo } from 'react';
import { Field } from 'formik';

import { Alert, AlertActionLink, GridItem, Title } from '@patternfly/react-core';

import PopoverHint from '~/components/common/PopoverHint';
import ExternalLink from '~/components/common/ExternalLink';
import { required, validateGCPHostProjectId, validateGCPSubnet } from '~/common/validators';
import links from '~/common/installLinks.mjs';
import { useFormState } from '~/components/clusters/wizards/hooks';
import { FieldId, StepId } from '~/components/clusters/wizards/osd/constants';
import { versionComparator } from '~/common/versionComparator';
import { useWizardContext } from '@patternfly/react-core/next';
import { GcpVpcNameSelectField } from './GcpVpcNameSelectField';
import { GcpVpcSubnetSelectField } from './GcpVpcSubnetSelectField';
import { CheckboxField, TextInputField } from '../../../form';

export const GcpVpcSettings = () => {
  const {
    values: {
      [FieldId.ClusterVersion]: clusterVersion,
      [FieldId.InstallToSharedVpc]: installToSharedVpc,
    },
    getFieldProps,
    getFieldMeta,
    setFieldValue,
  } = useFormState();

  const { goToStepById } = useWizardContext();

  const onInstallIntoSharedVPCchange = (checked: boolean) => {
    setFieldValue(FieldId.InstallToSharedVpc, checked);
  };

  const hostProjectId = useMemo<ReactElement | null>(() => {
    if (installToSharedVpc) {
      if (versionComparator(clusterVersion?.raw_id, '4.13.15') === -1) {
        return (
          <div className="pf-u-mt-md">
            <Alert
              variant="danger"
              isInline
              title="You must use OpenShift version 4.13.15 or above."
              actionLinks={
                <>
                  <AlertActionLink onClick={() => goToStepById(StepId.ClusterSettingsDetails)}>
                    Change version
                  </AlertActionLink>
                </>
              }
            />
          </div>
        );
      }
      return (
        <div className="pf-u-mt-md">
          <TextInputField
            name={FieldId.SharedHostProjectID}
            label="Host project ID"
            validate={validateGCPHostProjectId}
          />

          <div className="pf-u-mt-md">
            <Alert
              variant="info"
              isInline
              title="NOTE: To install a cluster into a shared VPC, the shared VPC administrator must enable a project as a
              host project in their Google Cloud console. Then you can attach service projects to the host project."
            />
          </div>
        </div>
      );
    }
    return null;
  }, [clusterVersion?.raw_id, goToStepById, installToSharedVpc]);

  return (
    <>
      <GridItem span={8}>
        <Title headingLevel="h4" size="md">
          GCP shared VPC
        </Title>
        <div className="pf-u-mt-md  pf-u-mb-lg">
          <CheckboxField
            name={FieldId.InstallToSharedVpc}
            label="Install into GCP shared VPC"
            tooltip={
              <>
                <p>
                  Install into a non-default subnet shared by another account in your GCP
                  organization.
                </p>
                <ExternalLink href={links.INSTALL_GCP_VPC}>
                  Learn more about GCP shared VPC.
                </ExternalLink>
              </>
            }
            input={{ onChange: onInstallIntoSharedVPCchange }}
          />
          {hostProjectId}
        </div>
      </GridItem>

      <GridItem>
        <Title headingLevel="h4" size="md">
          Existing VPC
          <PopoverHint
            iconClassName="pf-u-ml-sm"
            hint={
              <>
                {
                  'Your VPC must have control plane and compute subnets. The control plane subnet is where you deploy your control plane machines. The compute subnet is where you deploy your compute machines. '
                }
                <ExternalLink href={links.INSTALL_GCP_VPC}>
                  Learn more about installing into an existing VPC
                </ExternalLink>
              </>
            }
          />
        </Title>
        <div className="pf-u-ml-sm pf-u-mt-md  pf-u-mb-lg" style={{ width: 'fit-content' }}>
          <p className="pf-u-mt-sm">
            To install into an existing VPC, you need to ensure that your VPC is configured with a
            control plane subnet and compute subnet.
          </p>
          {!installToSharedVpc && (
            <div className="pf-u-mt-md  pf-u-mb-lg">
              <Alert
                variant="info"
                isInline
                title="You'll need to match these VPC subnets when you define the CIDR ranges."
              />
            </div>
          )}
        </div>
      </GridItem>

      <GridItem md={3}>
        {installToSharedVpc ? (
          <TextInputField
            name={FieldId.VpcName}
            label="Existing VPC name"
            validate={validateGCPSubnet}
          />
        ) : (
          <Field
            component={GcpVpcNameSelectField}
            name={FieldId.VpcName}
            validate={required}
            label="Existing VPC name"
            placeholder="Select VPC name"
            emptyPlaceholder="No existing VPCs"
            input={{
              ...getFieldProps(FieldId.VpcName),
              onChange: (value: string) => setFieldValue(FieldId.VpcName, value),
            }}
            meta={getFieldMeta(FieldId.VpcName)}
          />
        )}
      </GridItem>

      <GridItem md={3}>
        {installToSharedVpc ? (
          <TextInputField
            name={FieldId.ControlPlaneSubnet}
            label="Control plane subnet name"
            validate={validateGCPSubnet}
          />
        ) : (
          <Field
            component={GcpVpcSubnetSelectField}
            name={FieldId.ControlPlaneSubnet}
            validate={required}
            label="Control plane subnet name"
            placeholder="Select subnet name"
            emptyPlaceholder="No subnet names"
            input={{
              ...getFieldProps(FieldId.ControlPlaneSubnet),
              onChange: (value: string) => setFieldValue(FieldId.ControlPlaneSubnet, value),
            }}
            meta={getFieldMeta(FieldId.ControlPlaneSubnet)}
          />
        )}
      </GridItem>

      <GridItem md={3}>
        {installToSharedVpc ? (
          <TextInputField
            name={FieldId.ComputeSubnet}
            label="Compute subnet name"
            validate={validateGCPSubnet}
          />
        ) : (
          <Field
            component={GcpVpcSubnetSelectField}
            name={FieldId.ComputeSubnet}
            validate={required}
            label="Compute subnet name"
            placeholder="Select subnet name"
            emptyPlaceholder="No subnet names"
            input={{
              ...getFieldProps(FieldId.ComputeSubnet),
              onChange: (value: string) => setFieldValue(FieldId.ComputeSubnet, value),
            }}
            meta={getFieldMeta(FieldId.ComputeSubnet)}
          />
        )}
      </GridItem>

      {installToSharedVpc && (
        <GridItem span={9}>
          <div className="pf-u-mt-md  pf-u-mb-lg">
            <Alert
              variant="info"
              isInline
              title="For successful installation, be sure your Host project ID, Existing VPC name, Control plane subnet name, and Compute subnet name are correct."
            />
          </div>
        </GridItem>
      )}
    </>
  );
};
