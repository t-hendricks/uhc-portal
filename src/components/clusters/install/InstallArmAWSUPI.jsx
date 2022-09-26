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

export class InstallArmAWSUPI extends Component {
  componentDidMount() {
    scrollToTop();
    document.title =
      'Install OpenShift 4 | Red Hat OpenShift Cluster Manager | AWS User-Provisioned ARM Infrastructure';

    const { dispatch } = this.props;
    dispatch(tollboothActions.createAuthToken());
  }

  render() {
    const { token } = this.props;
    const breadcrumbs = (
      <Breadcrumbs
        path={[
          { label: 'Clusters' },
          { label: 'Create', path: '/create' },
          { label: 'Amazon Web Services (ARM)', path: '/install/aws/arm' },
          { label: 'User-provisioned infrastructure' },
        ]}
      />
    );

    return (
      <>
        <PageTitle title={instructionsMapping.aws.arm.upi.title} breadcrumbs={breadcrumbs} />
        <PageSection>
          <OCPInstructions
            token={token}
            cloudProviderID="aws"
            isUPI
            {...instructionsMapping.aws.arm.upi}
          />
        </PageSection>
      </>
    );
  }
}

InstallArmAWSUPI.propTypes = {
  token: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({ token: state.tollbooth.token });

export default connect(mapStateToProps)(InstallArmAWSUPI);
