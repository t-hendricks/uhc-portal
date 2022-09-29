import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { PageSection, Card, Title, Alert } from '@patternfly/react-core';
import PageTitle from '../../common/PageTitle';

import TokenErrorAlert from './instructions/components/TokenErrorAlert';
import PullSecretSection from './instructions/components/PullSecretSection';

import { tollboothActions } from '../../../redux/actions';
import { scrollToTop } from '../../../common/helpers';
import ExternalLink from '../../common/ExternalLink';

class InstallPullSecretAzure extends Component {
  componentDidMount() {
    scrollToTop();
    document.title = 'Install OpenShift 4 | Pull Secret';

    const { dispatch } = this.props;
    dispatch(tollboothActions.createAuthToken());
  }

  render() {
    const { token } = this.props;
    const azureText =
      'Download or copy your pull secret. Your pull secret provides your Azure Red Hat OpenShift cluster with access to additional content provided by Red Hat.';
    const msDocLink =
      'https://docs.microsoft.com/en-us/azure/openshift/howto-add-update-pull-secret';
    return (
      <>
        <PageTitle title="Azure Red Hat OpenShift" />
        <PageSection className="ocp-instructions">
          <>
            <Title headingLevel="h3" size="2xl">
              Red Hat content access
            </Title>
            <Card>
              <div className="pf-l-grid pf-m-gutter ocm-page">
                {token.error && <TokenErrorAlert token={token} />}
                <div className="pf-c-content">
                  <h3 className="pf-c-title pf-m-md downloads-subtitle">Pull secret</h3>
                  <PullSecretSection token={token} text={azureText} />
                  <Alert
                    variant="info"
                    isInline
                    title="Connecting your cluster to OpenShift Cluster Manager"
                    className="bottom-alert"
                  >
                    <p>
                      Azure Red Hat OpenShift clusters do not connect to OpenShift Cluster Manager
                      at creation time. Follow the{' '}
                      <ExternalLink href={msDocLink}>Microsoft documentation</ExternalLink> if you
                      would like to enable telemetry as a day 2 operation.
                    </p>
                  </Alert>
                </div>
              </div>
            </Card>
          </>
        </PageSection>
      </>
    );
  }
}

InstallPullSecretAzure.propTypes = {
  token: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({ token: state.tollbooth.token });

export { InstallPullSecretAzure };

export default connect(mapStateToProps)(InstallPullSecretAzure);
