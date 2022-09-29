import React, { Component } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import { Alert, AlertActionLink } from '@patternfly/react-core';

import { normalizedProducts, subscriptionStatuses } from '../../../../../common/subscriptionTypes';
import getTermsAppLink from '../../../../../common/getTermsAppLink';

class TermsAlert extends Component {
  componentDidMount() {
    const { selfTermsReview } = this.props;
    if (this.isTermsReviewRequired()) {
      selfTermsReview();
    }
  }

  componentDidUpdate(prevProps) {
    const { subscription: prevSubscription } = prevProps;
    const { subscription, selfTermsReview } = this.props;
    if (get(prevSubscription, 'id') !== get(subscription, 'id') && this.isTermsReviewRequired()) {
      selfTermsReview();
    }
  }

  getTncAppURL = (baseURL) => {
    // redirect back to the same page
    const currentHref = window.location.href;

    return getTermsAppLink(baseURL, currentHref, currentHref);
  };

  isTermsReviewRequired() {
    const { subscription } = this.props;
    const product = get(subscription, 'plan.type');
    const status = get(subscription, 'status');

    return (
      status !== subscriptionStatuses.DEPROVISIONED &&
      [normalizedProducts.OSD, normalizedProducts.RHMI, normalizedProducts.ROSA].includes(product)
    );
  }

  render() {
    const { selfTermsReviewResult } = this.props;

    if (
      this.isTermsReviewRequired() &&
      selfTermsReviewResult.fulfilled &&
      selfTermsReviewResult.terms_required
    ) {
      const tncAppURL = this.getTncAppURL(selfTermsReviewResult.redirect_url);
      const redirectToTerms = (
        <AlertActionLink key="terms-alert-link" component="a" href={tncAppURL}>
          View Terms and Conditions
        </AlertActionLink>
      );

      return (
        <Alert
          id="terms-alert"
          variant="warning"
          isInline
          title="You must accept the Terms and Conditions"
          actionLinks={redirectToTerms}
        >
          <p>Access to this cluster will be read-only until you accept the Terms and Conditions.</p>
        </Alert>
      );
    }

    return null;
  }
}

TermsAlert.propTypes = {
  subscription: PropTypes.object.isRequired,
  selfTermsReview: PropTypes.func.isRequired,
  selfTermsReviewResult: PropTypes.object.isRequired,
};

export default TermsAlert;
