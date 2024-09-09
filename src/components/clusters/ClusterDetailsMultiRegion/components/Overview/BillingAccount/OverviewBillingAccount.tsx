import React from 'react';
import { useParams } from 'react-router-dom';

import {
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  Flex,
  FlexItem,
  Icon,
} from '@patternfly/react-core';
import PencilAltIcon from '@patternfly/react-icons/dist/esm/icons/pencil-alt-icon';

import { useFeatureGate } from '~/hooks/useFeatureGate';
import { useFetchClusterDetails } from '~/queries/ClusterDetailsQueries/useFetchClusterDetails';
import { OCMUI_EDIT_BILLING_ACCOUNT } from '~/redux/constants/featureConstants';

import ButtonWithTooltip from '../../../../../common/ButtonWithTooltip';
import { isHypershiftCluster } from '../../../clusterDetailsHelper';

import { OverviewBillingAccountModal } from './OverviewBillingAccountModal';

export function OverviewBillingAccount() {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const params = useParams();
  const { cluster } = useFetchClusterDetails(params.id || '');

  const hasFeatureGate = useFeatureGate(OCMUI_EDIT_BILLING_ACCOUNT);
  const isHypershift = isHypershiftCluster(cluster);
  const showEditableBillingAccount = cluster?.canEdit && hasFeatureGate && isHypershift;
  const disableChangeReason =
    !cluster?.canEdit && 'You do not have permission to change billing account.';

  return (
    <>
      {isModalOpen && (
        <OverviewBillingAccountModal
          onClose={() => {
            setIsModalOpen(false);
          }}
          billingAccount={cluster?.aws?.billing_account_id || ''}
          cluster={cluster}
        />
      )}

      <DescriptionListGroup>
        <DescriptionListTerm>Billing marketplace account</DescriptionListTerm>
        <DescriptionListDescription>
          {showEditableBillingAccount ? (
            <Flex>
              <FlexItem>
                <ButtonWithTooltip
                  isDisabled={!cluster?.canEdit} // This won't show disabled currently, but setting the tooltip anyway
                  variant="link"
                  isInline
                  onClick={() => setIsModalOpen(true)}
                  disableReason={disableChangeReason}
                  isAriaDisabled={!!disableChangeReason}
                >
                  {cluster?.aws?.billing_account_id || ''}{' '}
                  <Icon>
                    <PencilAltIcon color="blue" />
                  </Icon>
                </ButtonWithTooltip>
              </FlexItem>
            </Flex>
          ) : (
            <Flex>
              <FlexItem>
                <span data-testid="billingMarketplaceAccount">
                  {cluster?.aws?.billing_account_id || ''}
                </span>
              </FlexItem>
            </Flex>
          )}
        </DescriptionListDescription>
      </DescriptionListGroup>
    </>
  );
}
