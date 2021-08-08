import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import {
  Card,
  Form,
  Grid,
  GridItem,
  Title,
  CardBody,
  ClipboardCopy,
  Split,
  SplitItem,
  Stack,
  StackItem,
  ActionGroup,
  Button,
  Tooltip,
} from '@patternfly/react-core';

import { ReduxCheckbox, ReduxVerticalFormGroup } from '../../../../../../common/ReduxFormComponents';
import { checkRouteSelectors } from '../../../../../../../common/validators';
import ChangePrivacySettingsDialog from '../ChangePrivacySettingsDialog';
import './EditClusterRoutersCard.scss';
import ButtonWithTooltip from '../../../../../../common/ButtonWithTooltip';

class EditClusterRoutersCard extends React.Component {
  handleSaveChanges = () => {
    const { openModal, shouldShowAlert } = this.props;
    openModal('change-privacy-settings', { shouldShowAlert });
  }

  render() {
    const {
      controlPlaneAPIEndpoint,
      handleSubmit,
      pristine,
      valid,
      additionalRouterEnabled,
      reset,
      refreshCluster,
      defaultRouterAddress,
      additionalRouterAddress,
      canEdit,
      clusterHibernating,
      isReadOnly,
      provider,
    } = this.props;

    // Reasons to disable whole form
    const readOnlyReason = isReadOnly && 'This operation is not available during maintenance';
    const hibernatingReason = clusterHibernating && (
      'This operation is not available while cluster is hibernating'
    );
    const canNotEditReason = !canEdit && (
      'You do not have permission to edit routers. Only cluster owners and organization administrators can edit routers.'
    );
    const formDisableReason = readOnlyReason || hibernatingReason || canNotEditReason;

    // Reasons to block save button only
    const pristineReason = pristine && 'No changes to save';
    const isDisabled = !valid;

    const changeSettingsBtn = (
      <ButtonWithTooltip
        variant="primary"
        onClick={this.handleSaveChanges}
        disableReason={formDisableReason || pristineReason}
        isDisabled={isDisabled}
      >
        Change settings
      </ButtonWithTooltip>
    );

    let additionalRouterRadio = (
      <Field
        component={ReduxCheckbox}
        isSwitch
        name="enable_additional_router"
        labelOff="Not enabled"
        label="Enabled"
        isDisabled={!!formDisableReason}
      />
    );
    // TODO: tooltips on all fields, or none?
    if (formDisableReason) {
      additionalRouterRadio = (
        <Tooltip content={formDisableReason}>
          <span>
            {additionalRouterRadio}
          </span>
        </Tooltip>
      );
    }

    return (
      <>
        <Card className="ocm-c-networking-edit-cluster-routers__card">
          <CardBody className="ocm-c-networking-edit-cluster-routers__card--body">
            <Form>
              <Grid>
                <GridItem md={9}>
                  <Stack hasGutter>
                    <StackItem>
                      <Title headingLevel="h1" size="md" className="card-title">Control Plane API endpoint</Title>
                    </StackItem>
                    <StackItem>
                      <ClipboardCopy isReadOnly>
                        {controlPlaneAPIEndpoint}
                      </ClipboardCopy>
                    </StackItem>
                    <StackItem>
                      <Field
                        component={ReduxCheckbox}
                        name="private_api"
                        label="Make API private"
                        isDisabled={!!formDisableReason}
                      />
                    </StackItem>
                    <StackItem>
                      <Title headingLevel="h2" size="md" className="card-title">Default application router</Title>
                    </StackItem>
                    <StackItem>
                      <ClipboardCopy isReadOnly>
                        {`https://${defaultRouterAddress}`}
                      </ClipboardCopy>
                    </StackItem>
                    <StackItem>
                      <Field
                        component={ReduxCheckbox}
                        name="private_default_router"
                        label="Make router private"
                        isDisabled={!!formDisableReason}
                      />
                    </StackItem>
                    <StackItem>
                      <Split hasGutter>
                        <SplitItem>
                          <Title headingLevel="h2" size="md" className="card-title">Additional application router</Title>
                        </SplitItem>
                        <SplitItem>
                          {additionalRouterRadio}
                        </SplitItem>
                      </Split>
                    </StackItem>
                    {
                      additionalRouterEnabled && (
                        <>
                          <StackItem>
                            <ClipboardCopy isReadOnly>
                              {`https://${additionalRouterAddress}`}
                            </ClipboardCopy>
                          </StackItem>
                          <StackItem>
                            <Field
                              component={ReduxCheckbox}
                              name="private_additional_router"
                              label="Make router private"
                              isDisabled={!!formDisableReason}
                            />
                          </StackItem>
                        </>
                      )
                    }
                    {
                      additionalRouterEnabled && (
                        <StackItem>
                          <Field
                            component={ReduxVerticalFormGroup}
                            arid-label="Additional Router Labels"
                            name="labels_additional_router"
                            label="Label match for additional router (optional)"
                            type="text"
                            helpText="Comma separated pairs in key=value format. If no label is specified, all routes will be exposed on both routers."
                            validate={checkRouteSelectors}
                            key="route_selectors"
                            onChange={this.handleChangeRouteSelectors}
                            isReadOnly={!!formDisableReason}
                          />
                        </StackItem>
                      )
                    }
                    <StackItem>
                      <ActionGroup>
                        {changeSettingsBtn}
                        <Button
                          variant="secondary"
                          isDisabled={pristine}
                          onClick={() => reset()}
                        >
                          Cancel
                        </Button>
                      </ActionGroup>
                    </StackItem>
                  </Stack>
                </GridItem>
              </Grid>
              <ChangePrivacySettingsDialog
                onConfirm={handleSubmit}
                refreshCluster={refreshCluster}
                provider={provider}
              />
            </Form>
          </CardBody>
        </Card>
      </>
    );
  }
}

EditClusterRoutersCard.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  openModal: PropTypes.func.isRequired,
  controlPlaneAPIEndpoint: PropTypes.string.isRequired,
  valid: PropTypes.bool.isRequired,
  pristine: PropTypes.bool.isRequired,
  reset: PropTypes.func.isRequired,
  initialValues: PropTypes.shape({
    private_api: PropTypes.bool,
    private_default_router: PropTypes.bool,
    enable_additional_router: PropTypes.bool,
    private_additional_router: PropTypes.bool,
    labels_additional_router: PropTypes.string,
  }).isRequired,
  shouldShowAlert: PropTypes.bool,
  additionalRouterEnabled: PropTypes.bool,
  refreshCluster: PropTypes.func.isRequired,
  defaultRouterAddress: PropTypes.string.isRequired,
  additionalRouterAddress: PropTypes.string.isRequired,
  canEdit: PropTypes.bool.isRequired,
  clusterHibernating: PropTypes.bool.isRequired,
  isReadOnly: PropTypes.bool.isRequired,
  provider: PropTypes.string,
};

export default EditClusterRoutersCard;
