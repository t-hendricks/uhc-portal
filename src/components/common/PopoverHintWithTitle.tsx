import React from 'react';
import { Button, Popover, PopoverProps, Text, TextVariants } from '@patternfly/react-core';
import { OutlinedQuestionCircleIcon } from '@patternfly/react-icons';
import './PopoverHintWithTitle.scss';

interface PopoverHintProps extends Omit<PopoverProps, 'bodyContent'> {
  title?: string;
  footer?: React.ReactNode;
  bodyContent?: React.ReactNode | ((hide: () => void) => React.ReactNode);
}

const PopoverHintWithTitle = ({
  title,
  bodyContent,
  footer,
  ...popoverProps
}: PopoverHintProps) => (
  <div className="popover-with-title-div">
    <Text component={TextVariants.p}>
      <Popover bodyContent={bodyContent} footerContent={footer} aria-label="help" {...popoverProps}>
        <Button className="popover-with-title-button" aria-label="More information" variant="plain">
          <span className="popover-with-title-span">
            <OutlinedQuestionCircleIcon />
            {` ${title}`}
          </span>
        </Button>
      </Popover>
    </Text>
  </div>
);

PopoverHintWithTitle.defaultProps = {
  title: 'Understand the OCM role types',
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

export default PopoverHintWithTitle;
