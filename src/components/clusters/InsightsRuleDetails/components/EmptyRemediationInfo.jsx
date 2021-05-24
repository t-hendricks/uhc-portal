import React from 'react';
import {
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  EmptyStateVariant,
  Title,
} from '@patternfly/react-core';
import { WrenchIcon } from '@patternfly/react-icons';
import PropTypes from 'prop-types';

const EmptyRemediationInfo = ({ title }) => (
  <EmptyState className="empty-table-message" variant={EmptyStateVariant.large}>
    <EmptyStateIcon className="disabled-color" icon={WrenchIcon} />

    <Title headingLevel="h5" size="lg">
      {`No ${title} to display`}
    </Title>

    <EmptyStateBody>
      {`This recommendation has no ${title} description to display. For details how to solve this problem, see the corresponding knowledgebase article.`}
    </EmptyStateBody>
  </EmptyState>
);

EmptyRemediationInfo.propTypes = {
  title: PropTypes.string,
};

export default EmptyRemediationInfo;
