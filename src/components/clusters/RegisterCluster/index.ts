import { reduxForm } from 'redux-form';

import { REGISTER_CLUSTER_FORM_KEY } from './constants';
import RegisterCluster from './RegisterCluster';

const reduxFormConfig = {
  form: REGISTER_CLUSTER_FORM_KEY,
};

export default reduxForm(reduxFormConfig)(RegisterCluster) as any;
