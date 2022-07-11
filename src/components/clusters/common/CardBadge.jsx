import React from 'react';
import PropTypes from 'prop-types';
import { StarIcon } from '@patternfly/react-icons';
// eslint-disable-next-line camelcase
import { global_active_color_100 } from '@patternfly/react-tokens';
import { Label } from '@patternfly/react-core';

/** Intended to annotate a Card.
 * For stand-alone (Tech preview) with a popover explanation, see
   TechnologyPreview from assisted-ui-lib.
 */
function CardBadge({
  isRecommended, isDevPreview, isHidden, devPreviewText = 'Developer Preview',
}) {
  const className = isHidden ? 'card-badge card-badge-hidden' : 'card-badge';
  return (
    <div className="card-badge-container">
      <span className={className}>
        {isRecommended && <StarIcon color={global_active_color_100.value} />}
        {isRecommended && 'Recommended'}
        {isDevPreview && <Label variant="outline" color="orange">{devPreviewText}</Label>}
      </span>
    </div>
  );
}

CardBadge.propTypes = {
  isRecommended: PropTypes.bool,
  isDevPreview: PropTypes.bool,
  isHidden: PropTypes.bool,
  devPreviewText: PropTypes.string,
};

export default CardBadge;
