import React from 'react';
import PropTypes from 'prop-types';

const RuleFeedback = ruleID => (
  <div>
    <div>Is this rule helpful?</div>
    {/*<Button>Like</Button>*/}
    {/*<Button>Disike</Button>*/}
  </div>
);

RuleFeedback.propTypes = {
  ruleID: PropTypes.number,
};

export default RuleFeedback;
