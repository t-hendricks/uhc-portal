import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { PageSection } from '@patternfly/react-core';
import Breadcrumbs from '../../common/Breadcrumbs';
import { tollboothActions } from '../../../redux/actions';
import instructionsMapping from './instructions/instructionsMapping';
import OCPInstructions from './instructions/OCPInstructions';
import PageTitle from '../../common/PageTitle';
import { AppPage } from '~/components/App/AppPage';

export class InstallArmAzureIPI extends Component {
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
          { label: 'Microsoft Azure (ARM)' /* , path: '/install/azure' */ },
          /* { label: 'Installer-provisioned infrastructure' }, */
        ]}
      />
    );

    return (
      <AppPage title="Install OpenShift 4 | Red Hat OpenShift Cluster Manager | Azure Installer-Provisioned ARM Infrastructure">
        <PageTitle title={instructionsMapping.azure.arm.ipi.title} breadcrumbs={breadcrumbs} />
        <PageSection>
          <OCPInstructions
            token={token}
            cloudProviderID="azure"
            customizations={instructionsMapping.azure.customizations}
            {...instructionsMapping.azure.arm.ipi}
          />
        </PageSection>
      </AppPage>
    );
  }
}

InstallArmAzureIPI.propTypes = {
  token: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({ token: state.tollbooth.token });

export default connect(mapStateToProps)(InstallArmAzureIPI);
