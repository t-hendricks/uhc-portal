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
} from '@patternfly/react-core';
// import CloudFormationTab from './CloudFormationTab';
import AWSCLITab from './AWSCLITab';
import ROSACLITab from './ROSACLITab';

function ActionRequiredModal({ cluster, isOpen, onClose }) {
  const [activeTab, setActiveTab] = React.useState(1);
  return (
    <Modal
      title="Action required to continue installation"
      isOpen={isOpen}
      onClose={onClose}
      variant={ModalVariant.medium}
    >
      <Stack hasGutter>
        <StackItem>
          You must create the
          {' '}
          <b>operator roles</b>
          {' '}
          and
          {' '}
          <b>OIDC provider</b>
          {' '}
          to complete cluster installation.
        </StackItem>
        <StackItem>Use one of the following methods:</StackItem>
        <StackItem>
          <Tabs
            activeKey={activeTab}
            onSelect={(_, tab) => setActiveTab(tab)}
            isBox
          >
            {/* Hide the CloudFormation tab until the templates are published to a URL.
            <Tab
              eventKey={0}
              title={<TabTitleText>AWS CloudFormation</TabTitleText>}
              tabContentId="cloudformation"
            />
            */}
            <Tab
              eventKey={1}
              title={<TabTitleText>AWS CLI</TabTitleText>}
              tabContentId="aws-cli"
            />
            <Tab
              eventKey={2}
              title={<TabTitleText>ROSA CLI</TabTitleText>}
              tabContentId="rosa-cli"
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
            key={1}
            eventKey={1}
            id="aws-cli"
            activeKey={activeTab}
            hidden={activeTab !== 1}
          >
            <AWSCLITab cluster={cluster} />
          </TabContent>
          <TabContent
            key={2}
            eventKey={2}
            id="rosa-cli"
            activeKey={activeTab}
            hidden={activeTab !== 2}
          >
            <ROSACLITab cluster={cluster} />
          </TabContent>
        </StackItem>
        <StackItem>
          The options above will be available until the operator roles and OIDC
          provider are detected.
        </StackItem>
      </Stack>
    </Modal>
  );
}

ActionRequiredModal.propTypes = {
  cluster: PropTypes.object.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ActionRequiredModal;
