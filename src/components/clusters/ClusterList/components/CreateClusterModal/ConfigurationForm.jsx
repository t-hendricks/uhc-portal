import PropTypes from 'prop-types';
import React from 'react';
import { Field } from 'redux-form';
import { Col } from 'patternfly-react';
import ReduxVerticalFormGroup from '../../../../common/ReduxFormComponents/ReduxVerticalFormGroup';
import CloudRegionComboBox from './CloudRegionComboBox';
import validators, { required } from '../../../../../common/validators';
import ReduxCheckbox from '../../../../common/ReduxFormComponents/ReduxCheckbox';
import { ConfigurationHint, RegionsHint } from './CreateClusterModalHelper';
import minValueSelector from '../../../common/EditClusterDialog/EditClusterSelectors';

class ConfigurationForm extends React.Component {
  state = {
    isMultiAz: false,
  };

  handleMultiAZChange = (event) => {
    const { touch } = this.props;
    this.setState({ isMultiAz: event.target.checked });
    // mark Nodes input as touched to make sure validation is shown even if it's not touched.
    touch('nodes_compute');
  };

  validateNodes = (nodeCount) => {
    const { isMultiAz } = this.state;
    const min = minValueSelector(isMultiAz);
    return validators.nodes(nodeCount, min);
  }

  render() {
    const {
      header, pending, showDNSBaseDomain,
    } = this.props;
    const { isMultiAz } = this.state;
    const min = minValueSelector(isMultiAz);
    return (
      <React.Fragment>
        <h3>{header}</h3>
        <Col sm={5}>
          <Field
            component={ReduxVerticalFormGroup}
            name="name"
            label="Cluster name"
            type="text"
            validate={validators.checkClusterName}
            disabled={pending}
          />

          {showDNSBaseDomain && (
            <Field
              component={ReduxVerticalFormGroup}
              name="dns_base_domain"
              label="Base DNS domain"
              type="text"
              validate={validators.checkBaseDNSDomain}
              disabled={pending}
              normalize={value => value.toLowerCase()}
            />
          )}

          <Field
            component={ReduxVerticalFormGroup}
            name="nodes_compute"
            label="Compute nodes"
            type="number"
            min={min.value}
            // Wrapper anonymous function needed here to call "validateNodes" to "replace"
            // the validation func on this field, re-triggering validation when the multiAZ
            // checkbox changes.
            validate={nodesCount => this.validateNodes(nodesCount)}
            disabled={pending}
          />

          <Field
            component={ReduxVerticalFormGroup}
            name="region"
            label="AWS region"
            componentClass={CloudRegionComboBox}
            cloudProviderID="aws"
            validate={required}
            disabled={pending}
          />

          <Field
            component={ReduxCheckbox}
            name="multi_az"
            label="Deploy on multiple availability zones"
            disabled={pending}
            onChange={this.handleMultiAZChange}
          />
        </Col>
        <Col sm={4}>
          <ConfigurationHint showDNSBaseDomain={showDNSBaseDomain} />
          <RegionsHint />
        </Col>
      </React.Fragment>
    );
  }
}

ConfigurationForm.propTypes = {
  header: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  touch: PropTypes.func.isRequired,
  pending: PropTypes.bool,
  showDNSBaseDomain: PropTypes.bool,
};

export default ConfigurationForm;
