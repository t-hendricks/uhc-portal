import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { PageSection } from '@patternfly/react-core';

import { AppPage } from '~/components/App/AppPage';
import Breadcrumbs from '../../common/Breadcrumbs';
import { tollboothActions } from '../../../redux/actions';
import instructionsMapping from './instructions/instructionsMapping';
import OCPInstructions from './instructions/OCPInstructions';
import PageTitle from '../../common/PageTitle';

export class InstallAlibaba extends Component {
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
          { label: 'Alibaba Cloud' },
        ]}
      />
    );

    return (
      <AppPage title="Install OpenShift 4 | Red Hat OpenShift Cluster Manager | Alibaba Cloud">
        <PageTitle title={instructionsMapping.alibaba.title} breadcrumbs={breadcrumbs} />
        <PageSection>
          <OCPInstructions
            token={token}
            cloudProviderID="alibaba"
            customizations={instructionsMapping.alibaba.customizations}
            {...instructionsMapping.alibaba}
          />
        </PageSection>
      </AppPage>
    );
  }
}

InstallAlibaba.propTypes = {
  token: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({ token: state.tollbooth.token });

export default connect(mapStateToProps)(InstallAlibaba);
