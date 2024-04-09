import React from 'react';
import PropTypes from 'prop-types';

import {
  ActionList,
  Card,
  CardBody,
  CardFooter,
  CardTitle,
  ClipboardCopy,
  Form,
  FormGroup,
  Label,
  LabelGroup,
  Text,
  TextContent,
  TextInput,
  TextVariants,
} from '@patternfly/react-core';

import { isRestrictedEnv } from '~/restrictedEnv';

import ButtonWithTooltip from '../../../../../../common/ButtonWithTooltip';
import modals from '../../../../../../common/Modal/modals';
import EditClusterIngressDialog from '../EditClusterIngressDialog';

import './ClusterIngressCard.scss';

const resolveDisableEditReason = ({
  canEdit,
  isReadOnly,
  isSTSEnabled,
  clusterHibernating,
  isHypershiftCluster,
}) => {
  const readOnlyReason = isReadOnly && 'This operation is not available during maintenance';
  const STSEnabledReason =
    isSTSEnabled &&
    !isHypershiftCluster &&
    'Cluster ingress can only be edited for ROSA hosted control plane clusters or clusters not using Security Token Service (STS)';
  const hibernatingReason =
    clusterHibernating && 'This operation is not available while cluster is hibernating';
  const canNotEditReason =
    !canEdit &&
    'You do not have permission to edit routers. Only cluster owners, cluster editors, and organization administrators can edit routers.';
  return STSEnabledReason || readOnlyReason || hibernatingReason || canNotEditReason;
};
class ClusterIngressCard extends React.Component {
  handleEditSettings = () => {
    const { openModal } = this.props;
    openModal(modals.EDIT_CLUSTER_INGRESS);
  };

  render() {
    const {
      provider,
      consoleURL,
      controlPlaneAPIEndpoint,
      additionalRouterAddress,
      additionalRouterLabels,
      refreshCluster,
      isApiPrivate,
      isAdditionalRouterPrivate,
      hasAdditionalRouter,
      showConsoleLink,
      canEdit,
      isReadOnly,
      isSTSEnabled,
      clusterHibernating,
      isHypershiftCluster,
    } = this.props;

    const disableEditReason = resolveDisableEditReason({
      canEdit,
      isReadOnly,
      isSTSEnabled,
      clusterHibernating,
      isHypershiftCluster,
    });

    return (
      <Card className="ocm-c-networking-cluster-ingress__card">
        <CardTitle>Cluster ingress</CardTitle>
        <CardBody className="ocm-c-networking-cluster-ingress__card--body">
          <Form isHorizontal>
            <FormGroup fieldId="console_url" label="Cluster console URL" isStack>
              {consoleURL?.length ? (
                <>
                  <ClipboardCopy name="console_url" isReadOnly>
                    {consoleURL}
                  </ClipboardCopy>
                  {showConsoleLink && (
                    <TextContent>
                      <Text component={TextVariants.small}>
                        <a href={consoleURL} target="_blank" rel="noopener noreferrer">
                          Open console
                        </a>
                      </Text>
                    </TextContent>
                  )}
                </>
              ) : (
                <TextInput value="N/A" type="text" readOnlyVariant="default" />
              )}
            </FormGroup>
            <FormGroup
              fieldId="control_plane_api_endpoint"
              label="Control Plane API endpoint"
              isStack
            >
              <ClipboardCopy name="control_plane_api_endpoint" isReadOnly>
                {controlPlaneAPIEndpoint}
              </ClipboardCopy>
              <TextContent>
                <Text component={TextVariants.small}>
                  {`${isApiPrivate || isRestrictedEnv() ? 'Private' : 'Public'} API`}
                </Text>
              </TextContent>
            </FormGroup>
            {hasAdditionalRouter && (
              <>
                <FormGroup fieldId="additional_router_address" label="Additional router" isStack>
                  <TextInput
                    id="additional_router_address"
                    value={`*.${additionalRouterAddress}`}
                    readOnlyVariant="default"
                  />
                  <TextContent>
                    <Text component={TextVariants.small}>
                      {`${
                        isAdditionalRouterPrivate || isRestrictedEnv() ? 'Private' : 'Public'
                      } router`}
                    </Text>
                  </TextContent>
                </FormGroup>
                <FormGroup fieldId="labels_additional_router" label="Label match" isStack>
                  {Array.isArray(additionalRouterLabels) && (
                    <LabelGroup isCompact>
                      {additionalRouterLabels.map((text) => (
                        <Label isCompact color="blue">
                          {text}
                        </Label>
                      ))}
                    </LabelGroup>
                  )}
                </FormGroup>
              </>
            )}
            <EditClusterIngressDialog provider={provider} refreshCluster={refreshCluster} />
          </Form>
        </CardBody>
        {!isRestrictedEnv() && (
          <CardFooter>
            <ActionList>
              <ButtonWithTooltip
                variant="secondary"
                onClick={this.handleEditSettings}
                disableReason={disableEditReason}
                isAriaDisabled={!!disableEditReason}
                data-testId="edit-cluster-ingress"
              >
                Edit cluster ingress
              </ButtonWithTooltip>
            </ActionList>
          </CardFooter>
        )}
      </Card>
    );
  }
}

ClusterIngressCard.propTypes = {
  provider: PropTypes.string,
  consoleURL: PropTypes.string,
  controlPlaneAPIEndpoint: PropTypes.string.isRequired,
  additionalRouterAddress: PropTypes.string.isRequired,
  additionalRouterLabels: PropTypes.arrayOf(PropTypes.string),
  openModal: PropTypes.func.isRequired,
  refreshCluster: PropTypes.func.isRequired,
  isApiPrivate: PropTypes.bool.isRequired,
  isAdditionalRouterPrivate: PropTypes.bool.isRequired,
  hasAdditionalRouter: PropTypes.bool.isRequired,
  canEdit: PropTypes.bool.isRequired,
  isReadOnly: PropTypes.bool.isRequired,
  isSTSEnabled: PropTypes.bool.isRequired,
  isHypershiftCluster: PropTypes.bool.isRequired,
  clusterHibernating: PropTypes.bool.isRequired,
  showConsoleLink: PropTypes.bool.isRequired,
};

export default ClusterIngressCard;
