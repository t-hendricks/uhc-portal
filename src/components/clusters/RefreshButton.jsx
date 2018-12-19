import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {
  OverlayTrigger, Tooltip, Button, Icon,
} from 'patternfly-react';

function RefreshBtn(props) {
  const { id, refreshFunc, classOptions } = props;

  return (
    <OverlayTrigger
      overlay={<Tooltip id={id}>Refresh</Tooltip>}
      placement="bottom"
    >
      <Button bsStyle="default" className={cx('refresh-btn', classOptions)} onClick={refreshFunc}>
        <Icon name="refresh" type="fa" />
      </Button>
    </OverlayTrigger>
  );
}

RefreshBtn.propTypes = {
  id: PropTypes.string.isRequired,
  classOptions: PropTypes.string,
  refreshFunc: PropTypes.func.isRequired,
};

RefreshBtn.defaultProps = {
  classOptions: '',
};

export default RefreshBtn;
