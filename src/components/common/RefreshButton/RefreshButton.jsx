import React from 'react';
import PropTypes from 'prop-types';

import { RedoIcon } from '@patternfly/react-icons';
import { Tooltip, TooltipPosition, Button } from '@patternfly/react-core';

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
    const { autoRefresh, refreshFunc, isDisabled } = this.props;
    // autoRefresh check allows refresh to be turned off or on during the lifetime of the component
    // visibilityState checks allows avoiding refreshes when the tab is not visible
    // "online" state check allows to avoid refreshes when the network is offline.
    if (autoRefresh && document.visibilityState === 'visible' && navigator.onLine && !isDisabled) {
      refreshFunc();
    }
  }

  render() {
    const {
      refreshFunc,
      clickRefreshFunc,
      classOptions,
      isDisabled,
      ouiaId,
    } = this.props;

    const onClickFunc = clickRefreshFunc !== undefined ? clickRefreshFunc : refreshFunc;

    return (
      <Tooltip position={TooltipPosition.bottom} content="Refresh">
        <Button variant="plain" aria-label="Refresh" className={classOptions} onClick={onClickFunc} isAriaDisabled={isDisabled} ouiaId={ouiaId}>
          <RedoIcon />
        </Button>
      </Tooltip>
    );
  }
}

RefreshBtn.propTypes = {
  classOptions: PropTypes.string,
  refreshFunc: PropTypes.func.isRequired,
  clickRefreshFunc: PropTypes.func,
  autoRefresh: PropTypes.bool,
  isDisabled: PropTypes.bool,
  ouiaId: PropTypes.string,
};

RefreshBtn.defaultProps = {
  classOptions: '',
};

export default RefreshBtn;
