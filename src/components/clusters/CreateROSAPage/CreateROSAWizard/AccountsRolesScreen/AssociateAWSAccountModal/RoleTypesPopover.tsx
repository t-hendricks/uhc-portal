import React from 'react';
import { Button, Popover, PopoverProps, Text, TextVariants } from '@patternfly/react-core';
import { OutlinedQuestionCircleIcon } from '@patternfly/react-icons';
import './RoleTypesPopover.scss';

interface PopoverHintProps extends Omit<PopoverProps, 'bodyContent'> {
  footer?: React.ReactNode;
  bodyContent?: React.ReactNode | ((hide: () => void) => React.ReactNode);
}
const RoleTypesPopover = ({ footer, bodyContent, ...popoverProps }: PopoverHintProps) => (
  <div className="roletypes-popover-div">
    <Text component={TextVariants.p}>
      <Popover bodyContent={bodyContent} footerContent={footer} aria-label="help" {...popoverProps}>
        <Button
          className="roletypes-popover-hint-button"
          aria-label="More information"
          variant="plain"
          color="#0066CC"
        >
          <span>
            <OutlinedQuestionCircleIcon color="#0066CC" />
          </span>
        </Button>
      </Popover>{' '}
      Understand the OCM role types
    </Text>
  </div>
);
RoleTypesPopover.defaultProps = {
  bodyContent: (
    <Text component={TextVariants.p}>
      The <strong>basic role</strong> enables OpenShift Cluster Manager to detect the AWS IAM roles
      and policies required by ROSA.
    </Text>
  ),
  footer: (
    <Text component={TextVariants.p}>
      The <strong>admin role</strong> also enables the detection of the roles and policies. In
      addition, the admin role enables automatic deployment of the cluster specific Operator roles
      and the OpenID Connect (OIDC) provider by using OpenShift Cluster Manager.
    </Text>
  ),
};
export default RoleTypesPopover;
