import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Button, EmptyState, EmptyStateBody, EmptyStateVariant } from '@patternfly/react-core';
import { Table, TableBody, TableHeader, TableVariant } from '@patternfly/react-table';
import { SUPPORT_CASE_URL, isRestrictedEnv } from '~/restrictedEnv';
import { normalizedProducts } from '../../../../../../../common/subscriptionTypes';

const productMap = {
  OSD: 'OpenShift Dedicated',
  ROSA: 'Red Hat OpenShift Service on AWS',
  ARO: 'OpenShift Managed (Azure)',
  OCP: 'OpenShift Container Platform',
};

const getSupportCaseURL = (product, version, clusterUUID) => {
  if (isRestrictedEnv()) {
    return SUPPORT_CASE_URL;
  }

  let openshiftVersion = version;
  if (product !== 'OCP') {
    openshiftVersion = encodeURIComponent(productMap[product]);
  }

  return `https://access.redhat.com/support/cases/#/case/new/open-case/describe-issue?clusterId=${clusterUUID}&caseCreate=true&product=${encodeURIComponent(
    productMap[product],
  )}&version=${openshiftVersion}`;
};

class SupportCasesCard extends React.Component {
  componentDidMount() {
    if (!isRestrictedEnv()) {
      const { subscriptionID, supportCases, getSupportCases } = this.props;
      if (supportCases.subscriptionID !== subscriptionID || !supportCases.pending) {
        getSupportCases(subscriptionID);
      }
    }
  }

  render() {
    const { supportCases, clusterUUID, product, version, isDisabled = false } = this.props;

    const columns = [
      { title: 'Case ID' },
      { title: 'Issue summary' },
      { title: 'Owner' },
      { title: 'Modified by' },
      { title: 'Severity' },
      { title: 'Status' },
    ];

    const supportCaseRow = (supportCase) => {
      const caseIdURL = `https://access.redhat.com/support/cases/#/case/${supportCase.caseID}`;
      const caseID = (
        <>
          <a href={caseIdURL} target="_blank" rel="noopener noreferrer">
            {supportCase.caseID}
          </a>
        </>
      );

      const lastModifiedDate = moment.utc(supportCase.lastModifiedDate).format('D MMM YYYY');

      const lastModifiedBy = (
        <>
          {supportCase.lastModifiedBy}
          <br />
          {lastModifiedDate}
        </>
      );
      return {
        cells: [
          caseID,
          supportCase.summary,
          supportCase.ownerID,
          lastModifiedBy,
          supportCase.severity,
          supportCase.status,
        ],
        caseID: supportCase.caseID,
      };
    };

    const rows = supportCases.cases.map(supportCaseRow);
    const hasRows = rows.length > 0;
    const showOpenSupportCaseButton = product !== normalizedProducts.OSDTrial && !isDisabled;

    return (
      <>
        {showOpenSupportCaseButton && (
          <a
            href={getSupportCaseURL(product, version, clusterUUID)}
            target="_blank"
            rel="noopener noreferrer"
            data-testid="support-case-btn"
          >
            <Button variant="secondary">Open support case</Button>
          </a>
        )}
        {!isRestrictedEnv() && (
          <>
            <Table
              aria-label="Support Cases"
              variant={TableVariant.compact}
              cells={columns}
              rows={rows}
              data-testid="support-cases-table"
            >
              <TableHeader />
              <TableBody />
            </Table>
            {!hasRows && (
              <EmptyState variant={EmptyStateVariant.small}>
                <EmptyStateBody>You have no open support cases</EmptyStateBody>
              </EmptyState>
            )}
          </>
        )}
      </>
    );
  }
}

SupportCasesCard.propTypes = {
  subscriptionID: PropTypes.string.isRequired,
  clusterUUID: PropTypes.string.isRequired,
  product: PropTypes.string.isRequired,
  version: PropTypes.object.isRequired,
  supportCases: PropTypes.object.isRequired,
  getSupportCases: PropTypes.func.isRequired,
  isDisabled: PropTypes.bool,
};

export default SupportCasesCard;
