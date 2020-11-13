import { connect } from 'react-redux';
import { reduxForm, reset } from 'redux-form';
import shouldShowModal from '../../../../../common/Modal/ModalSelectors';
import { closeModal } from '../../../../../common/Modal/ModalActions';
import AddOnsParametersModal from './AddOnsParametersModal';
import { addClusterAddOn, updateClusterAddOn, clearClusterAddOnsResponses } from '../AddOnsActions';

const reduxFormConfig = {
  form: 'AddOnsParameters',
  enableReinitialize: true,
};

const reduxFormAddOnParameters = reduxForm(reduxFormConfig)(AddOnsParametersModal);

const initialValuesForEditing = (addOnInstallation) => {
  const vals = { parameters: {} };
  if (addOnInstallation !== undefined && addOnInstallation.parameters !== undefined) {
    vals.parameters = Object.entries(addOnInstallation.parameters.items).reduce((acc, curr) => {
      // eslint-disable-next-line no-param-reassign
      acc[curr[1].id] = curr[1].value;
      return acc;
    }, {});
  }
  return vals;
};

const mapStateToProps = state => ({
  isOpen: shouldShowModal(state, 'add-ons-parameters-modal'),
  addOn: state.modal.data.addOn,
  addOnInstallation: state.modal.data.addOnInstallation,
  isUpdateForm: state.modal.data.isUpdateForm,
  submitClusterAddOnResponse: state.modal.data.isUpdateForm
    ? state.addOns.updateClusterAddOnResponse
    : state.addOns.addClusterAddOnResponse,
  initialValues: initialValuesForEditing(state.modal.data.addOnInstallation),
});

const mapDispatchToProps = dispatch => ({
  closeModal: () => dispatch(closeModal()),
  addClusterAddOn: () => dispatch(addClusterAddOn()),
  updateClusterAddOn: () => dispatch(updateClusterAddOn()),
  clearClusterAddOnsResponses: () => dispatch(clearClusterAddOnsResponses()),
  resetForm: () => dispatch(reset('AddOnsParameters')),
  onSubmit: (formData, _, props) => {
    const addOnRequest = {
      addon: {
        id: props.addOn.id,
      },
    };

    if (formData.parameters !== undefined) {
      addOnRequest.parameters = {
        items: Object.entries(formData.parameters).map(([key, value]) => ({
          id: key,
          value,
        })),
      };
    }

    if (props.isUpdateForm) {
      dispatch(updateClusterAddOn(props.clusterID, props.addOn.id, addOnRequest));
    } else {
      dispatch(addClusterAddOn(props.clusterID, addOnRequest));
    }
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(reduxFormAddOnParameters);
