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
import { DateFormat } from '@redhat-cloud-services/frontend-components/components/DateFormat';
import { CheckCircleIcon, SearchIcon } from '@patternfly/react-icons';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

export const RemoteHealthPopover = () => (
  <Popover
    position="right"
    bodyContent={(
      <div>
        Remote Health identifies and prioritizes risks to security,
        performance, availability, and stability.
      </div>
    )}
    aria-label="What is Remote Health?"
    boundary="viewport"
    enableFlip
  >
    <Button style={{ padding: '0' }} variant="link">What is Remote Health?</Button>
  </Popover>
);

const EmptyTableMessage = ({
  icon,
  header,
  body,
  iconClassName,
}) => (
  <EmptyState className="empty-table-message" variant={EmptyStateVariant.full}>
    <EmptyStateIcon className={iconClassName} icon={icon} />

    <Title headingLevel="h5" size="lg">
      {header}
    </Title>

    <EmptyStateBody>
      {body}
    </EmptyStateBody>

    <Button
      variant="primary"
      component={Link}
      to="/"
    >
      Return to list of clusters
    </Button>

    <EmptyStateSecondaryActions>
      <RemoteHealthPopover />
    </EmptyStateSecondaryActions>
  </EmptyState>
);

EmptyTableMessage.propTypes = {
  icon: PropTypes.elementType,
  header: PropTypes.string,
  body: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  iconClassName: PropTypes.string,
};

export const NoRulesMessage = () => (
  <EmptyTableMessage
    icon={SearchIcon}
    header="No health checks"
    body="This cluster is not affected by any known health checks."
  />
);

export const NoIssuesMessage = ({ lastChecked }) => {
  const body = (
    <>
      <div>No issues have been found.</div>
      {
        lastChecked && (
          <div>
            <span>Last checked: </span>
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
        header="No issues detected!"
        body={body}
      />
    </div>
  );
};

NoIssuesMessage.propTypes = {
  lastChecked: PropTypes.node,
};
