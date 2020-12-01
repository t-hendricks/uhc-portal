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
  ActionGroup,
  Button,
  Tooltip,
} from '@patternfly/react-core';

import { ReduxCheckbox, ReduxVerticalFormGroup } from '../../../../../../common/ReduxFormComponents';
import { checkRouteSelectors } from '../../../../../../../common/validators';
import ChangePrivacySettingsDialog from '../ChangePrivacySettingsDialog';

class EditClusterRoutersCard extends React.Component {
  handleSaveChanges = () => {
    const { openModal, shouldShowAlert } = this.props;
    openModal('change-privacy-settings', { shouldShowAlert });
  }

  render() {
    const {
      masterAPIEndpoint,
      handleSubmit,
      pristine,
      valid,
      additionalRouterEnabled,
      reset,
      refreshCluster,
      defaultRouterAddress,
      additionalRouterAddress,
      canEdit,
      provider,
    } = this.props;

    const changeSettingsBtn = (
      <Button
        variant="primary"
        onClick={this.handleSaveChanges}
        isDisabled={!canEdit || pristine || !valid}
      >
      Change settings
      </Button>
    );

    return (
      <>
        <Card id="edit-cluster-routers">
          <CardBody>
            <Form>
              <Grid hasGutter>
                <GridItem span={9}>
                  <Title headingLevel="h1" size="md" className="card-title networking-tab">Master API endpoint</Title>
                  <div className="networking-tab">
                    <ClipboardCopy isReadOnly>
                      {masterAPIEndpoint}
                    </ClipboardCopy>
                  </div>
                  <div className="networking-tab">
                    <Field
                      component={ReduxCheckbox}
                      name="private_api"
                      label="Make API private"
                      isDisabled={!canEdit}
                    />
                  </div>
                </GridItem>
                <GridItem span={9}>
                  <Title headingLevel="h2" size="md" className="card-title networking-tab">Default application router</Title>
                  <div className="networking-tab">
                    <ClipboardCopy isReadOnly>
                      {`https://${defaultRouterAddress}`}
                    </ClipboardCopy>
                  </div>
                  <div className="networking-tab">
                    <Field
                      component={ReduxCheckbox}
                      name="private_default_router"
                      label="Make router private"
                      isDisabled={!canEdit}
                    />
                  </div>
                </GridItem>
                <GridItem span={9}>
                  <Split hasGutter>
                    <SplitItem>
                      <Title headingLevel="h2" size="md" className="card-title networking-tab">Additional application router</Title>
                    </SplitItem>
                    <SplitItem>
                      <Field
                        component={ReduxCheckbox}
                        isSwitch
                        name="enable_additional_router"
                        labelOff="Not enabled"
                        label="Enabled"
                        isDisabled={!canEdit}
                      />
                    </SplitItem>
                  </Split>
                  {
                  additionalRouterEnabled && (
                    <>
                      <div className="networking-tab">
                        <ClipboardCopy isReadOnly>
                          {`https://${additionalRouterAddress}`}
                        </ClipboardCopy>
                      </div>
                      <div className="networking-tab">
                        <Field
                          component={ReduxCheckbox}
                          name="private_additional_router"
                          label="Make router private"
                          disabled={!canEdit}
                        />
                      </div>
                    </>
                  )
                }
                </GridItem>
                {
                additionalRouterEnabled && (
                  <GridItem span={9}>
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
                      isReadOnly={!canEdit}
                    />
                  </GridItem>
                )
              }
                <GridItem span={9}>
                  <ActionGroup>
                    { !canEdit ? (
                      <Tooltip content="You do not have permission to edit routers. Only cluster owners and organization administrators can edit routers.">
                        <span>
                          {changeSettingsBtn}
                        </span>
                      </Tooltip>
                    ) : changeSettingsBtn }
                    <Button
                      variant="secondary"
                      isDisabled={pristine}
                      onClick={() => reset()}
                    >
                      Cancel
                    </Button>
                  </ActionGroup>
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
  masterAPIEndpoint: PropTypes.string.isRequired,
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
  provider: PropTypes.string,
};

export default EditClusterRoutersCard;
