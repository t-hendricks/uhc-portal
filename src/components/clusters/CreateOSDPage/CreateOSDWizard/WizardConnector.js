/**
 * The wizard connector connects a wizard screen to reduxForm,
 * with the correct flags for proper wizard functionality.
 *
 * Each wizard screen is connected individually,
 * to allow checking form validity only for fields the user filled so far, and not ALL fields
 */
import { reduxForm } from 'redux-form';
import { scrollToFirstError } from '../../../../common/helpers';

const reduxFormConfig = {
  form: 'CreateCluster',
  onSubmitFail: scrollToFirstError,
  keepDirtyOnReinitialize: true,
  updateUnregisteredFields: true,
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true, // TODO is this needed?
};

const wizardConnector = component => reduxForm(reduxFormConfig)(component);
export default wizardConnector;
