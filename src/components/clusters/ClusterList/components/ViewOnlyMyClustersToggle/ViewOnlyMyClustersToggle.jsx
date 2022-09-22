import React from 'react';
import PropTypes from 'prop-types';
import { Button, Popover, Switch } from '@patternfly/react-core';
import { OutlinedQuestionCircleIcon } from '@patternfly/react-icons';

function ViewOnlyMyClustersToggle(props) {
  const { isChecked, onChange, bodyContent } = props;

  return (
    <Switch
      className="pf-u-align-items-center"
      id="view-only-my-clusters"
      aria-label="View only my clusters"
      label={
        <>
          <span>View only my clusters</span>
          <Popover bodyContent={bodyContent} enableFlip={false}>
            <Button variant="plain">
              <OutlinedQuestionCircleIcon />
            </Button>
          </Popover>
        </>
      }
      hasCheckIcon
      isChecked={isChecked}
      onChange={onChange}
    />
  );
}

ViewOnlyMyClustersToggle.propTypes = {
  isChecked: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  bodyContent: PropTypes.string,
};

ViewOnlyMyClustersToggle.defaultProps = {
  isChecked: false,
  bodyContent:
    'Show only the clusters you previously created, or all clusters in your organization.',
};

export default ViewOnlyMyClustersToggle;
