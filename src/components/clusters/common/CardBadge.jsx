import React from 'react';
import PropTypes from 'prop-types';
import { StarIcon, CodeIcon } from '@patternfly/react-icons';
// eslint-disable-next-line camelcase
import { global_warning_color_100, global_active_color_100 } from '@patternfly/react-tokens';

function CardBadge({ isRecommened, isDevPreview, isHidden }) {
  const className = isHidden ? 'card-badge card-badge-hidden' : 'card-badge';
  return (
    <div className="card-badge-container">
      <span className={className}>
        {isRecommened && <StarIcon color={global_active_color_100.value} />}
        {isDevPreview && <CodeIcon color={global_warning_color_100.value} /> }
        {isRecommened && 'Recommended'}
        {isDevPreview && 'Developer Preview'}
      </span>
    </div>
  );
}

CardBadge.propTypes = {
  isRecommened: PropTypes.bool,
  isDevPreview: PropTypes.bool,
  isHidden: PropTypes.bool,
};

export default CardBadge;
