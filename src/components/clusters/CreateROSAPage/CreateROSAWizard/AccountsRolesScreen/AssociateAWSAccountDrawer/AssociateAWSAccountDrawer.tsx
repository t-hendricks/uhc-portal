import React, { forwardRef, useCallback, useContext, useRef } from 'react';

import {
  Button,
  ButtonVariant,
  DrawerPanelContent,
  DrawerHead,
  DrawerActions,
  DrawerCloseButton,
  Text,
  TextVariants,
  Title,
  DrawerPanelBody,
  Stack,
  StackItem,
  PageSection,
} from '@patternfly/react-core';

import { trackEvents } from '~/common/analytics';
import useAnalytics from '~/hooks/useAnalytics';
import { AppDrawerContext, AppDrawerSettings } from '~/components/App/AppDrawer';
import OCMRoleStep from './OCMRoleStep';
import UserRoleStep from './UserRoleStep';
import AccountRoleStep from './AccountRoleStep';
import { AWSAccountRole } from './common/AssociateAWSAccountStep';

type AssociateRolesDrawerProps = {
  targetRole?: AWSAccountRole;
};

const AssociateRolesDrawerContent = forwardRef<HTMLInputElement, AssociateRolesDrawerProps>(
  ({ targetRole }, ref) => {
    const { closeDrawer } = useContext(AppDrawerContext);

    let title;
    let footer;
    switch (targetRole) {
      case 'ocm':
        title = 'Create OCM role';
        footer = (
          <>
            After you&apos;ve created the role, close this guide and click the{' '}
            <strong>Refresh</strong> button.
          </>
        );
        break;
      case 'user':
        title = 'Create user role';
        footer = "After you've created the role, close this guide and try again.";
        break;
      case 'account':
        title = 'Create account roles';
        footer = (
          <>
            After running the command, close this guide and click the <strong>Refresh ARNs</strong>{' '}
            button to populate the ARN fields.
          </>
        );
        break;
      default:
        title = 'How to associate a new AWS account';
        footer = "After you've completed all the steps, close this guide and choose your account.";
    }

    const allSteps = !targetRole;

    const onClick = useCallback(() => {
      closeDrawer();
    }, [closeDrawer]);

    return (
      <DrawerPanelContent isResizable>
        <DrawerHead>
          <Title headingLevel="h2" size="2xl">
            {/* span normally doesn't accept a tabIndex */}
            {/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */}
            <span tabIndex={0} ref={ref}>
              {title}
            </span>
          </Title>
          <DrawerActions>
            <DrawerCloseButton onClick={onClick} />
          </DrawerActions>
        </DrawerHead>
        <DrawerPanelBody hasNoPadding>
          <PageSection variant="light">
            <Stack hasGutter>
              <StackItem>
                <Text component={TextVariants.p}>
                  ROSA cluster deployments use the AWS Security Token Service for added security.
                  Run the following required steps from a CLI authenticated with both AWS and ROSA.
                </Text>
              </StackItem>
              {(allSteps || targetRole === 'ocm') && (
                <StackItem>
                  <OCMRoleStep title="Step 1: OCM role" expandable={allSteps} initiallyExpanded />
                </StackItem>
              )}
              {(allSteps || targetRole === 'user') && (
                <StackItem>
                  <UserRoleStep title="Step 2: User role" expandable={allSteps} />
                </StackItem>
              )}
              {(allSteps || targetRole === 'account') && (
                <StackItem>
                  <AccountRoleStep title="Step 3: Account roles" expandable={allSteps} />
                </StackItem>
              )}
              <StackItem>
                <Text component={TextVariants.p} className="pf-u-mr-md">
                  {footer}
                </Text>
              </StackItem>
              <StackItem>
                <Button
                  variant={ButtonVariant.secondary}
                  data-testid="close-associate-account-btn"
                  onClick={onClick}
                >
                  Close
                </Button>
              </StackItem>
            </Stack>
          </PageSection>
        </DrawerPanelBody>
      </DrawerPanelContent>
    );
  },
);

export const useAssociateAWSAccountDrawer = () => {
  const { openDrawer: openAppDrawer } = useContext(AppDrawerContext);
  const track = useAnalytics();

  const titleRef = useRef<HTMLInputElement>(null);

  const onExpand = useCallback(() => {
    if (titleRef.current) {
      titleRef.current.focus();
    }
  }, [titleRef]);

  const openDrawer = useCallback(
    (
      args: Omit<AppDrawerSettings, 'drawerProps' | 'drawerPanelContent'> & {
        targetRole?: AWSAccountRole;
      } = {},
    ) => {
      const { focusOnClose, onClose, targetRole } = args;
      track(trackEvents.AssociateAWS);
      openAppDrawer({
        drawerProps: { onExpand },
        drawerPanelContent: <AssociateRolesDrawerContent ref={titleRef} targetRole={targetRole} />,
        onClose,
        focusOnClose,
      });
    },
    [openAppDrawer],
  );
  return { openDrawer };
};
