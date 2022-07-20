import React from 'react';
import PropTypes from 'prop-types';
import {
  Alert, AlertActionLink, ExpandableSection, Grid, GridItem, Text, TextContent, TextVariants,
} from '@patternfly/react-core';
import { trackEventsKeys } from '~/common/helpers';
import PopoverHint from '../../../../common/PopoverHint';
import InstructionCommand from '../../../../common/InstructionCommand';
import { rosaOcmRoleCLICommands } from './AssociateAWSAccountModal/OCMRoleScreen/OCMRoleScreen';

function ErrorNoOCMRole({
  message, response, variant = 'danger', openOcmRoleInstructionsModal,
}) {
  return (
    <Alert variant={variant} isInline title={message} className="error-box">
      <TextContent className="ocm-alert-text">
        <Text component={TextVariants.p} className="pf-u-mb-sm">
          Create and link an OCM role with your Red Hat organization to proceed.
        </Text>
        <Text component={TextVariants.p} className="pf-u-mb-sm">
          <strong>To create an OCM role, run the following command:</strong>
        </Text>
        <Grid>
          <GridItem sm={12} md={5}>
            <strong>
              Basic OCM role
              {' '}
              <PopoverHint
                bodyContent="One basic OCM role is needed per Red Hat organization to allow OpenShift Cluster Manager to detect the presence of AWS roles and policies required for ROSA."
              />
            </strong>
            <InstructionCommand textAriaLabel="Copyable ROSA create ocm-role" trackEventsKey={trackEventsKeys.CopyOcmRoleCreateBasic}>
              {rosaOcmRoleCLICommands.ocmRole}
            </InstructionCommand>
          </GridItem>
          <GridItem sm={12} md={1} className="ocm-wizard-or-container">
            <p>
              OR
            </p>
          </GridItem>
          <GridItem sm={12} md={6}>
            <strong>
              Admin OCM role
              {' '}
              <PopoverHint
                bodyContent="The admin OCM role enables a fully automated deployment, otherwise, you will be notified to create additional objects manually during deployment"
              />
            </strong>
            <InstructionCommand textAriaLabel="Copyable ROSA create ocm-role --admin" trackEventsKey={trackEventsKeys.CopyOcmRoleCreateAdmin}>
              {rosaOcmRoleCLICommands.adminOcmRole}
            </InstructionCommand>
          </GridItem>
        </Grid>
        <br />
        <Text component={TextVariants.p}>
          If a role exists but is not linked, link it with:
        </Text>
        <Grid>
          <GridItem sm={7} md={5}>
            <InstructionCommand textAriaLabel="Copyable ROSA create ocm-role --arn" trackEventsKey={trackEventsKeys.CopyOcmRoleLink}>
              {rosaOcmRoleCLICommands.linkOcmRole}
            </InstructionCommand>
          </GridItem>
          <GridItem sm={1} md={1}>
            <PopoverHint
              iconClassName="ocm-instructions__command-help-icon"
              hint="Check if the role is linked to your
                      Red Hat organization by running the following command:"
              footer={(
                <InstructionCommand textAriaLabel="Copyable ROSA rosa list ocm-role">
                  rosa list ocm-role
                </InstructionCommand>
              )}
            />
          </GridItem>
        </Grid>
        <Text component={TextVariants.h6}>
          After creating and linking your OCM role, click
          {' '}
          <strong>Refresh ARNs</strong>
          {' '}
          to populate the ARN fields and continue creating your cluster.
        </Text>
        <AlertActionLink onClick={() => openOcmRoleInstructionsModal()}>
          See more information about configuring OCM roles
        </AlertActionLink>
      </TextContent>
      <br />
      <ExpandableSection toggleText="More details">
        <div>{response.errorMessage}</div>
        <span>{`Operation ID: ${response.operationID || 'N/A'}`}</span>
      </ExpandableSection>
    </Alert>
  );
}

ErrorNoOCMRole.propTypes = {
  message: PropTypes.string.isRequired,
  response: PropTypes.shape({
    errorMessage: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.node,
      PropTypes.element,
    ]).isRequired,
    errorDetails: PropTypes.array,
    operationID: PropTypes.string,
  }),
  variant: PropTypes.oneOf(['danger', 'warning']),
  openOcmRoleInstructionsModal: PropTypes.func.isRequired,
};

export default ErrorNoOCMRole;
