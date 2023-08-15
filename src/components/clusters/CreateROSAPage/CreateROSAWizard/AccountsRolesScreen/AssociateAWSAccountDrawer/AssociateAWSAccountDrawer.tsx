import React, { PropsWithChildren, useContext, useEffect, useMemo } from 'react';

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
  PageSection,
} from '@patternfly/react-core';

import { trackEvents } from '~/common/analytics';
import useAnalytics from '~/hooks/useAnalytics';
import { AppDrawerContext } from '~/components/App/AppDrawer';
import OCMRoleStep from './OCMRoleStep';
import UserRoleStep from './UserRoleStep';
import AccountRoleStep from './AccountRoleStep';

type AssociateRolesDrawerProps = {
  onClose: () => void;
  isOpen: boolean;
};

const AssociateRolesDrawerContent = ({ onClose, isOpen }: AssociateRolesDrawerProps) => {
  const track = useAnalytics();
  const titleRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      track(trackEvents.AssociateAWS);
      if (titleRef.current) {
        titleRef.current.focus();
      }
    }
  }, [isOpen, titleRef, track]);

  return (
    <DrawerPanelContent isResizable>
      <DrawerHead>
        <Title headingLevel="h2" size="2xl">
          {/* span normally doesn't accept a tabIndex */}
          {/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */}
          <span tabIndex={isOpen ? 0 : -1} ref={titleRef}>
            How to associate a new AWS account
          </span>
        </Title>
        <DrawerActions>
          <DrawerCloseButton onClick={() => onClose()} />
        </DrawerActions>
      </DrawerHead>
      <DrawerPanelBody hasNoPadding>
        <PageSection variant="light" className="pf-u-py-0">
          <Text component={TextVariants.p}>
            ROSA cluster deployments use the AWS Security Token Service for added security. Run the
            following required steps from a CLI authenticated with both AWS and ROSA.
          </Text>
          <OCMRoleStep title="Step 1: OCM role" />
          <UserRoleStep title="Step 2: User role" />
          <AccountRoleStep title="Step 3: Account roles" />
        </PageSection>
        <PageSection variant="light" className="pf-u-pt-0 ">
          <Text component={TextVariants.p} className="pf-u-mb-lg pf-u-mr-md">
            After you&apos;ve completed all the steps, close this guide and choose your account.
          </Text>
          <Text component={TextVariants.p} className="pf-u-pb-lg">
            <Button
              variant={ButtonVariant.secondary}
              data-testid="close-associate-account-btn"
              onClick={() => onClose()}
            >
              Close
            </Button>
          </Text>
        </PageSection>
      </DrawerPanelBody>
    </DrawerPanelContent>
  );
};
const AssociateRolesDrawer: React.FC<
  PropsWithChildren<{
    isOpen: boolean;
    setIsOpen: (state: boolean | undefined) => void;
  }>
> = ({ isOpen, setIsOpen, children }) => {
  const appDrawerContext = useContext(AppDrawerContext);

  const panelContent = useMemo(
    () => (
      <AssociateRolesDrawerContent
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
      />
    ),
    [isOpen, setIsOpen],
  );

  useEffect(() => {
    if (isOpen) {
      const { openDrawer } = appDrawerContext;
      openDrawer({
        drawerPanelContent: panelContent,
      });
    } else {
      const { closeDrawer } = appDrawerContext;
      closeDrawer();
    }
  }, [appDrawerContext, isOpen]);

  return <>{children}</>;
};

export default AssociateRolesDrawer;
