import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ErrorBox from '../../../common/ErrorBox';


class EditSubscriptionSettingsRequestState extends Component {
  componentDidUpdate() {
    const { requestState, onFulfilled } = this.props;
    if (requestState.fulfilled) {
      onFulfilled();
    }
  }

  render() {
    const { requestState } = this.props;
    if (requestState.error) {
      return <ErrorBox message="Error updating subscription settings" response={requestState} />;
    }
    return null;
  }
}

EditSubscriptionSettingsRequestState.propTypes = {
  requestState: PropTypes.object.isRequired,
  onFulfilled: PropTypes.func.isRequired,
};

export default EditSubscriptionSettingsRequestState;
