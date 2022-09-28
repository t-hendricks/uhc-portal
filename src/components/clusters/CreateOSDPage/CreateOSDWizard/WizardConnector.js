/**
 * The wizard connector connects a wizard screen to reduxForm,
 * with the correct flags for proper wizard functionality.
 *
 * Each wizard screen is connected individually,
 * to allow configuring redux-form for proper wizard operation
 * and to make it easier for each screen to be self-contained.
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
  enableReinitialize: true,
  touchOnChange: true,
};

const wizardConnector = (component) => reduxForm(reduxFormConfig)(component);
export default wizardConnector;
