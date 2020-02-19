import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router';
import { Field } from 'redux-form';
import { Link } from 'react-router-dom';
import {
  Card,
  CardFooter,
  Grid,
  GridItem,
  Form,
  CardBody,
  Button,
  FormGroup,
  PageSection,
} from '@patternfly/react-core';
import { PageHeader, PageHeaderTitle } from '@redhat-cloud-services/frontend-components';

import ReduxVerticalFormGroup from '../../common/ReduxFormComponents/ReduxVerticalFormGroup';
import ErrorModal from '../../common/ErrorModal';
import Breadcrumbs from '../common/Breadcrumbs';
import RadioButtons from '../../common/ReduxFormComponents/RadioButtons';
import {
  required,
  checkClusterDisplayName,
  checkClusterUUID,
  checkDisconnectedConsoleURL,
  checkDisconnectedvCPU,
  checkDisconnectedSockets,
  checkDisconnectedMemCapacity,
  checkDisconnectedNodeCount,
} from '../../../common/validators';
import constants from './RegisterClusterHelper';

class RegisterCluster extends React.Component {
  state = {
    systemType: 'physical',
  }

  componentDidMount() {
    this.reset();
  }

  componentDidUpdate() {
    const { registerClusterResponse, openModal, isOpen } = this.props;
    if (registerClusterResponse.error && !isOpen) {
      openModal('register-cluster-error');
    }
  }

  componentWillUnmount() {
    this.reset();
  }

  toggleSystemType = (_, value) => {
    const { change, untouch } = this.props;
    if (value === 'physical') {
      change('socket_num', '');
      untouch('socket_num');
    } else {
      change('cpu', '');
      untouch('vcpu_num');
    }
    this.setState({ systemType: value });
  }

  reset() {
    const {
      resetResponse, resetForm,
    } = this.props;
    resetResponse();
    resetForm();
  }

  render() {
    const {
      handleSubmit,
      registerClusterResponse,
      isOpen,
      resetResponse,
    } = this.props;
    const { systemType } = this.state;

    if (registerClusterResponse.fulfilled) {
      return (
        <Redirect to={`/details/${registerClusterResponse.cluster.id}`} />
      );
    }

    const errorModal = isOpen && (
      <ErrorModal
        title="Error Registering Cluster"
        errorResponse={registerClusterResponse}
        resetResponse={resetResponse}
      />
    );

    return (
      <>
        <PageHeader>
          <Breadcrumbs path={[
            { label: 'Clusters' },
            { label: 'Cluster registration' },
          ]}
          />
          <PageHeaderTitle title="Cluster registration" />
        </PageHeader>
        <PageSection>
          {errorModal}
          <Card id="register-cluster">
            <CardBody>
              <Grid>
                <GridItem span={8}>
                  <Form onSubmit={handleSubmit}>
                    <Field
                      component={ReduxVerticalFormGroup}
                      name="cluster_id"
                      label="Cluster ID"
                      type="text"
                      extendedHelpText={constants.clusterIDHint}
                      disabled={registerClusterResponse.pending}
                      validate={checkClusterUUID}
                      isRequired
                    />
                    <Field
                      component={ReduxVerticalFormGroup}
                      name="display_name"
                      label="Display name"
                      type="text"
                      disabled={registerClusterResponse.pending}
                      validate={checkClusterDisplayName}
                    />
                    <Field
                      component={ReduxVerticalFormGroup}
                      name="web_console_url"
                      label="Web console URL"
                      validate={checkDisconnectedConsoleURL}
                      disabled={registerClusterResponse.pending}
                      type="text"
                    />
                    <FormGroup
                      label="Operating system"
                      isRequired
                      fieldId="operating_system"
                    >
                      <Field
                        component={RadioButtons}
                        name="operating_system"
                        options={[{ value: 'Red Hat Enterprise Linux CoreOS', label: 'Red Hat Enterprise Linux CoreOS' },
                          { value: 'Red Hat Enterprise Linux', label: 'Red Hat Enterprise Linux' }]}
                        disabled={registerClusterResponse.pending}
                        defaultValue="Red Hat Enterprise Linux CoreOS"
                      />
                    </FormGroup>
                    <FormGroup
                      label="System type"
                      isRequired
                      fieldId="system_type"
                    >
                      <Field
                        component={RadioButtons}
                        name="system_type"
                        options={[{ value: 'physical', label: 'Physical' },
                          { value: 'virtual', label: 'Virtual' }]}
                        defaultValue="physical"
                        disabled={registerClusterResponse.pending}
                        onChange={this.toggleSystemType}
                      />
                    </FormGroup>
                    {systemType === 'physical' && (
                    <Field
                      component={ReduxVerticalFormGroup}
                      name="socket_num"
                      label="Number of sockets or LAPRs"
                      inputMode="numeric"
                      disabled={registerClusterResponse.pending}
                      validate={[required, checkDisconnectedSockets]}
                      isRequired
                    />
                    )}
                    {systemType === 'virtual' && (
                    <Field
                      component={ReduxVerticalFormGroup}
                      name="vcpu_num"
                      label="Number of vCPUs"
                      inputMode="numeric"
                      disabled={registerClusterResponse.pending}
                      validate={checkDisconnectedvCPU}
                      isRequired
                    />
                    )}
                    <Field
                      component={ReduxVerticalFormGroup}
                      name="memory_gib"
                      label="Memory capacity (GiB)"
                      inputMode="numeric"
                      validate={checkDisconnectedMemCapacity}
                      step="any"
                      disabled={registerClusterResponse.pending}
                    />
                    <Field
                      component={ReduxVerticalFormGroup}
                      name="nodes_compute"
                      label="Number of compute nodes"
                      inputMode="numeric"
                      validate={checkDisconnectedNodeCount}
                      disabled={registerClusterResponse.pending}
                    />
                  </Form>
                </GridItem>
              </Grid>
            </CardBody>
            <CardFooter>
              <Button variant="primary" type="submit" onClick={handleSubmit} isDisabled={registerClusterResponse.pending}>Register cluster</Button>
              <Link to="/">
                <Button variant="secondary" isDisabled={registerClusterResponse.pending}>Cancel</Button>
              </Link>
            </CardFooter>
          </Card>
        </PageSection>
      </>
    );
  }
}

RegisterCluster.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  registerClusterResponse: PropTypes.object.isRequired,
  openModal: PropTypes.func,
  resetResponse: PropTypes.func.isRequired,
  isOpen: PropTypes.bool,
  resetForm: PropTypes.func.isRequired,
  change: PropTypes.func.isRequired,
  untouch: PropTypes.func.isRequired,
};

export default RegisterCluster;
