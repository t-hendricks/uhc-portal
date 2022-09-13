import React from 'react';
import PropTypes from 'prop-types';
import { Button, Popover, Switch } from '@patternfly/react-core';
import { OutlinedQuestionCircleIcon } from '@patternfly/react-icons';

function ViewOnlyMyClustersToggle(props) {
  const {
    isChecked,
    onChange,
  } = props;

  return (
    <Switch
      className="pf-u-align-items-center"
      id="view-only-my-clusters"
      aria-label="View only my clusters"
      label={(
        <>
          <span>View only my clusters</span>
          <Popover
            bodyContent="Show only the clusters you previously archived, or all archived clusters in your organization."
            enableFlip={false}
          >
            <Button variant="plain">
              <OutlinedQuestionCircleIcon />
            </Button>
          </Popover>
        </>
      )}
      hasCheckIcon
      isChecked={isChecked}
      onChange={onChange}
    />
  );
}

ViewOnlyMyClustersToggle.propTypes = {
  isChecked: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
};

ViewOnlyMyClustersToggle.defaultProps = {
  isChecked: false,
};

export default ViewOnlyMyClustersToggle;
