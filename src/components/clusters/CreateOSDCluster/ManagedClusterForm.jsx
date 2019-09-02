import PropTypes from 'prop-types';
import React from 'react';
import { Field } from 'redux-form';
import {
  FormGroup,
  GridItem,
} from '@patternfly/react-core';
import ConfigurationForm from './ConfigurationForm';
import AdvancedSettingsForm from './AdvancedSettingsForm';
import RadioButtons from '../../common/ReduxFormComponents/RadioButtons';

class ManagedClusterForm extends React.Component {
  state = {
    mode: 'basic',
  };

  render() {
    const {
      pending,
      touch,
    } = this.props;

    const {
      mode,
    } = this.state;

    const toggleNetwork = (_, value) => {
      this.setState({ mode: value });
    };

    return (
      <React.Fragment>
        <ConfigurationForm
          pending={pending}
          showDNSBaseDomain={false}
          touch={touch}
        />

        <GridItem span={12}>
          <h3>Networking</h3>
          <p>
            You can enable internal/external access to your cluster and choose between two
            networking options: “Basic” or “Advanced”.
          </p>
          <ul>
            <li>
              “Basic” networking creates a new VPC for your cluster using default values.
            </li>
            <li>
              “Advanced” networking allows clusters to use a new VPC with customizable addresses.
            </li>
          </ul>
        </GridItem>

        <GridItem span={4}>
          <FormGroup
            label="Network configuration"
            isRequired
            fieldId="network-congiguration-toggle"
          >
            <Field
              component={RadioButtons}
              name="network-congiguration-toggle"
              disabled={pending}
              onChange={toggleNetwork}
              options={[{ value: 'basic', label: 'Basic' }, { value: 'advanced', label: 'Advanced' }]}
              defaultValue="basic"
            />
          </FormGroup>
        </GridItem>
        <GridItem span={8} />

        { mode === 'advanced' && <AdvancedSettingsForm pending={pending} /> }

      </React.Fragment>
    );
  }
}

ManagedClusterForm.propTypes = {
  pending: PropTypes.bool,
  touch: PropTypes.func.isRequired,
};

export default ManagedClusterForm;
