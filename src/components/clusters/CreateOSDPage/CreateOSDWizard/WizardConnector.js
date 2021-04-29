import { reduxForm } from 'redux-form';
import { scrollToFirstError } from '../../../../common/helpers';

const reduxFormConfig = {
  form: 'CreateCluster',
  onSubmitFail: scrollToFirstError,
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true, // is this needed?
};

const wizardConnector = component => reduxForm(reduxFormConfig)(component);
export default wizardConnector;
