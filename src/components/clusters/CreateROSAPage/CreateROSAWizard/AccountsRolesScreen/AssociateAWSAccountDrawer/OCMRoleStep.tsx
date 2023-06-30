import React from 'react';
import { Alert, AlertVariant, Text, TextVariants, Title } from '@patternfly/react-core';
import InstructionCommand from '~/components/common/InstructionCommand';
import { RosaCliCommand } from '../constants/cliCommands';
import PopoverHintWithTitle from '~/components/common/PopoverHintWithTitle';
import ExternalLink from '~/components/common/ExternalLink';
import links from '~/common/installLinks.mjs';
import { trackEvents } from '~/common/analytics';
import AssociateAWSAccountStep from './common/AssociateAWSAccountStep';
import ToggleGroupTabs from './common/ToggleGroupTabs';

type OCMRoleStepProps = {
  title: string;
};

const OCMRoleStep = ({ title }: OCMRoleStepProps) => (
  <AssociateAWSAccountStep title={title} contentId="AssociateAWSAccountOCMRoleStep">
    <Title headingLevel="h4" className="pf-u-mb-md" size="md">
      First, check if a role exists and is linked with:
    </Title>

    <InstructionCommand
      textAriaLabel={`Copyable ROSA ${RosaCliCommand.ListOcmRole} command`}
      className="pf-u-mb-lg"
    >
      {RosaCliCommand.ListOcmRole}
    </InstructionCommand>

    <Alert
      variant={AlertVariant.info}
      isInline
      isPlain
      title="If there is an existing role and it's already linked to your Red Hat account, you can continue to step 2."
      className="pf-u-mb-lg"
    />

    <Title headingLevel="h3" size="md">
      Next, is there an existing role that isn&apos;t linked?
    </Title>

    <PopoverHintWithTitle
      title="Why do I need to link my account?"
      bodyContent={
        <>
          The link creates a trust policy between the role and the link cluster installer.{' '}
          <ExternalLink href={links.ROSA_AWS_ACCOUNT_ASSOCIATION} noIcon>
            Review the AWS policy permissions for the basic and admin OCM roles.
          </ExternalLink>
        </>
      }
    />
    <ToggleGroupTabs
      tabs={[
        {
          title: 'No, create new role',
          body: (
            <>
              <strong>Basic OCM role</strong>
              <InstructionCommand
                textAriaLabel="Copyable ROSA create ocm-role"
                trackEvent={trackEvents.CopyOCMRoleCreateBasic}
              >
                {RosaCliCommand.OcmRole}
              </InstructionCommand>
              <div className="pf-u-mt-md pf-u-mb-md">OR</div>
              <strong>Admin OCM role</strong>
              <InstructionCommand
                textAriaLabel="Copyable ROSA create ocm-role --admin"
                trackEvent={trackEvents.CopyOCMRoleCreateAdmin}
              >
                {RosaCliCommand.AdminOcmRole}
              </InstructionCommand>
              <PopoverHintWithTitle
                title="Help me decide"
                bodyContent={
                  <>
                    <Text component={TextVariants.p} className="pf-u-mb-md">
                      The <strong>basic role</strong> enables OpenShift Cluster Manager to detect
                      the AWS IAM roles and policies required by ROSA.
                    </Text>
                    <Text component={TextVariants.p}>
                      The <strong>admin role</strong> also enables the detection of the roles and
                      policies. In addition, the admin role enables automatic deployment of the
                      cluster-specific Operator roles and OpenID Connect (OIDC) provider by using
                      OpenShift Cluster Manager.
                    </Text>
                  </>
                }
              />
            </>
          ),
        },
        {
          title: 'Yes, link existing role',
          body: (
            <>
              <strong> If a role exists but is not linked, link it with:</strong>
              <InstructionCommand
                textAriaLabel={`Copyable ${RosaCliCommand.LinkOcmRole} command`}
                trackEvent={trackEvents.CopyOCMRoleLink}
              >
                {RosaCliCommand.LinkOcmRole}
              </InstructionCommand>
              <Alert
                variant={AlertVariant.info}
                isInline
                isPlain
                className="ocm-instruction-block_alert pf-u-mt-lg"
                title="You must have organization administrator privileges in your Red Hat account to run this command. After you link the OCM role with your Red Hat organization, it is visible for all users in the organization."
              />
            </>
          ),
        },
      ]}
    />
  </AssociateAWSAccountStep>
);

export default OCMRoleStep;
