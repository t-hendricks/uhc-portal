import React from 'react';
import PropTypes from 'prop-types';
import {
  Tabs,
  Tab,
  TabTitleText,
  TabTitleIcon,
  PageSection,
} from '@patternfly/react-core';
import { Spinner } from '@redhat-cloud-services/frontend-components';
import { ServerIcon, CloudIcon, LaptopIcon } from '@patternfly/react-icons';
import './CreateClusterPage.scss';
import PageTitle from '../../common/PageTitle';
import Breadcrumbs from '../common/Breadcrumbs';
import { shouldRefetchQuota } from '../../../common/helpers';
import DatacenterTab from './DatacenterTab';
import CloudTab from './CloudTab';
import SandboxTab from './SandboxTab';


class CreateCluster extends React.Component {
  state = { activeTabKey: 0 };

  componentDidMount() {
    // Try to get quota or organization when the component is first mounted.
    const { getOrganizationAndQuota, organization, getAuthToken } = this.props;

    document.title = 'Create an OpenShift cluster | Red Hat OpenShift Cluster Manager';
    if (shouldRefetchQuota(organization)) {
      getOrganizationAndQuota();
    }
    getAuthToken();
  }

    handleTabClick = (event, tabIndex) => {
      this.setState({
        activeTabKey: tabIndex,
      });
    };

    render() {
      const {
        hasOSDQuota, organization, token, assistedInstallerFeature,
      } = this.props;
      const { activeTabKey } = this.state;

      const title = (
        <PageTitle
          title="Create an OpenShift cluster"
          breadcrumbs={(
            <Breadcrumbs path={[
              { label: 'Clusters' },
              { label: 'Create' },
            ]}
            />
        )}
        />
      );

      const tabTitle = (tabKey) => {
        switch (tabKey) {
          case 0:
            return (
              <>
                <TabTitleIcon>
                  <ServerIcon />
                </TabTitleIcon>
                <TabTitleText>
                  Datacenter
                </TabTitleText>
              </>
            );
          case 1:
            return (
              <>
                <TabTitleIcon>
                  <CloudIcon />
                </TabTitleIcon>
                <TabTitleText>
                  Cloud
                </TabTitleText>
              </>
            );
          case 2:
            return (
              <>
                <TabTitleIcon>
                  <LaptopIcon />
                </TabTitleIcon>
                <TabTitleText>
                  Sandbox
                </TabTitleText>
              </>
            );
          default:
            return null;
        }
      };

      const quotaRequestComplete = organization.fulfilled || organization.error;

      return quotaRequestComplete ? (
        <>
          {title}
          <PageSection variant="light" className="cluster-create-page">
            <Tabs isFilled activeKey={activeTabKey} onSelect={this.handleTabClick}>
              <Tab eventKey={0} title={tabTitle(0)}>
                <DatacenterTab assistedInstallerFeature={assistedInstallerFeature} />
              </Tab>
              <Tab eventKey={1} title={tabTitle(1)}>
                <CloudTab hasOSDQuota={hasOSDQuota} />
              </Tab>
              <Tab eventKey={2} title={tabTitle(2)}>
                <SandboxTab token={token} />
              </Tab>
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
      );
    }
}

CreateCluster.propTypes = {
  hasOSDQuota: PropTypes.bool.isRequired,
  organization: PropTypes.shape({
    fulfilled: PropTypes.bool,
    error: PropTypes.bool,
  }).isRequired,
  getOrganizationAndQuota: PropTypes.func.isRequired,
  token: PropTypes.object.isRequired,
  getAuthToken: PropTypes.func.isRequired,
  assistedInstallerFeature: PropTypes.bool,
};

export default CreateCluster;
