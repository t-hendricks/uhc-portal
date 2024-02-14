import React from 'react';
import {
  Alert,
  Text,
  TextList,
  TextListItem,
  TextListVariants,
  TextVariants,
} from '@patternfly/react-core';
import { RosaCliCommand } from '~/components/clusters/wizards/rosa_v2/AccountsRolesScreen/constants/cliCommands';
import InstructionCommand from '../../../../../../common/InstructionCommand';

type RosaVersionErrorAlertProps = {
  isHypershiftSelected: boolean;
};

const RosaVersionErrorAlert = ({ isHypershiftSelected }: RosaVersionErrorAlertProps) => (
  <Alert
    className="pf-v5-u-ml-lg"
    variant="danger"
    isInline
    role="alert"
    title="There is no version compatible with the selected ARNs in previous step"
  >
    <TextList component={TextListVariants.ol} className="ocm-c-wizard-alert-steps">
      <TextListItem className="pf-v5-u-mb-sm">
        <Text component={TextVariants.p} className="pf-v5-u-mb-sm">
          Please select different ARNs or create new account roles using the following command in
          the ROSA CLI
        </Text>
      </TextListItem>
      <TextListItem className="pf-v5-u-mb-sm">
        <Text component={TextVariants.p} className="pf-v5-u-mb-sm">
          <InstructionCommand textAriaLabel="Copyable ROSA create account-roles command">
            {isHypershiftSelected
              ? RosaCliCommand.CreateAccountRolesHCP
              : RosaCliCommand.CreateAccountRoles}
          </InstructionCommand>
        </Text>
      </TextListItem>
    </TextList>
  </Alert>
);

export default RosaVersionErrorAlert;
