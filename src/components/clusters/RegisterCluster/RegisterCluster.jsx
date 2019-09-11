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
  Split,
  SplitItem,
  Title,
} from '@patternfly/react-core';
import { ExclamationCircleIcon } from '@patternfly/react-icons';
// eslint-disable-next-line camelcase
import { global_danger_color_100 } from '@patternfly/react-tokens';

import ReduxVerticalFormGroupPF4 from '../../common/ReduxFormComponents/ReduxVerticalFormGroupPF4';
import Modal from '../../common/Modal/Modal';
import RadioButtons from '../../common/ReduxFormComponents/RadioButtons';
import { required, checkClusterDisplayName, checkClusterUUID } from '../../../common/validators';
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
      resetResponse,
      closeModal,
      isOpen,
    } = this.props;
    const { systemType } = this.state;

    if (registerClusterResponse.fulfilled) {
      return (
        <Redirect to={`/details/${registerClusterResponse.cluster.id}`} />
      );
    }

    const close = () => {
      resetResponse();
      closeModal();
    };

    const errorModal = (
      <Modal
        header={(
          <Title size="2xl">
            <ExclamationCircleIcon color={global_danger_color_100.value} />
            {' '}
            Unable to register cluster
          </Title>
        )}
        primaryText="Close"
        onPrimaryClick={close}
        onClose={close}
        showClose={false}
        showSecondery={false}
      >
        <p>
          {registerClusterResponse.errorMessage}
        </p>
        <p>
          {`Operation ID: ${registerClusterResponse.operationID || 'N/A'}`}
        </p>
      </Modal>
    );

    return (
      <React.Fragment>
        <div id="register-cluster-top-row" className="top-row">
          <Split>
            <SplitItem>
              <Title headingLevel="h1" size="4xl" className="vertical-align">Cluster registration</Title>
            </SplitItem>
          </Split>
        </div>
        {isOpen && errorModal}
        <Card id="register-cluster">
          <CardBody>
            <Grid>
              <GridItem span={8}>
                <Form onSubmit={handleSubmit}>
                  <Field
                    component={ReduxVerticalFormGroupPF4}
                    name="cluster_id"
                    label="Cluster ID"
                    type="text"
                    extendedHelpText={constants.clusterIDHint}
                    disabled={registerClusterResponse.pending}
                    validate={checkClusterUUID}
                    isRequired
                  />
                  <Field
                    component={ReduxVerticalFormGroupPF4}
                    name="display_name"
                    label="Display name"
                    type="text"
                    disabled={registerClusterResponse.pending}
                    validate={checkClusterDisplayName}
                  />
                  <Field
                    component={ReduxVerticalFormGroupPF4}
                    name="web_console_url"
                    label="Web console URL"
                    disabled={registerClusterResponse.pending}
                    type="text"
                  />
                  <FormGroup
                    label="Operating System"
                    isRequired
                    fieldId="operating_system"
                  >
                    <Field
                      component={RadioButtons}
                      name="operating_system"
                      options={[{ value: 'Red Hat Enterprise Linux CoreOS', label: 'Red Hat Enterprise Linux CoreOS' },
                        { value: 'Red Hat Enterprise Linux', label: 'Red Hat Enterprise Linux' }]}
                      validate={required}
                      disabled={registerClusterResponse.pending}
                      defaultValue="Red Hat Enterprise Linux CoreOS"
                    />
                  </FormGroup>
                  <FormGroup
                    label="System Type"
                    isRequired
                    fieldId="system_type"
                  >
                    <Field
                      component={RadioButtons}
                      name="system_type"
                      options={[{ value: 'physical', label: 'Physical' },
                        { value: 'virtual', label: 'Virtual' }]}
                      validate={required}
                      defaultValue="physical"
                      disabled={registerClusterResponse.pending}
                      onChange={this.toggleSystemType}
                    />
                  </FormGroup>
                  {systemType === 'physical' && (
                  <Field
                    component={ReduxVerticalFormGroupPF4}
                    name="socket_num"
                    label="Number of sockets or LAPRs"
                    type="number"
                    disabled={registerClusterResponse.pending}
                    validate={required}
                    isRequired
                  />
                  )}
                  {systemType === 'virtual' && (
                  <Field
                    component={ReduxVerticalFormGroupPF4}
                    name="cpu"
                    label="Number of vCPUs"
                    type="number"
                    disabled={registerClusterResponse.pending}
                    validate={required}
                    isRequired
                  />
                  )}
                  <Field
                    component={ReduxVerticalFormGroupPF4}
                    name="memory_gib"
                    label="Memory capacity (GiB)"
                    type="number"
                    step="any"
                    disabled={registerClusterResponse.pending}
                  />
                  <Field
                    component={ReduxVerticalFormGroupPF4}
                    name="nodes_compute"
                    label="Number of compute nodes"
                    type="number"
                    disabled={registerClusterResponse.pending}
                  />
                </Form>
              </GridItem>
            </Grid>
          </CardBody>
          <CardFooter>
            <Button variant="primary" type="submit" onClick={handleSubmit} disabled={registerClusterResponse.pending}>Register cluster</Button>
            <Link to="/">
              <Button variant="secondary" disabled={registerClusterResponse.pending}>Cancel</Button>
            </Link>
          </CardFooter>
        </Card>
      </React.Fragment>
    );
  }
}

RegisterCluster.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  registerClusterResponse: PropTypes.object.isRequired,
  openModal: PropTypes.func,
  closeModal: PropTypes.func,
  resetResponse: PropTypes.func.isRequired,
  isOpen: PropTypes.bool,
  resetForm: PropTypes.func.isRequired,
};

export default RegisterCluster;
