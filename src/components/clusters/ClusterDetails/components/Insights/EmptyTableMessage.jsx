import React from 'react';
import {
  Button,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon, EmptyStateSecondaryActions,
  EmptyStateVariant,
  Title
} from '@patternfly/react-core';
import { OkIcon, SearchIcon } from '@patternfly/react-icons';
import PropTypes from 'prop-types';
import './EmptyTableMessage.css';
import { Link } from 'react-router-dom';

function EmptyTableMessage({ icon, header, body, iconClassName }) {
  return (
    <EmptyState variant={EmptyStateVariant.full}>
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
        <Button variant="link">What is Insights?</Button>
      </EmptyStateSecondaryActions>
    </EmptyState>
  );
}

EmptyTableMessage.propTypes = {
  icon: PropTypes.elementType,
  header: PropTypes.string,
  body: PropTypes.oneOfType([PropTypes.string, PropTypes.elementType]),
  iconClassName: PropTypes.string,
};

export function NoRulesMessage() {
  return (
    <EmptyTableMessage
      icon={SearchIcon}
      header="There are no rules for this cluster"
      body="This cluster is not affected by any known rules."
    />
  );
}

export function NoIssuesMessage({ lastChecked }) {
  const body = (
    <>
      <div>No issues have been found during Insights analysis.</div>
      {
        lastChecked && (
          <div>
            <span>Last checked: </span>
            {lastChecked}
          </div>
        )
      }
    </>
  );

  return (
    <div
      className="NoIssuesMessage"
    >
      <EmptyTableMessage
        icon={OkIcon}
        iconClassName="SuccessColor"
        header="No issues detected!"
        body={body}
      />
    </div>
  );
}

NoIssuesMessage.propTypes = {
  lastChecked: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
};
