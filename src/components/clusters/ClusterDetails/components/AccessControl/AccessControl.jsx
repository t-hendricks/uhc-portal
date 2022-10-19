import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import { Tabs, Tab, TabTitleText, Card, CardBody } from '@patternfly/react-core';

import OCMRolesSection from './OCMRolesSection';
import UsersSection from './UsersSection';
import IDPSection from './IDPSection';
import NetworkSelfServiceSection from './NetworkSelfServiceSection';
import clusterStates, { isHibernating } from '../../../common/clusterStates';
import { subscriptionStatuses } from '../../../../../common/subscriptionTypes';

function AccessControl({
  cluster,
  clusterConsoleURL,
  cloudProvider,
  history,
  refreshEvent = null,
}) {
  const [activeKey, setActiveKey] = React.useState(0);

  // class for whether display vetical tabs (wider screen)
  const [isVerticalTab, setIsVerticalTab] = useState(true);
  const [tabClass, setTabClass] = useState('');

  // class for whether display tab titles (hide when there's single tab)
  const [bodyClass, setBodyClass] = useState('');

  // states based on the cluster
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [clusterRolesAndAccessIsHidden, setClusterRolesAndAccessIsHidden] = useState(false);
  const [identityProvidersIsHidden, setIdentityProvidersIsHidden] = useState(false);
  const [AWSInfrastructureAccessIsHidden, setAWSInfrastructureAccessIsHidden] = useState(false);

  // dyanmically adjust the tab to be vertical (wider screen) or on the top
  useEffect(() => {
    const minWidthQuery = window.matchMedia ? window.matchMedia('(min-width: 768px)') : null;
    const handler = (e) => {
      if (e.matches) {
        setIsVerticalTab(true);
        setTabClass('');
      } else {
        setIsVerticalTab(false);
        // add the class for displaying the arrow buttons at the end of tab bar
        setTabClass('pf-m-scrollable');
      }
    };
    if (window.matchMedia) {
      // use vertical tab if it's larger than the min-width
      handler(minWidthQuery);
      minWidthQuery.addEventListener('change', handler);
    }
    return () => {
      if (minWidthQuery) {
        minWidthQuery.removeEventListener('change', handler);
      }
    };
  }, []);

  useEffect(() => {
    setIsReadOnly(cluster?.status?.configuration_mode === 'read_only');
    const isClusterReady = cluster.state === clusterStates.READY;
    const isArchived =
      get(cluster, 'subscription.status', false) === subscriptionStatuses.ARCHIVED ||
      get(cluster, 'subscription.status', false) === subscriptionStatuses.DEPROVISIONED;
    const isManagedAndReady =
      cluster.managed &&
      get(cluster, 'console.url') &&
      (isClusterReady || isHibernating(cluster.state)) &&
      !isArchived;
    // hide the tab title if there only one tab - "OCM Roles and Access".
    if (isManagedAndReady) {
      setBodyClass('');
    } else {
      setBodyClass('single-tab');
    }
    setClusterRolesAndAccessIsHidden(!isManagedAndReady);
    setIdentityProvidersIsHidden(!isManagedAndReady);
    setAWSInfrastructureAccessIsHidden(
      !isManagedAndReady || cloudProvider !== 'aws' || get(cluster, 'ccs.enabled', false),
    );
  }, [cluster]);

  return (
    <Card>
      <CardBody id="cluster-details-access-control-tab-contents" className={bodyClass}>
        <Tabs
          activeKey={activeKey}
          onSelect={(event, key) => setActiveKey(key)}
          isVertical={isVerticalTab}
          className={tabClass}
          isBox
        >
          <Tab
            eventKey={0}
            title={<TabTitleText>Identity providers</TabTitleText>}
            isHidden={identityProvidersIsHidden}
          >
            <IDPSection
              clusterID={get(cluster, 'id')}
              history={history}
              clusterConsoleURL={clusterConsoleURL}
              canEdit={cluster.canEdit}
              clusterHibernating={isHibernating(cluster.state)}
              isReadOnly={isReadOnly}
            />
          </Tab>
          <Tab
            eventKey={1}
            title={<TabTitleText>Cluster Roles and Access</TabTitleText>}
            isHidden={clusterRolesAndAccessIsHidden}
          >
            <UsersSection
              cluster={cluster}
              clusterHibernating={isHibernating(cluster.state)}
              isReadOnly={isReadOnly}
            />
          </Tab>
          <Tab eventKey={2} title={<TabTitleText>OCM Roles and Access</TabTitleText>}>
            <OCMRolesSection
              subscription={cluster.subscription}
              canEditOCMRoles={cluster.canEditOCMRoles}
              canViewOCMRoles={cluster.canViewOCMRoles}
              refreshEvent={refreshEvent}
            />
          </Tab>
          <Tab
            eventKey={3}
            isHidden={AWSInfrastructureAccessIsHidden}
            title={<TabTitleText>AWS infrastructure access</TabTitleText>}
          >
            <NetworkSelfServiceSection
              clusterID={get(cluster, 'id')}
              canEdit={cluster.canEdit}
              clusterHibernating={isHibernating(cluster.state)}
              isReadOnly={isReadOnly}
            />
          </Tab>
        </Tabs>
      </CardBody>
    </Card>
  );
}

AccessControl.propTypes = {
  cluster: PropTypes.object.isRequired,
  clusterConsoleURL: PropTypes.string.isRequired,
  cloudProvider: PropTypes.string.isRequired,
  history: PropTypes.object,
  refreshEvent: PropTypes.object,
};

export default AccessControl;
