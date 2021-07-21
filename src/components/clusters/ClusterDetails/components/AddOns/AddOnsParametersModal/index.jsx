import { connect } from 'react-redux';
import { reduxForm, reset } from 'redux-form';
import shouldShowModal from '../../../../../common/Modal/ModalSelectors';
import { closeModal } from '../../../../../common/Modal/ModalActions';
import AddOnsParametersModal from './AddOnsParametersModal';
import { addClusterAddOn, updateClusterAddOn, clearClusterAddOnsResponses } from '../AddOnsActions';
import { parameterValuesForEditing } from '../AddOnsHelper';

const reduxFormConfig = {
  form: 'AddOnsParameters',
  enableReinitialize: true,
};

const reduxFormAddOnParameters = reduxForm(reduxFormConfig)(AddOnsParametersModal);

const mapStateToProps = state => ({
  isOpen: shouldShowModal(state, 'add-ons-parameters-modal'),
  addOn: state.modal.data.addOn,
  addOnInstallation: state.modal.data.addOnInstallation,
  isUpdateForm: state.modal.data.isUpdateForm,
  submitClusterAddOnResponse: state.modal.data.isUpdateForm
    ? state.addOns.updateClusterAddOnResponse
    : state.addOns.addClusterAddOnResponse,
  initialValues: parameterValuesForEditing(
    state.modal.data.addOnInstallation, state.modal.data.addOn, state.clusters.details.cluster,
  ),
  cluster: state.clusters.details.cluster,
  quota: state.userProfile.organization.quotaList,
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
          // Ensure all values are strings
          value: value.toString(),
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
