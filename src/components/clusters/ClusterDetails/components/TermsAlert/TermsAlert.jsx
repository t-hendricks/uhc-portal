import React, { Component } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import { Alert, AlertActionLink } from '@patternfly/react-core';

import { subscriptionPlans, subscriptionStatuses } from '../../../../../common/subscriptionTypes';
import { buildUrlParams } from '../../../../../common/queryHelpers';

class TermsAlert extends Component {
  componentDidMount() {
    const { selfTermsReview } = this.props;
    if (this.isTermsReviewRquired()) {
      selfTermsReview();
    }
  }

  componentDidUpdate(prevProps) {
    const { subscription: prevSubscription } = prevProps;
    const { subscription, selfTermsReview } = this.props;
    if (get(prevSubscription, 'id') !== get(subscription, 'id') && this.isTermsReviewRquired()) {
      selfTermsReview();
    }
  }

  getTncAppURL = (baseURL) => {
    const currentHref = window.location.href;
    const params = {
      // redirect back to the same page
      redirect: currentHref,
      cancelRedirect: currentHref,
    };
    // baseURL contains params already.
    return `${baseURL}&${buildUrlParams(params)}`;
  };

  isTermsReviewRquired() {
    const { subscription } = this.props;
    const planID = get(subscription, 'plan.id');
    const status = get(subscription, 'status');

    return status !== subscriptionStatuses.DEPROVISIONED && (
      planID === subscriptionPlans.OSD
      || planID === subscriptionPlans.MOA
      || planID === subscriptionPlans.RHMI
    );
  }

  render() {
    const { selfTermsReviewResult } = this.props;

    if (this.isTermsReviewRquired()
      && selfTermsReviewResult.fulfilled
      && selfTermsReviewResult.terms_required) {
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
          <p>
            Access to this cluster will be read-only until you accept the Terms and Conditions.
          </p>
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
