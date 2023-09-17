import React from 'react';
import {
  Card,
  CardBody,
  CardTitle,
  CardFooter,
  ActionList,
  Form,
  TextInput,
  FormGroup,
  Switch,
  TextContent,
  Text,
  TextVariants,
} from '@patternfly/react-core';

import { LoadBalancerFlavor } from '~/types/clusters_mgmt.v1';
import { isRestrictedEnv } from '~/restrictedEnv';
import { CloudProviderType } from '~/components/clusters/wizards/common';

import EditApplicationIngressDialog from '../EditApplicationIngressDialog';
import ButtonWithTooltip from '../../../../../../common/ButtonWithTooltip';
import LoadBalancerPopover from '../LoadBalancerPopover';
import modals from '../../../../../../common/Modal/modals';
import { LoadBalancerFlavorLabel } from '../constants';
import {
  ClusterRouter,
  excludedNamespacesAsString,
  routeSelectorsAsString,
} from '../../NetworkingSelector';
import { NamespaceOwnerPolicyPopover } from './NamespaceOwnerPolicyPopover';
import { WildcardPolicyPopover } from './WildcardsPolicyPopover';
import { ExcludedNamespacesPopover } from './ExcludedNamespacesPopover';
import { RouteSelectorsPopover } from './RouteSelectorsPopover';

import './ApplicationIngressCard.scss';

type ResolveDisableEditReasonParams = {
  canEdit: boolean;
  isReadOnly: boolean;
  isHypershift?: boolean;
  clusterHibernating: boolean;
  hasSufficientIngressEditVersion?: boolean;
  canEditLoadBalancer: boolean;
};

const resolveDisableEditReason = ({
  canEdit,
  isReadOnly,
  clusterHibernating,
  isHypershift,
  hasSufficientIngressEditVersion,
  canEditLoadBalancer,
}: ResolveDisableEditReasonParams) => {
  const canNotEditDefaultRouterReason =
    !canEditLoadBalancer &&
    !hasSufficientIngressEditVersion &&
    'This operation is available for clusters of version 4.13 or higher.';
  const readOnlyReason = isReadOnly && 'This operation is not available during maintenance';
  const hypershiftReason =
    isHypershift && 'This operation is not available for Hosted control plane clusters';
  const hibernatingReason =
    clusterHibernating && 'This operation is not available while cluster is hibernating';
  const canNotEditReason =
    !canEdit &&
    'You do not have permission to edit routers. Only cluster owners, cluster editors, and organization administrators can edit routers.';
  return (
    canNotEditDefaultRouterReason ||
    readOnlyReason ||
    hibernatingReason ||
    canNotEditReason ||
    hypershiftReason
  );
};

type ApplicationIngressCardProps = ResolveDisableEditReasonParams & {
  provider?: string;

  isNLB?: boolean;
  hasSufficientIngressEditVersion?: boolean;
  clusterRoutesTlsSecretRef?: string;
  clusterRoutesHostname?: string;

  defaultRouterAddress?: string;
  isDefaultRouterPrivate?: boolean;
  isHypershift?: boolean;

  defaultRouterSelectors: ClusterRouter['routeSelectors'];
  defaultRouterExcludedNamespacesFlag: ClusterRouter['excludedNamespaces'];
  isDefaultIngressWildcardPolicyAllowed?: ClusterRouter['isWildcardPolicyAllowed'];
  isDefaultRouterNamespaceOwnershipPolicyStrict: ClusterRouter['isNamespaceOwnershipPolicyStrict'];

  openModal: (modal: string) => void;
};

const ApplicationIngressCard: React.FC<ApplicationIngressCardProps> = ({
  provider,

  canEdit,
  isReadOnly,
  isHypershift,
  clusterHibernating,

  isNLB,
  canEditLoadBalancer,
  hasSufficientIngressEditVersion,
  clusterRoutesTlsSecretRef,
  clusterRoutesHostname,

  defaultRouterAddress,
  isDefaultRouterPrivate,

  defaultRouterSelectors,
  defaultRouterExcludedNamespacesFlag,
  isDefaultIngressWildcardPolicyAllowed,
  isDefaultRouterNamespaceOwnershipPolicyStrict,

  openModal,
}) => {
  const isAWS = provider === CloudProviderType.Aws;

  const disableEditReason = resolveDisableEditReason({
    canEdit,
    isReadOnly,
    isHypershift,
    clusterHibernating,
    hasSufficientIngressEditVersion,
    canEditLoadBalancer,
  });

  const handleEditSettings = () => {
    openModal(modals.EDIT_APPLICATION_INGRESS);
  };

  return (
    <Card className="ocm-c-networking-application-ingress__card">
      <CardTitle>Application ingress</CardTitle>
      <CardBody>
        <Form isHorizontal>
          <FormGroup fieldId="default_router_address" label="Default application router" isStack>
            <TextInput
              id="default_router_address"
              value={`*.${defaultRouterAddress}`}
              readOnlyVariant="default"
            />
            <TextContent>
              <Text component={TextVariants.small}>
                {`${isDefaultRouterPrivate || isRestrictedEnv() ? 'Private' : 'Public'} router`}
              </Text>
            </TextContent>
          </FormGroup>

          {hasSufficientIngressEditVersion && (
            <>
              <FormGroup
                fieldId="defaultRouterSelectors"
                label="Route selector"
                labelIcon={<RouteSelectorsPopover />}
                isStack
              >
                <TextInput
                  id="defaultRouterSelectors"
                  value={routeSelectorsAsString(defaultRouterSelectors) ?? ''}
                  isDisabled
                />
              </FormGroup>

              <FormGroup
                fieldId="defaultRouterExcludedNamespacesFlag"
                label="Excluded namespaces"
                labelIcon={<ExcludedNamespacesPopover />}
                isStack
              >
                <TextInput
                  id="defaultRouterExcludedNamespacesFlag"
                  value={excludedNamespacesAsString(defaultRouterExcludedNamespacesFlag)}
                  isDisabled
                />
              </FormGroup>

              <FormGroup fieldId="clusterRoutesTlsSecretRef" label="TLS Secret name" isStack>
                <TextInput
                  id="clusterRoutesTlsSecretRef"
                  value={clusterRoutesTlsSecretRef}
                  isDisabled
                />
              </FormGroup>

              <FormGroup fieldId="clusterRoutesHostname" label="Hostname" isStack>
                <TextInput id="clusterRoutesHostname" value={clusterRoutesHostname} isDisabled />
              </FormGroup>

              <FormGroup
                label="Namespace ownership policy"
                labelIcon={<NamespaceOwnerPolicyPopover />}
                isStack
              >
                <Switch
                  label="Strict"
                  labelOff="Inter-namespace ownership"
                  isChecked={isDefaultRouterNamespaceOwnershipPolicyStrict}
                  isDisabled
                />
              </FormGroup>

              <FormGroup label="Wildcard policy" labelIcon={<WildcardPolicyPopover />} isStack>
                <Switch
                  label="Allowed"
                  labelOff="Disallowed"
                  isChecked={isDefaultIngressWildcardPolicyAllowed}
                  isDisabled
                />
              </FormGroup>
            </>
          )}

          {isAWS && (
            <FormGroup label="Load balancer type" labelIcon={<LoadBalancerPopover />}>
              <Switch
                label={LoadBalancerFlavorLabel[LoadBalancerFlavor.NLB]}
                labelOff={LoadBalancerFlavorLabel[LoadBalancerFlavor.CLASSIC]}
                isChecked={isNLB}
                isDisabled
              />
            </FormGroup>
          )}

          <EditApplicationIngressDialog />
        </Form>
      </CardBody>
      <CardFooter>
        <ActionList>
          <ButtonWithTooltip
            variant="secondary"
            onClick={handleEditSettings}
            disableReason={disableEditReason}
            isAriaDisabled={!!disableEditReason}
          >
            Edit application ingress
          </ButtonWithTooltip>
        </ActionList>
      </CardFooter>
    </Card>
  );
};

export default ApplicationIngressCard;
