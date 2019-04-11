import React from 'react';
import PropTypes from 'prop-types';

import {
  OverlayTrigger, Tooltip, Button, Icon,
} from 'patternfly-react';

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
    const { id, refreshFunc, classOptions } = this.props;

    return (
      <OverlayTrigger
        overlay={<Tooltip id={id}>Refresh</Tooltip>}
        placement="bottom"
      >
        <Button bsStyle="default" className={classOptions} onClick={refreshFunc}>
          <Icon name="refresh" type="fa" />
        </Button>
      </OverlayTrigger>
    );
  }
}

RefreshBtn.propTypes = {
  id: PropTypes.string.isRequired,
  classOptions: PropTypes.string,
  refreshFunc: PropTypes.func.isRequired,
  autoRefresh: PropTypes.bool,
};

RefreshBtn.defaultProps = {
  classOptions: '',
};

export default RefreshBtn;
