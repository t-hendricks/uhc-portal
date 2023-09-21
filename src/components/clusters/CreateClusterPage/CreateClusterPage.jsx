import React from 'react';
import PropTypes from 'prop-types';
import { Tabs, Tab, TabTitleText, TabTitleIcon, PageSection } from '@patternfly/react-core';

import { Spinner } from '@redhat-cloud-services/frontend-components/Spinner';
import { ServerIcon, CloudIcon, LaptopIcon } from '@patternfly/react-icons';
import { isRestrictedEnv } from '~/restrictedEnv';

import './CreateClusterPage.scss';
import { AppPage } from '~/components/App/AppPage';
import PageTitle from '../../common/PageTitle';
import Breadcrumbs from '../../common/Breadcrumbs';
import { shouldRefetchQuota } from '../../../common/helpers';
import DatacenterTab from './DatacenterTab';
import CloudTab from './CloudTab';
import LocalTab from './LocalTab';

const hashToTabIndex = {
  cloud: 0,
  datacenter: 1,
  local: 2,
};

const tabIndexToHash = Object.entries(hashToTabIndex).reduce((acc, tabIndex) => {
  const [key, value] = tabIndex;
  // eslint-disable-next-line no-param-reassign
  acc[value] = key;
  return acc;
}, {});

class CreateCluster extends React.Component {
  componentDidMount() {
    // Try to get quota or organization when the component is first mounted.
    const { getOrganizationAndQuota, organization, getAuthToken } = this.props;

    if (shouldRefetchQuota(organization)) {
      getOrganizationAndQuota();
    }
    getAuthToken();
  }

  handleTabClick = (event, tabIndex) => {
    const { history } = this.props;
    const tabHash = tabIndexToHash[tabIndex];
    history.push(`/create/${tabHash}`);
  };

  render() {
    const {
      hasOSDQuota,
      hasOSDTrialQuota,
      rosaCreationWizardFeature,
      organization,
      token,
      assistedInstallerFeature,
      activeTab,
    } = this.props;

    const activeTabIndex = hashToTabIndex[activeTab] || 0;

    const title = (
      <PageTitle
        title="Select an OpenShift cluster type to create"
        breadcrumbs={<Breadcrumbs path={[{ label: 'Clusters' }, { label: 'Cluster Type' }]} />}
      />
    );

    const tabTitle = (tabKey) => {
      switch (tabKey) {
        case 0:
          return (
            <>
              <TabTitleIcon>
                <CloudIcon />
              </TabTitleIcon>
              <TabTitleText>Cloud</TabTitleText>
            </>
          );
        case 1:
          return (
            <>
              <TabTitleIcon>
                <ServerIcon />
              </TabTitleIcon>
              <TabTitleText>Datacenter</TabTitleText>
            </>
          );
        case 2:
          return (
            <>
              <TabTitleIcon>
                <LaptopIcon />
              </TabTitleIcon>
              <TabTitleText>Local</TabTitleText>
            </>
          );
        default:
          return null;
      }
    };

    const quotaRequestComplete = organization.fulfilled || organization.error;

    return (
      <AppPage title="Create an OpenShift cluster | Red Hat OpenShift Cluster Manager">
        {quotaRequestComplete ? (
          <>
            {title}
            <PageSection variant="light" className="cluster-create-page">
              <Tabs isFilled activeKey={activeTabIndex} onSelect={this.handleTabClick}>
                {[
                  <Tab eventKey={0} title={tabTitle(0)}>
                    <CloudTab
                      hasOSDQuota={hasOSDQuota}
                      rosaCreationWizardFeature={rosaCreationWizardFeature}
                      trialEnabled={hasOSDTrialQuota}
                    />
                  </Tab>,
                  ...(isRestrictedEnv()
                    ? []
                    : [
                        <Tab eventKey={1} title={tabTitle(1)}>
                          <DatacenterTab assistedInstallerFeature={assistedInstallerFeature} />
                        </Tab>,
                        <Tab eventKey={2} title={tabTitle(2)}>
                          <LocalTab token={token} />
                        </Tab>,
                      ]),
                ]}
              </Tabs>
            </PageSection>
          </>
        ) : (
          <>
            {title}
            <PageSection variant="light">
              <Spinner centered />
            </PageSection>
          </>
        )}
      </AppPage>
    );
  }
}

CreateCluster.propTypes = {
  hasOSDQuota: PropTypes.bool.isRequired,
  hasOSDTrialQuota: PropTypes.bool.isRequired,
  rosaCreationWizardFeature: PropTypes.bool,
  organization: PropTypes.shape({
    fulfilled: PropTypes.bool,
    error: PropTypes.bool,
  }).isRequired,
  getOrganizationAndQuota: PropTypes.func.isRequired,
  token: PropTypes.object.isRequired,
  getAuthToken: PropTypes.func.isRequired,
  assistedInstallerFeature: PropTypes.bool,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  activeTab: PropTypes.string,
};

export default CreateCluster;
