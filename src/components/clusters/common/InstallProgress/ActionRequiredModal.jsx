import React from 'react';
import PropTypes from 'prop-types';
import {
  Modal,
  ModalVariant,
  Stack,
  StackItem,
  Tab,
  TabContent,
  TabTitleText,
  Tabs,
  TextContent,
  Text,
  TextVariants,
  ClipboardCopy,
  ClipboardCopyVariant,
} from '@patternfly/react-core';
import {
  isHypershiftCluster,
  isWaitingROSAManualMode,
  isWaitingForOIDCProviderOrOperatorRolesMode,
} from '../clusterStates';
// import CloudFormationTab from './CloudFormationTab';
import AWSCLITab from './AWSCLITab';
import ROSACLITab from './ROSACLITab';

const ROSA_CLI_TAB_INDEX = 1;
const AWS_CLI_TAB_INDEX = 2;

function ActionRequiredModal({ cluster, isOpen, onClose }) {
  const isWaitingAndROSAManual = isWaitingROSAManualMode(cluster);
  const isHCPCluster = isHypershiftCluster(cluster);
  const isWaitingForOIDCProviderOrOperatorRoles =
    isWaitingForOIDCProviderOrOperatorRolesMode(cluster);
  const [activeTab, setActiveTab] = React.useState(ROSA_CLI_TAB_INDEX);

  const createByOIDCId = (cluster) => {
    const oidcConfigID = cluster.aws.sts?.oidc_config?.id;
    const operatorRolePrefix = cluster.aws?.sts?.operator_role_prefix;
    const operatorRolesCliCommand = `rosa create operator-roles ${
      isHCPCluster ? '--hosted-cp' : ''
    } --prefix "${operatorRolePrefix}" --oidc-config-id "${oidcConfigID}"`;
    const oidcProviderCliCommand = `rosa create oidc-provider --oidc-config-id "${oidcConfigID}"`;

    return (
      <Stack hasGutter>
        <StackItem>
          <TextContent className="pf-u-pb-md">
            <Text component={TextVariants.p}>
              Your cluster will proceed to ready state only after the operator roles and OIDC
              provider are created.
            </Text>
            <Text component={TextVariants.p}>
              To create the operator roles, run the following command:
            </Text>
            <ClipboardCopy
              textAriaLabel="Copyable ROSA create operator-roles"
              variant={ClipboardCopyVariant.expansion}
              isReadOnly
            >
              {operatorRolesCliCommand}
            </ClipboardCopy>
          </TextContent>
        </StackItem>
        <StackItem>
          <TextContent className="pf-u-pb-md">
            <Text component={TextVariants.p}>
              {' '}
              To create an OIDC provider, run the following command:
            </Text>
            <ClipboardCopy
              textAriaLabel="Copyable ROSA OIDC provider"
              variant={ClipboardCopyVariant.expansion}
              isReadOnly
            >
              {oidcProviderCliCommand}
            </ClipboardCopy>
          </TextContent>
        </StackItem>
      </Stack>
    );
  };

  const createInteractively = (
    <Stack hasGutter>
      <StackItem>
        You must create the <b>operator roles</b> and <b>OIDC provider</b> to complete cluster
        installation.
      </StackItem>
      <StackItem>Use one of the following methods:</StackItem>
      <StackItem>
        <Tabs activeKey={activeTab} onSelect={(_, tab) => setActiveTab(tab)} isBox>
          {/* Hide the CloudFormation tab until the templates are published to a URL.
            <Tab
              eventKey={0}
              title={<TabTitleText>AWS CloudFormation</TabTitleText>}
              tabContentId="cloudformation"
            />
            */}
          <Tab
            eventKey={ROSA_CLI_TAB_INDEX}
            title={<TabTitleText>ROSA CLI</TabTitleText>}
            tabContentId="rosa-cli"
          />
          <Tab
            eventKey={AWS_CLI_TAB_INDEX}
            title={<TabTitleText>AWS CLI</TabTitleText>}
            tabContentId="aws-cli"
          />
        </Tabs>
      </StackItem>
      <StackItem>
        {/* Hide the CloudFormation tab until the templates are published to a URL.
          <TabContent
            key={0}
            eventKey={0}
            id="cloudformation"
            activeKey={activeTab}
            hidden={activeTab !== 0}
          >
            <CloudFormationTab cluster={cluster} />
          </TabContent>
          */}
        <TabContent
          key={ROSA_CLI_TAB_INDEX}
          eventKey={ROSA_CLI_TAB_INDEX}
          id="rosa-cli"
          activeKey={activeTab}
          hidden={activeTab !== ROSA_CLI_TAB_INDEX}
        >
          <ROSACLITab cluster={cluster} />
        </TabContent>
        <TabContent
          key={AWS_CLI_TAB_INDEX}
          eventKey={AWS_CLI_TAB_INDEX}
          id="aws-cli"
          activeKey={activeTab}
          hidden={activeTab !== AWS_CLI_TAB_INDEX}
        >
          <AWSCLITab cluster={cluster} />
        </TabContent>
      </StackItem>
      <StackItem>
        The options above will be available until the operator roles and OIDC provider are detected.
      </StackItem>
    </Stack>
  );

  return (
    <Modal
      title="Action required to continue installation"
      isOpen={isOpen}
      onClose={onClose}
      variant={ModalVariant.medium}
    >
      {isWaitingAndROSAManual && createInteractively}
      {isWaitingForOIDCProviderOrOperatorRoles && createByOIDCId(cluster)}
    </Modal>
  );
}

ActionRequiredModal.propTypes = {
  cluster: PropTypes.object.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ActionRequiredModal;
