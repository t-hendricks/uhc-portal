import React from 'react';
import PropTypes from 'prop-types';
import { Split, SplitItem } from '@patternfly/react-core';

import DownloadPullSecret from '../DownloadPullSecret';
import CopyPullSecret from '../CopyPullSecret';

class PullSecretButtons extends React.Component {
  componentDidMount() {
    const { getAuthToken } = this.props;
    getAuthToken();
  }

  render() {
    const { token } = this.props;
    return (
      <Split hasGutter>
        <SplitItem>
          <CopyPullSecret token={token} text="Copy" variant="button" />
        </SplitItem>
        <SplitItem>
          <DownloadPullSecret token={token} text="Download" />
        </SplitItem>
      </Split>
    );
  }
}
PullSecretButtons.propTypes = {
  token: PropTypes.object.isRequired,
  getAuthToken: PropTypes.func.isRequired,
};

export default PullSecretButtons;
