import React from 'react';
import PropTypes from 'prop-types';

import {
  OverlayTrigger, Tooltip, Button, Icon,
} from 'patternfly-react';

class RefreshBtn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshTimerID: null,
    };
    this.refreshTimer = this.refreshTimer.bind(this);
  }

  componentDidMount() {
    const { autoRefresh } = this.props;
    if (autoRefresh) {
      this.setState({ refreshTimerID: setInterval(this.refreshTimer, 60 * 1000) });
    }
  }

  componentWillUnmount() {
    const { refreshTimerID } = this.state;
    if (refreshTimerID !== null) {
      clearInterval(refreshTimerID);
    }
  }

  refreshTimer() {
    const { autoRefresh, refreshFunc } = this.props;
    // this check allows autoRefresh to be turned off or on during the lifetime of the component.
    if (autoRefresh) {
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
