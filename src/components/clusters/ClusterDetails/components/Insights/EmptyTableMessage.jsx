import React from 'react';
import {
  Button,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon, EmptyStateSecondaryActions,
  EmptyStateVariant,
  Title,
  Popover,
} from '@patternfly/react-core';
import { DateFormat } from '@redhat-cloud-services/frontend-components/DateFormat';
import {
  CheckCircleIcon,
  InfoCircleIcon,
  InProgressIcon,
  ExclamationCircleIcon,
} from '@patternfly/react-icons';
import PropTypes from 'prop-types';

import links from '../../../../../common/installLinks.mjs';

export const RemoteHealthPopover = ({ variant }) => (
  <Popover
    position="right"
    maxWidth="22rem"
    bodyContent={(
      <>
        <p className="paragraph-margin-bottom">
          Insights identifies and prioritizes risks to security, performance, availability,
          and stability of your clusters.
        </p>
        <p>
          This feature uses the Remote Health functionality of OpenShift Container Platform.
          For further details about Insights, see the
          {' '}
          <a href={links.GETTING_SUPPORT}>OpenShift documentation</a>
          .
        </p>
      </>
    )}
    aria-label="What is Insights?"
    boundary="viewport"
    enableFlip
  >
    <Button style={variant === 'link' ? { padding: '0' } : undefined} variant={variant}>What is Insights?</Button>
  </Popover>
);

RemoteHealthPopover.propTypes = {
  variant: PropTypes.string,
};

RemoteHealthPopover.defaultProps = {
  variant: 'link',
};

const EmptyTableMessage = ({
  icon,
  header,
  body,
  iconClassName,
  showPopover,
}) => (
  <EmptyState className="empty-table-message" variant={EmptyStateVariant.large}>
    <EmptyStateIcon className={iconClassName} icon={icon} />

    <Title headingLevel="h5" size="lg">
      {header}
    </Title>

    <EmptyStateBody>
      {body}
    </EmptyStateBody>

    {
      showPopover
      && (
      <EmptyStateSecondaryActions>
        <RemoteHealthPopover variant="primary" />
      </EmptyStateSecondaryActions>
      )
    }
  </EmptyState>
);

EmptyTableMessage.propTypes = {
  icon: PropTypes.elementType,
  header: PropTypes.string,
  body: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  iconClassName: PropTypes.string,
  showPopover: PropTypes.bool,
};

export const NoRulesMessage = () => (
  <EmptyTableMessage
    icon={InfoCircleIcon}
    header="No recommendations to display"
    iconClassName="info-color"
    body={
      (
        <>
          Insights identifies and prioritizes risks to security, performance, availability,
          and stability of your clusters. This feature uses the Remote Health
          functionality of OpenShift Container Platform. For further details about Insights,
          see the
          {' '}
          <a href={links.GETTING_SUPPORT}>OpenShift documentation</a>
          .
        </>
)
    }
  />
);

export const NoIssuesMessage = ({ lastChecked }) => {
  const body = (
    <>
      <div>No issues have been identified.</div>
      {
        lastChecked && (
          <div>
            <span>Last check: </span>
            <DateFormat date={new Date(lastChecked)} />
          </div>
        )
      }
    </>
  );

  return (
    <div className="NoIssuesMessage">
      <EmptyTableMessage
        icon={CheckCircleIcon}
        iconClassName="success-color"
        header="Your cluster passed all recommendations"
        body={body}
        showPopover
      />
    </div>
  );
};

NoIssuesMessage.propTypes = {
  lastChecked: PropTypes.node,
};

export const AnalysisInProgressMessage = () => (
  <div className="AnalysisInProgressMessage">
    <EmptyTableMessage
      icon={InProgressIcon}
      iconClassName="disabled-color"
      header="The analysis of your cluster is in progress"
      body="Your cluster has been identified, and Insights analyzes your cluster. The results will be displayed shortly."
      showPopover
    />
  </div>
);

export const ErrorMessage = () => {
  const body = (
    <>
      Try refreshing the page.
      {' '}
      If the problem persists,
      {' '}
      contact your organization administrator or visit our
      {' '}
      <a target="_blank" rel="noopener noreferrer" href="https://status.redhat.com/">status page</a>
      {' '}
      for known outages.
    </>
  );

  return (
    <div className="ErrorMessage">
      <EmptyTableMessage
        icon={ExclamationCircleIcon}
        iconClassName="danger-color"
        header="This page is temporarily unavailable"
        body={body}
        showPopover
      />
    </div>
  );
};
