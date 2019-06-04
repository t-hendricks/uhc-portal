import PropTypes from 'prop-types';
import React from 'react';
import { Field } from 'redux-form';
import { Col } from 'patternfly-react';
import ReduxVerticalFormGroup from '../../../../common/ReduxFormComponents/ReduxVerticalFormGroup';
import CloudRegionComboBox from './CloudRegionComboBox';
import validators from '../../../../../common/validators';
import ReduxCheckbox from '../../../../common/ReduxFormComponents/ReduxCheckbox';
import { ConfigurationHint, RegionsHint } from './CreateClusterModalHelper';

function ConfigurationForm(props) {
  const {
    header, pending, showDNSBaseDomain,
  } = props;
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
          min="1"
          validate={validators.nodes}
          disabled={pending}
        />

        <Field
          component={ReduxVerticalFormGroup}
          name="region"
          label="AWS region"
          componentClass={CloudRegionComboBox}
          cloudProviderID="aws"
          validate={validators.required}
          disabled={pending}
        />

        <Field
          component={ReduxCheckbox}
          name="multi_az"
          label="Deploy on multiple availability zones"
          disabled={pending}
        />
      </Col>
      <Col sm={4}>
        <ConfigurationHint showDNSBaseDomain={showDNSBaseDomain} />
        <RegionsHint />
      </Col>
    </React.Fragment>
  );
}

ConfigurationForm.propTypes = {
  header: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  pending: PropTypes.bool,
  showDNSBaseDomain: PropTypes.bool,
};

export default ConfigurationForm;
