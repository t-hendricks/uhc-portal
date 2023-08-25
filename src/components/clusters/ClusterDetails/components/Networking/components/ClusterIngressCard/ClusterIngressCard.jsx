import React from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  CardBody,
  CardTitle,
  CardFooter,
  ActionList,
  Form,
  Label,
  FormGroup,
  LabelGroup,
  Text,
  TextInput,
  TextContent,
  TextVariants,
  ClipboardCopy,
} from '@patternfly/react-core';

import { isRestrictedEnv } from '~/restrictedEnv';
import EditClusterIngressDialog from '../EditClusterIngressDialog';
import ButtonWithTooltip from '../../../../../../common/ButtonWithTooltip';

import modals from '../../../../../../common/Modal/modals';

import './ClusterIngressCard.scss';

const resolveDisableEditReason = ({ canEdit, isReadOnly, isSTSEnabled, clusterHibernating }) => {
  const readOnlyReason = isReadOnly && 'This operation is not available during maintenance';
  const STSEnabledReason =
    isSTSEnabled &&
    'This operation is not available for clusters using Security Token Service (STS)';
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
    } = this.props;

    const disableEditReason = resolveDisableEditReason({
      canEdit,
      isReadOnly,
      isSTSEnabled,
      clusterHibernating,
    });

    return (
      <Card className="ocm-c-networking-cluster-ingress__card">
        <CardTitle>Cluster ingress</CardTitle>
        <CardBody className="ocm-c-networking-cluster-ingress__card--body">
          <Form isHorizontal>
            <FormGroup fieldId="console_url" label="Cluster console URL" isStack>
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
  clusterHibernating: PropTypes.bool.isRequired,
  showConsoleLink: PropTypes.bool.isRequired,
};

export default ClusterIngressCard;
