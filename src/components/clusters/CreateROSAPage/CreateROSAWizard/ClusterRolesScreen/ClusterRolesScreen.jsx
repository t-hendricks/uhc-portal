import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';

import {
  Alert,
  Button,
  Form,
  FormGroup,
  Grid,
  GridItem,
  Text,
  TextList,
  TextListItem,
  TextListVariants,
  TextVariants,
  Title,
} from '@patternfly/react-core';

import ExternalLink from '../../../../common/ExternalLink';
import ErrorBox from '../../../../common/ErrorBox';
import InstructionCommand from '../../../../common/InstructionCommand';
import RadioButtons from '../../../../common/ReduxFormComponents/RadioButtons';
import ReduxVerticalFormGroup from '../../../../common/ReduxFormComponents/ReduxVerticalFormGroup';
import validators from '../../../../../common/validators';

function ClusterRolesScreen({
  change,
  awsAccountID,
  customOperatorRolesPrefix,
  getOCMRole,
  getOCMRoleResponse,
  clearGetOcmRoleResponse,
}) {
  const [isAutoModeAvailable, setIsAutoModeAvailable] = useState(false);
  const [getOCMRoleErrorBox, setGetOCMRoleErrorBox] = useState(null);

  const getRandomOperatorRolesPrefix = () => {
    // random 4 alphanumeric hash
    const prefixArray = Math.random().toString(36).substr(2, 4).split('');
    // cannot start with a number
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    const randomCharacter = alphabet[Math.floor(Math.random() * alphabet.length)];
    prefixArray[0] = randomCharacter;
    return prefixArray.join('');
  };

  // default custom_operator_roles_prefix to random 4 char hash, user can change
  // tried using initValues in the index, but was getting reload errors
  useEffect(() => {
    if (!customOperatorRolesPrefix) {
      change('custom_operator_roles_prefix', getRandomOperatorRolesPrefix());
    }
  }, []);

  useEffect(() => {
    if (getOCMRoleResponse.pending) {
      setGetOCMRoleErrorBox(null);
    } else if (getOCMRoleResponse.fulfilled) {
      change('rosa_creator_arn', getOCMRoleResponse.data?.arn);
      const isAdmin = getOCMRoleResponse.data?.isAdmin;
      setIsAutoModeAvailable(isAdmin);
      setGetOCMRoleErrorBox(null);
    } else if (getOCMRoleResponse.error) {
      // display error
      setGetOCMRoleErrorBox(<ErrorBox
        message="Error getting OCM role to determine administrator role"
        response={getOCMRoleResponse}
      />);
    } else {
      getOCMRole(awsAccountID);
    }
  }, [getOCMRoleResponse]);

  const handleRefresh = () => {
    clearGetOcmRoleResponse();
    getOCMRole(awsAccountID);
  };

  const roleModes = {
    MANUAL: 'manual',
    AUTO: 'auto',
  };
  const roleModeOptions = [
    {
      value: roleModes.MANUAL,
      label: 'Manual',
      description: 'Manual mode will offer three options to generate the necessary roles and policies for your cluster operators and the necessary OIDC provider: Cloudformation, ROSA CLI commands, or, AWS CLI commands. Exercise one of those options after cluster review in order for your cluster to complete installation.',
    },
    {
      disabled: !isAutoModeAvailable,
      value: roleModes.AUTO,
      label: 'Auto',
      description: 'Auto mode will immediately create the necessary cluster operator roles and OIDC provider. This mode requires that you provided an admin privileged role.',
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
            Choose the preferred mode for creating operator roles and OIDC provider.
            {' '}
            {/* TODO:  add href */}
            <ExternalLink href="#">Learn more about ROSA roles.</ExternalLink>
          </Text>
        </GridItem>
        {!isAutoModeAvailable && (
          <GridItem xl2={8}>
            <Alert
              variant="info"
              isInline
              isExpandable
              title="If you would like to enable auto mode expand the alert and follow the steps below."
            >
              <TextList component={TextListVariants.ol} className="ocm-c-wizard-alert-steps">
                <TextListItem className="pf-u-mb-sm">
                  <Text component={TextVariants.p} className="pf-u-mb-sm">
                    Create the Admin OCM role using the following command in the ROSA CLI.
                  </Text>
                  <InstructionCommand textAriaLabel="Copyable ROSA create ocm-role command">
                    rosa create ocm-role --admin
                  </InstructionCommand>
                </TextListItem>
                <TextListItem className="pf-u-mb-sm">
                  <Text component={TextVariants.p} className="pf-u-mb-sm">
                    {/* eslint-disable-next-line max-len */}
                    If not yet linked, run the following command to associate the OCM role with your AWS account.
                  </Text>
                  <InstructionCommand textAriaLabel="Copyable ROSA link ocm-role command">
                    rosa link ocm-role &lt;arn&gt;
                  </InstructionCommand>
                </TextListItem>
                <TextListItem>
                  <Text component={TextVariants.p} className="pf-u-mb-sm">
                    After running the command you may need to refresh using the button below to
                    enable auto mode.
                  </Text>
                  <Button onClick={handleRefresh} variant="secondary">
                    Refresh to enable auto mode
                  </Button>
                </TextListItem>
              </TextList>
            </Alert>
          </GridItem>
        )}
        {getOCMRoleErrorBox && (
          <GridItem>
            { getOCMRoleErrorBox }
          </GridItem>
        )}
        <GridItem xl2={8}>
          <FormGroup
            isRequired
            fieldId="role_mode"
          >
            <Field
              component={RadioButtons}
              name="rosa_roles_provider_creation_mode"
              className="radio-button"
              disabled={getOCMRoleResponse.pending}
              options={roleModeOptions}
              defaultValue={roleModes.MANUAL}
            />
          </FormGroup>
        </GridItem>
        <GridItem>
          <Title headingLevel="h3">Name operator roles</Title>
        </GridItem>
        <GridItem>
          <Text component={TextVariants.p}>
            The naming of your operator roles is derived from the name of your cluster.
            Optionally add a prefix to this naming scheme.
          </Text>
        </GridItem>
        <GridItem md={6} xl2={5}>
          <Field
            component={ReduxVerticalFormGroup}
            name="custom_operator_roles_prefix"
            label="Custom operator roles prefix"
            type="text"
            validate={validators.checkCustomOperatorRolesPrefix}
            // disabled={pending}
            helpText={`Maximum ${validators.MAX_CUSTOM_OPERATOR_ROLES_PREFIX_LENGTH} characters.`}
            // TODO: add correct popover text
            extendedHelpText="TBD"
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
  customOperatorRolesPrefix: PropTypes.string,
  getOCMRole: PropTypes.func.isRequired,
  getOCMRoleResponse: PropTypes.func.isRequired,
  clearGetOcmRoleResponse: PropTypes.func.isRequired,
};

export default ClusterRolesScreen;
