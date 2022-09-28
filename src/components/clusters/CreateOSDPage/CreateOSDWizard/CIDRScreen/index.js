import { connect } from 'react-redux';
import { formValueSelector, getFormInitialValues, getFormValues } from 'redux-form';

import {
  MACHINE_CIDR_DEFAULT,
  SERVICE_CIDR_DEFAULT,
  HOST_PREFIX_DEFAULT,
  podCidrDefaultValue,
} from '../../CreateOSDForm/FormSections/NetworkingSection/networkingConstants';
import wizardConnector from '../WizardConnector';
import CIDRScreen from './CIDRScreen';

const mapStateToProps = (state) => {
  const valueSelector = formValueSelector('CreateCluster');
  const cloudProviderID = valueSelector(state, 'cloud_provider');
  const initialValues = getFormInitialValues('CreateCluster')(state);
  const values = getFormValues('CreateCluster')(state);

  return {
    cloudProviderID,
    isMultiAz: valueSelector(state, 'multi_az') === 'true',
    installToVpcSelected: valueSelector(state, 'install_to_vpc'),
    isDefaultValuesChecked: valueSelector(state, 'cidr_default_values_toggle'),
    initialValues: {
      ...initialValues,
      cidr_default_values_toggle: values.cidr_default_values_toggle ?? true,
      network_machine_cidr: values.network_machine_cidr || MACHINE_CIDR_DEFAULT,
      network_service_cidr: values.network_service_cidr || SERVICE_CIDR_DEFAULT,
      network_pod_cidr: values.network_pod_cidr || podCidrDefaultValue(cloudProviderID),
      network_host_prefix: values.network_host_prefix || HOST_PREFIX_DEFAULT,
    },
  };
};

export default connect(mapStateToProps)(wizardConnector(CIDRScreen));
