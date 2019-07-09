import React from 'react';
import PropTypes from 'prop-types';

import {
  Button,
} from 'patternfly-react';
import { RedoIcon } from '@patternfly/react-icons';
import { Tooltip, TooltipPosition } from '@patternfly/react-core';


class RefreshBtn extends React.Component {
  constructor(props) {
    super(props);
    this.refreshTimerID = null;
    this.refreshTimer = this.refreshTimer.bind(this);
  }

  componentDidMount() {
    const { autoRefresh } = this.props;
    if (autoRefresh && this.refreshTimerID === null) {
      this.refreshTimerID = setInterval(this.refreshTimer, 60 * 1000);
    }
  }

  componentWillUnmount() {
    if (this.refreshTimerID !== null) {
      clearInterval(this.refreshTimerID);
    }
  }

  refreshTimer() {
    const { autoRefresh, refreshFunc } = this.props;
    // autoRefresh check allows refresh to be turned off or on during the lifetime of the component
    // visibilityState checks allows avoiding refreshes when the tab is not visible
    // "online" state check allows to avoid refreshes when the network is offline.
    if (autoRefresh && document.visibilityState === 'visible' && navigator.onLine) {
      refreshFunc();
    }
  }

  render() {
    const { refreshFunc, classOptions } = this.props;

    return (
      <Tooltip position={TooltipPosition.bottom} content="Refresh">
        <Button bsStyle="default" className={classOptions} onClick={refreshFunc}>
          <RedoIcon />
        </Button>
      </Tooltip>
    );
  }
}

RefreshBtn.propTypes = {
  classOptions: PropTypes.string,
  refreshFunc: PropTypes.func.isRequired,
  autoRefresh: PropTypes.bool,
};

RefreshBtn.defaultProps = {
  classOptions: '',
};

export default RefreshBtn;
