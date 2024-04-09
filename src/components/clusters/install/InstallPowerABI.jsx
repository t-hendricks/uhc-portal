import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { PageSection } from '@patternfly/react-core';

import { AppPage } from '~/components/App/AppPage';

import { tollboothActions } from '../../../redux/actions';
import Breadcrumbs from '../../common/Breadcrumbs';
import PageTitle from '../../common/PageTitle';

import instructionsMapping from './instructions/instructionsMapping';
import OCPInstructions from './instructions/OCPInstructions';

export class InstallPowerABI extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(tollboothActions.createAuthToken());
  }

  render() {
    const { token } = this.props;
    const breadcrumbs = (
      <Breadcrumbs
        path={[
          { label: 'Clusters' },
          { label: 'Cluster Type', path: '/create' },
          { label: 'IBM Power (ppc64le)', path: '/install/power' },
          { label: 'Local Agent-based' },
        ]}
      />
    );

    return (
      <AppPage title="Install OpenShift 4 | Red Hat OpenShift Cluster Manager | IBM Power (ppc64le) Agent-based installer">
        <PageTitle title={instructionsMapping.baremetal.ppc.abi.title} breadcrumbs={breadcrumbs} />
        <PageSection>
          <OCPInstructions
            token={token}
            breadcrumbs={breadcrumbs}
            cloudProviderID="baremetal"
            installationTypeId="local-agent-based"
            {...instructionsMapping.baremetal.ppc.abi}
            isUPI
          />
        </PageSection>
      </AppPage>
    );
  }
}

InstallPowerABI.propTypes = {
  token: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({ token: state.tollbooth.token });

export default connect(mapStateToProps)(InstallPowerABI);
