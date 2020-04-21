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
      clusterDNSName,
      handleSubmit,
      pristine,
      valid,
      additionalRouterEnabled,
      reset,
      refreshCluster,
    } = this.props;
    return (
      <>
        <Card>
          <CardBody>
            <Form>
              <Grid gutter="md">
                <GridItem span={9}>
                  <Title headingLevel="h2" size="lg" className="card-title networking-tab">Master endpoint API</Title>
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
                    />
                  </div>
                </GridItem>
                <GridItem span={9}>
                  <Title headingLevel="h2" size="lg" className="card-title networking-tab">Default application router</Title>
                  <div className="networking-tab">
                    <ClipboardCopy isReadOnly>
                      {`https://apps.${clusterDNSName}`}
                    </ClipboardCopy>
                  </div>
                  <div className="networking-tab">
                    <Field
                      component={ReduxCheckbox}
                      name="private_default_router"
                      label="Make router private"
                    />
                  </div>
                </GridItem>
                <GridItem span={9}>
                  <Split gutter="md">
                    <SplitItem>
                      <Title headingLevel="h2" size="lg" className="card-title networking-tab">Additional application router</Title>
                    </SplitItem>
                    <SplitItem>
                      <Field
                        component={ReduxCheckbox}
                        isSwitch
                        name="enable_additional_router"
                        labelOff="Not enabled"
                        label="Enabled"
                      />
                    </SplitItem>
                  </Split>
                  {
                  additionalRouterEnabled && (
                    <>
                      <div className="networking-tab">
                        <ClipboardCopy isReadOnly>
                          {`https://apps2.${clusterDNSName}`}
                        </ClipboardCopy>
                      </div>
                      <div className="networking-tab">
                        <Field
                          component={ReduxCheckbox}
                          name="private_additional_router"
                          label="Make router private"
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
                      helpText="Format should be key=value. If no label is specified, all routes will be exposed on both routers."
                      validate={checkRouteSelectors}
                      key="route_selectors"
                      onChange={this.handleChangeRouteSelectors}
                    />
                  </GridItem>
                )
              }
                <GridItem span={9}>
                  <ActionGroup>
                    <Button
                      variant="primary"
                      onClick={this.handleSaveChanges}
                      isDisabled={pristine || !valid}
                    >
                      Change settings
                    </Button>
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
  clusterDNSName: PropTypes.string.isRequired,
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
};

export default EditClusterRoutersCard;
