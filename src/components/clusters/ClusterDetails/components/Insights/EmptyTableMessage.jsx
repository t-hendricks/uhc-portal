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
import { CheckCircleIcon, SearchIcon } from '@patternfly/react-icons';
import PropTypes from 'prop-types';
import './EmptyTableMessage.css';
import { Link } from 'react-router-dom';

export const RemoteHealthPopover = () => (
  <Popover
    position="right"
    headerContent="What is Remote health?"
    bodyContent={(
      <div>
        It helps you identify, prioritize, and resolve risks to security,
        perfomance, aviability and stability before they become urgent issues
      </div>
    )}
    aria-label="What is Remote health?"
  >
    <Button style={{ padding: '0' }} variant="link">What is Remote health?</Button>
  </Popover>
);

const EmptyTableMessage = ({
  icon,
  header,
  body,
  iconClassName,
}) => (
  <EmptyState className="empty-table-message" variant={EmptyStateVariant.full}>
    <EmptyStateIcon className={iconClassName} icon={icon}/>

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

    <EmptyStateSecondaryActions className="EmptyTableMessageWhatIsRemoteHealth">
      <RemoteHealthPopover/>
    </EmptyStateSecondaryActions>
  </EmptyState>
);

EmptyTableMessage.propTypes = {
  icon: PropTypes.elementType,
  header: PropTypes.string,
  body: PropTypes.oneOfType([PropTypes.string, PropTypes.elementType]),
  iconClassName: PropTypes.string,
};

export const NoRulesMessage = () => (
  <EmptyTableMessage
    icon={SearchIcon}
    header="There are no rules for this cluster"
    body="This cluster is not affected by any known rules."
  />
);

export const NoIssuesMessage = ({ lastChecked }) => {
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
    <div className="NoIssuesMessage">
      <EmptyTableMessage
        icon={CheckCircleIcon}
        iconClassName="SuccessColor"
        header="No issues detected!"
        body={body}
      />
    </div>
  );
};

NoIssuesMessage.propTypes = {
  lastChecked: PropTypes.node,
};
