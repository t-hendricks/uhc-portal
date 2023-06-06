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
import { asyncValidateClusterName } from '~/common/validators';

const reduxFormConfig = {
  form: 'CreateCluster',
  onSubmitFail: scrollToFirstField,
  keepDirtyOnReinitialize: true,
  updateUnregisteredFields: true,
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true, // TODO is this needed?
  enableReinitialize: true,
  touchOnChange: true,
  asyncBlurFields: ['name'],
  asyncValidate: async (values) => {
    const clusterNameErrorMessage = await asyncValidateClusterName(values.name);
    if (clusterNameErrorMessage) {
      // eslint-disable-next-line no-throw-literal
      throw { name: clusterNameErrorMessage };
    }
  },
};

const wizardConnector = (component) => reduxForm(reduxFormConfig)(component);
export default wizardConnector;
