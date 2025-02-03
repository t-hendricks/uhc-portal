/**
 * The wizard connector connects a wizard screen to reduxForm,
 * with the correct flags for proper wizard functionality.
 *
 * Each wizard screen is connected individually,
 * to allow configuring redux-form for proper wizard operation
 * and to make it easier for each screen to be self-contained.
 */
import { reduxForm } from 'redux-form';

import { scrollToFirstField } from '~/common/helpers';
import { asyncValidateClusterName, asyncValidateDomainPrefix } from '~/common/validators';

const asyncValidate = async (values, dispatch, props, field) => {
  const previousErrors = props.asyncErrors;

  if (field === 'name') {
    const clusterNameErrorMessage = await asyncValidateClusterName(values.name);
    if (clusterNameErrorMessage) {
      // eslint-disable-next-line no-throw-literal
      throw { ...previousErrors, name: clusterNameErrorMessage };
    }
    if (previousErrors?.domain_prefix) {
      // eslint-disable-next-line no-throw-literal
      throw { domain_prefix: previousErrors?.domain_prefix };
    }
  }

  if (field === 'domain_prefix') {
    const domainPrefixErrorMessage = await asyncValidateDomainPrefix(values.domain_prefix);
    if (domainPrefixErrorMessage) {
      // eslint-disable-next-line no-throw-literal
      throw { ...previousErrors, domain_prefix: domainPrefixErrorMessage };
    }
    if (previousErrors?.name) {
      // eslint-disable-next-line no-throw-literal
      throw { name: previousErrors?.name };
    }
  }
};

const reduxFormConfig = {
  form: 'CreateCluster',
  onSubmitFail: scrollToFirstField,
  keepDirtyOnReinitialize: true,
  updateUnregisteredFields: true,
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true, // TODO is this needed?
  enableReinitialize: true,
  touchOnChange: true,
  asyncBlurFields: ['name', 'domain_prefix'],
  asyncValidate,
};

const wizardConnector = (component) => reduxForm(reduxFormConfig)(component);
export default wizardConnector;
