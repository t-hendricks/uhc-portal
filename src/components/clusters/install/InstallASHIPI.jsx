import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { PageSection } from '@patternfly/react-core';
import Breadcrumbs from '../../common/Breadcrumbs';
import { tollboothActions } from '../../../redux/actions';
import { scrollToTop } from '../../../common/helpers';
import instructionsMapping from './instructions/instructionsMapping';
import OCPInstructions from './instructions/OCPInstructions';
import PageTitle from '../../common/PageTitle';

export class InstallASHIPI extends Component {
  componentDidMount() {
    scrollToTop();
    document.title =
      'Install OpenShift 4 | Red Hat OpenShift Cluster Manager | Azure Stack Hub Installer-Provisioned Infrastructure';

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
          { label: 'Microsoft Azure Stack Hub', path: '/install/azure-stack-hub' },
          { label: 'Installer-provisioned infrastructure' },
        ]}
      />
    );

    return (
      <>
        <PageTitle title={instructionsMapping.ash.ipi.title} breadcrumbs={breadcrumbs} />
        <PageSection>
          <OCPInstructions
            token={token}
            cloudProviderID="ash"
            customizations={instructionsMapping.ash.customizations}
            {...instructionsMapping.ash.ipi}
          />
        </PageSection>
      </>
    );
  }
}

InstallASHIPI.propTypes = {
  token: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({ token: state.tollbooth.token });

export default connect(mapStateToProps)(InstallASHIPI);
