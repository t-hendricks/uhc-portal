import React, { useEffect, useMemo } from 'react';

import { Button, EmptyState, EmptyStateBody, EmptyStateVariant } from '@patternfly/react-core';
import { TableVariant } from '@patternfly/react-table';
import {
  Table as TableDeprecated,
  TableBody as TableBodyDeprecated,
  TableHeader as TableHeaderDeprecated,
} from '@patternfly/react-table/deprecated';

import { useFetchSupportCases } from '~/queries/ClusterDetailsQueries/ClusterSupportTab/useFetchSupportCases';
import { isRestrictedEnv } from '~/restrictedEnv';
import { AugmentedCluster } from '~/types/types';

import { normalizedProducts } from '../../../../../../common/subscriptionTypes';

import { COLUMNS, getSupportCaseURL, supportCaseRow } from './SupportCasesCardHelper';

type SupportCasesCardProps = {
  subscriptionID: string;
  isDisabled?: boolean;
  cluster: AugmentedCluster;
};

const SupportCasesCard = ({
  subscriptionID,
  isDisabled = false,
  cluster,
}: SupportCasesCardProps) => {
  const product = cluster?.subscription?.plan?.type;
  const isRestricted = isRestrictedEnv();
  const { supportCases, isLoading, refetch } = useFetchSupportCases(subscriptionID, isRestricted);

  useEffect(() => {
    if (!isRestrictedEnv()) {
      if (supportCases.subscriptionID !== subscriptionID || !isLoading) {
        refetch();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subscriptionID, supportCases.subscriptionID]);

  const rows = useMemo(() => supportCases.cases?.map(supportCaseRow), [supportCases.cases]);
  const hasRows = useMemo(() => rows && rows.length > 0, [rows]);
  const showOpenSupportCaseButton = product !== normalizedProducts.OSDTRIAL && !isDisabled;

  return (
    <>
      {showOpenSupportCaseButton && (
        <a
          href={getSupportCaseURL(product, cluster?.openshift_version, cluster?.external_id)}
          target="_blank"
          rel="noopener noreferrer"
          data-testid="support-case-btn"
        >
          <Button variant="secondary">Open support case</Button>
        </a>
      )}
      {!isRestrictedEnv() && (
        <>
          <TableDeprecated
            aria-label="Support Cases"
            variant={TableVariant.compact}
            cells={COLUMNS}
            rows={rows}
            data-testid="support-cases-table"
          >
            <TableHeaderDeprecated />
            <TableBodyDeprecated />
          </TableDeprecated>
          {!hasRows && (
            <EmptyState variant={EmptyStateVariant.sm}>
              <EmptyStateBody>You have no open support cases</EmptyStateBody>
            </EmptyState>
          )}
        </>
      )}
    </>
  );
};

export default SupportCasesCard;
