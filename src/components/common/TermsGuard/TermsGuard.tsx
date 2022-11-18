import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  TextContent,
  Text,
  TextVariants,
  EmptyState,
  EmptyStateBody,
} from '@patternfly/react-core';
import { Spinner } from '@redhat-cloud-services/frontend-components/Spinner';

import Modal from '../Modal/Modal';
import Unavailable from '../Unavailable';
import getTermsAppLink from '../../../common/getTermsAppLink';
import './TermsGuard.scss';

class TermsGuard extends Component {
  componentDidMount() {
    const { selfTermsReview } = this.props;
    selfTermsReview();
  }

  // handleCancel goes back to the last visited or the parent page.
  handleCancel = () => {
    const { history, gobackPath } = this.props;
    history.push(gobackPath);
  };

  getTncAppURL = (baseURL) => {
    const { history, gobackPath } = this.props;
    // as long as user performs some action, he should be redirected to the same page.
    const redirectURL = window.location.host + history.createHref(history.location);
    // same as clicking "Cancel" in the dialog.
    const cancelURL = window.location.host + history.createHref({ pathname: gobackPath });

    return getTermsAppLink(baseURL, redirectURL, cancelURL);
  };

  render() {
    const { selfTermsReviewResult, children } = this.props;

    // block by error page if the terms service is unavailable.
    if (selfTermsReviewResult.error) {
      return <Unavailable response={selfTermsReviewResult} />;
    }

    if (!selfTermsReviewResult.fulfilled) {
      return (
        <EmptyState>
          <EmptyStateBody>
            <Spinner centered />
          </EmptyStateBody>
        </EmptyState>
      );
    }

    if (!selfTermsReviewResult.terms_required && !selfTermsReviewResult.terms_available) {
      return children;
    }

    const dialogTitle = selfTermsReviewResult.terms_required
      ? 'Terms and Conditions'
      : 'Updated Terms and Conditions';
    const dialogText = selfTermsReviewResult.terms_required ? (
      // required: user needs accept or cancel.
      <TextContent>
        <Text component={TextVariants.p}>
          Red Hat has Terms and Conditions for its managed services.
        </Text>
        <Text component={TextVariants.p}>
          <b>
            If you do not accept the terms, you will not be able to create new clusters or to alter
            existing clusters.
          </b>{' '}
          Existing clusters will not be affected, however access will be read-only.
        </Text>
      </TextContent>
    ) : (
      // optional: user needs accept, decline, defer, or cancel.
      <TextContent>
        <Text component={TextVariants.p}>
          Red Hat has updated the Terms and Conditions for its managed services.
        </Text>
      </TextContent>
    );
    const tncAppURL = this.getTncAppURL(selfTermsReviewResult.redirect_url);
    const actions = [
      <Button variant="primary" key="view-terms-and-conditions" component="a" href={tncAppURL}>
        View Terms and Conditions
      </Button>,
      <Button variant="secondary" key="cancel-terms-and-conditions" onClick={this.handleCancel}>
        Cancel
      </Button>,
    ];

    return (
      <>
        <Modal
          title={dialogTitle}
          className="terms-and-conditions-guard-modal"
          onClose={this.handleCancel}
          actions={actions}
        >
          {dialogText}
        </Modal>
        {React.cloneElement(React.Children.only(children), { blockedByTerms: true })}
      </>
    );
  }
}

TermsGuard.propTypes = {
  selfTermsReview: PropTypes.func.isRequired,
  selfTermsReviewResult: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
  gobackPath: PropTypes.string,
  history: PropTypes.shape({
    location: PropTypes.object,
    push: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
    createHref: PropTypes.func.isRequired,
  }).isRequired,
};

export default TermsGuard;
