import React, { useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';

import { Button, EmptyState, EmptyStateBody, EmptyStateVariant } from '@patternfly/react-core';
import { TableVariant } from '@patternfly/react-table';
import {
  Table as TableDeprecated,
  TableBody as TableBodyDeprecated,
  TableHeader as TableHeaderDeprecated,
} from '@patternfly/react-table/deprecated';

import { getSupportCases } from '~/redux/actions/supportActions';
import { useGlobalState } from '~/redux/hooks';
import { isRestrictedEnv } from '~/restrictedEnv';

import { normalizedProducts } from '../../../../../../common/subscriptionTypes';

import { COLUMNS, getSupportCaseURL, supportCaseRow } from './SupportCasesCardHelper';

type SupportCasesCardProps = {
  subscriptionID: string;
  isDisabled?: boolean;
};

const SupportCasesCard = ({ subscriptionID, isDisabled = false }: SupportCasesCardProps) => {
  const cluster = useGlobalState((state) => state.clusters.details.cluster);
  const product = cluster.subscription?.plan?.type;
  const {
    supportCases = {
      cases: [],
      pending: false,
      subscriptionID: '',
    },
  } = useGlobalState((state) => state.clusterSupport);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!isRestrictedEnv()) {
      if (supportCases.subscriptionID !== subscriptionID || !supportCases.pending) {
        dispatch(getSupportCases(subscriptionID));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, subscriptionID, supportCases.subscriptionID]);

  const rows = useMemo(() => supportCases.cases?.map(supportCaseRow), [supportCases.cases]);
  const hasRows = useMemo(() => rows && rows.length > 0, [rows]);
  const showOpenSupportCaseButton = product !== normalizedProducts.OSDTrial && !isDisabled;

  return (
    <>
      {showOpenSupportCaseButton && (
        <a
          href={getSupportCaseURL(product, cluster.openshift_version, cluster.external_id)}
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
