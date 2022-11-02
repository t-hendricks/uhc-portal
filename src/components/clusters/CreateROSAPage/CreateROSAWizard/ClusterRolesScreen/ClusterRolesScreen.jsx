import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { Spinner } from '@redhat-cloud-services/frontend-components/Spinner';

import {
  Alert,
  Button,
  Form,
  FormGroup,
  Grid,
  GridItem,
  Text,
  TextContent,
  TextVariants,
  Title,
} from '@patternfly/react-core';

import ExternalLink from '../../../../common/ExternalLink';
import ErrorBox from '../../../../common/ErrorBox';
import InstructionCommand from '../../../../common/InstructionCommand';
import RadioButtons from '../../../../common/ReduxFormComponents/RadioButtons';
import ReduxVerticalFormGroup from '../../../../common/ReduxFormComponents/ReduxVerticalFormGroup';
import validators from '../../../../../common/validators';
import PopoverHint from '../../../../common/PopoverHint';
import links from '../../../../../common/installLinks.mjs';
import useAnalytics from '~/hooks/useAnalytics';
import { trackEvents } from '~/common/analytics';
import ReduxHiddenCheckbox from '~/components/common/ReduxFormComponents/ReduxHiddenCheckbox';
import { BackToAssociateAwsAccountLink } from '../common/BackToAssociateAwsAccountLink';

export const createOperatorRolesHashPrefix = () => {
  // random 4 alphanumeric hash
  const prefixArray = Math.random().toString(36).substr(2, 4).split('');
  // cannot start with a number
  const alphabet = 'abcdefghijklmnopqrstuvwxyz';
  const randomCharacter = alphabet[Math.floor(Math.random() * alphabet.length)];
  prefixArray[0] = randomCharacter;
  return prefixArray.join('');
};

const roleModes = {
  MANUAL: 'manual',
  AUTO: 'auto',
};

function ClusterRolesScreen({
  change,
  awsAccountID,
  rosaCreationMode,
  customOperatorRolesPrefix,
  getOCMRole,
  getOCMRoleResponse,
  clearGetOcmRoleResponse,
  clusterName,
}) {
  const [isAutoModeAvailable, setIsAutoModeAvailable] = useState(false);
  const [getOCMRoleErrorBox, setGetOCMRoleErrorBox] = useState(null);
  const { track } = useAnalytics();

  useEffect(() => {
    if (!customOperatorRolesPrefix) {
      change('custom_operator_roles_prefix', `${clusterName}-${createOperatorRolesHashPrefix()}`);
    }
  }, [customOperatorRolesPrefix, clusterName]);

  useEffect(() => {
    // clearing the ocm_role_response results in ocm role being re-fetched
    // when navigating to this step (from Next or Back)
    change('detected_ocm_role', false);
    clearGetOcmRoleResponse();
  }, []);

  useEffect(() => {
    if (!rosaCreationMode && getOCMRoleResponse.fulfilled) {
      change(
        'rosa_roles_provider_creation_mode',
        isAutoModeAvailable ? roleModes.AUTO : roleModes.MANUAL,
      );
    }
  }, [rosaCreationMode, isAutoModeAvailable, getOCMRoleResponse.fulfilled]);

  useEffect(() => {
    if (getOCMRoleResponse.pending) {
      setGetOCMRoleErrorBox(null);
    } else if (getOCMRoleResponse.fulfilled) {
      change('rosa_creator_arn', getOCMRoleResponse.data?.arn);
      change('detected_ocm_role', true);
      const isAdmin = getOCMRoleResponse.data?.isAdmin;
      setIsAutoModeAvailable(isAdmin);
      setGetOCMRoleErrorBox(null);
    } else if (getOCMRoleResponse.error) {
      // display error
      setGetOCMRoleErrorBox(
        <>
          <ErrorBox
            message="ocm-role is no longer linked to your Red Hat organization"
            response={getOCMRoleResponse}
            isExpandable
          >
            <BackToAssociateAwsAccountLink />
          </ErrorBox>
        </>
      );
    } else {
      getOCMRole(awsAccountID);
    }
  }, [getOCMRoleResponse]);

  const handleRefresh = () => {
    clearGetOcmRoleResponse();
    change('rosa_roles_provider_creation_mode', undefined);
    track(trackEvents.OCMRoleRefreshed);
  };

  const handleCreationModeChange = (_, value) => {
    // Going to Next step and Back, triggers this onChange with value undefined?!
    if (value) {
      change('rosa_roles_provider_creation_mode', value);
      track(trackEvents.RosaCreationMode, {
        customProperties: {
          value,
        },
      });
    }
  };

  const EnableAutoModeTip = (
    <Alert
      className="pf-u-ml-lg"
      variant="info"
      isInline
      isExpandable
      title="If you would like to enable auto mode, expand the alert and follow the steps below."
    >
      <TextContent className="ocm-alert-text">
        <Text component={TextVariants.p} className="pf-u-mb-sm">
          Create the Admin OCM role using the following command in the ROSA CLI. Only one OCM role
          can be linked per Red Hat org.{' '}
          <PopoverHint title="If an OCM role with basic privileges exists in your account, you might need to delete or unlink the role before creating an OCM role with administrative privileges." />
        </Text>
        <InstructionCommand
          textAriaLabel="Copyable ROSA create ocm-role command"
          trackEvent={trackEvents.CopyOCMRoleCreateAdmin}
        >
          rosa create ocm-role --admin
        </InstructionCommand>
        <Text component={TextVariants.p} className="pf-u-mb-sm">
          If not yet linked, run the following command to associate the OCM role with your AWS{' '}
          account.
        </Text>
        <InstructionCommand
          textAriaLabel="Copyable ROSA link ocm-role command"
          trackEvent={trackEvents.CopyOCMRoleLink}
        >
          rosa link ocm-role &lt;arn&gt;
        </InstructionCommand>
        <Text component={TextVariants.p} className="pf-u-mb-sm">
          After running the command, you may need to refresh using the button below to enable auto
          mode.
        </Text>
        <Button onClick={handleRefresh} variant="secondary">
          Refresh to enable auto mode
        </Button>
      </TextContent>
    </Alert>
  );

  const roleModeOptions = [
    {
      value: roleModes.MANUAL,
      label: 'Manual',
      description: (
        <>
          You can choose from two options to manually generate the necessary roles and policies for
          your cluster operators and the OIDC provider: ROSA CLI commands, or AWS CLI commands.{' '}
          <strong>
            You must complete one of those options after cluster review for your cluster to complete
            installation.
          </strong>
        </>
      ),
    },
    {
      disabled: !isAutoModeAvailable,
      value: roleModes.AUTO,
      label: 'Auto',
      description:
        'Immediately create the necessary cluster operator roles and OIDC provider. This mode requires an admin privileged OCM role.',
      extraField: getOCMRoleResponse.fulfilled && !isAutoModeAvailable && EnableAutoModeTip,
    },
  ];
  return (
    <Form onSubmit={() => false}>
      <Grid hasGutter>
        <GridItem>
          <Title headingLevel="h3">Cluster roles and policies</Title>
        </GridItem>
        <GridItem>
          <Text component={TextVariants.p}>
            Choose the preferred mode for creating the operator roles and OIDC provider.{' '}
            <ExternalLink href={links.ROSA_AWS_IAM_ROLES}>Learn more about ROSA roles</ExternalLink>
          </Text>
        </GridItem>
        <ReduxHiddenCheckbox name="detected_ocm_role" />
        {getOCMRoleErrorBox && <GridItem>{getOCMRoleErrorBox}</GridItem>}
        {getOCMRoleResponse.pending && (
          <GridItem>
            <div className="spinner-fit-container">
              <Spinner />
            </div>
            <div className="spinner-loading-text pf-u-ml-xl">Checking for admin OCM role...</div>
          </GridItem>
        )}
        {getOCMRoleResponse.fulfilled && (
          <GridItem span={10}>
            <FormGroup isRequired fieldId="role_mode">
              <Field
                component={RadioButtons}
                name="rosa_roles_provider_creation_mode"
                className="radio-button"
                disabled={getOCMRoleResponse.pending}
                options={roleModeOptions}
                onChange={handleCreationModeChange}
                disableDefaultValueHandling
              />
            </FormGroup>
          </GridItem>
        )}
        <GridItem>
          <Title headingLevel="h3">Name operator roles</Title>
        </GridItem>
        <GridItem span={10}>
          <Text component={TextVariants.p}>
            To easily identify the Operator IAM roles for a cluster in your AWS account, the{' '}
            Operator role names are prefixed with your cluster name and a random 4-digit hash. You
            can optionally replace this prefix.
          </Text>
        </GridItem>
        <GridItem span={6}>
          <Field
            component={ReduxVerticalFormGroup}
            name="custom_operator_roles_prefix"
            label="Custom operator roles prefix"
            type="text"
            // eslint-disable-next-line import/no-named-as-default-member
            validate={validators.checkCustomOperatorRolesPrefix}
            helpText={`Maximum ${validators.MAX_CUSTOM_OPERATOR_ROLES_PREFIX_LENGTH} characters.  Changing the cluster name will regenerate this value.`}
            extendedHelpText={
              <TextContent>
                <Text component={TextVariants.p}>
                  You can specify a custom prefix for the cluster-specific Operator IAM roles to{' '}
                  use. <br />
                  See examples in{' '}
                  <ExternalLink href={links.ROSA_AWS_OPERATOR_ROLE_PREFIX}>
                    Defining a custom Operator IAM role prefix
                  </ExternalLink>
                </Text>
              </TextContent>
            }
            showHelpTextOnError={false}
          />
        </GridItem>
      </Grid>
    </Form>
  );
}

ClusterRolesScreen.propTypes = {
  change: PropTypes.func,
  awsAccountID: PropTypes.string,
  rosaCreationMode: PropTypes.string,
  customOperatorRolesPrefix: PropTypes.string,
  getOCMRole: PropTypes.func.isRequired,
  getOCMRoleResponse: PropTypes.func.isRequired,
  clearGetOcmRoleResponse: PropTypes.func.isRequired,
  clusterName: PropTypes.string,
};

export default ClusterRolesScreen;
