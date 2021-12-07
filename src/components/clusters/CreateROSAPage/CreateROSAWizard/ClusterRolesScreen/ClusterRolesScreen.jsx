import React from 'react';
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
import InstructionCommand from '../../../../common/InstructionCommand';
import RadioButtons from '../../../../common/ReduxFormComponents/RadioButtons';
import ReduxVerticalFormGroup from '../../../../common/ReduxFormComponents/ReduxVerticalFormGroup';
import validators from '../../../../../common/validators';

function ClusterRolesScreen() {
  const onRoleModeChange = (_, value) => {
    // eslint-disable-next-line no-console
    console.log('value', value);
  };
  const roleModes = {
    MANUAL: 'manual',
    AUTO: 'auto',
  };
  // temp hard code this value
  const isAutoModeAvailable = false;
  const roleModeOptions = [
    {
      // disabled: someCondition,
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
                    <strong>Step 1:</strong>
                    {' '}
                    Create the Admin OCM role using the following command in the ROSA CLI.
                  </Text>
                  <InstructionCommand textAriaLabel="Copyable ROSA create ocm-role command">
                    rosa create ocm-role --admin
                  </InstructionCommand>
                </TextListItem>
                <TextListItem className="pf-u-mb-sm">
                  <Text component={TextVariants.p} className="pf-u-mb-sm">
                    <strong>Step 2:</strong>
                    {' '}
                    Associate the OCM role with the AWS account using the following command in the
                    ROSA CLI.
                  </Text>
                  <InstructionCommand textAriaLabel="Copyable ROSA link ocm-role command">
                    rosa link ocm-role --arn &lt;arn&gt;
                  </InstructionCommand>
                </TextListItem>
                <TextListItem>
                  <Text component={TextVariants.p} className="pf-u-mb-sm">
                    <strong>Step 3:</strong>
                    {' '}
                    After running the command you may need to refresh using the button below to
                    enable auto mode.
                  </Text>
                  {/* TODO: add correct refresh action */}
                  <Button onClick={() => console.log('refresh')} variant="secondary">
                    Refresh to enable auto mode
                  </Button>
                </TextListItem>
              </TextList>
            </Alert>
          </GridItem>
        )}
        <GridItem xl2={8}>
          <FormGroup
            isRequired
            fieldId="role_mode"
          >
            <Field
              component={RadioButtons}
              name="role_mode"
              className="radio-button"
              // disabled={pending}
              onChange={onRoleModeChange}
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
};

export default ClusterRolesScreen;
