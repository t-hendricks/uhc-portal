import { connect } from 'react-redux';
import { reduxForm, reset } from 'redux-form';
import shouldShowModal from '../../../../../common/Modal/ModalSelectors';
import { closeModal } from '../../../../../common/Modal/ModalActions';
import AddOnsParametersModal from './AddOnsParametersModal';
import { addClusterAddOn, clearClusterAddOnsResponses } from '../AddOnsActions';

const reduxFormConfig = {
  form: 'AddOnsParameters',
};

const reduxFormAddOnParameters = reduxForm(reduxFormConfig)(AddOnsParametersModal);

const mapStateToProps = state => ({
  isOpen: shouldShowModal(state, 'add-ons-parameters-modal'),
  addOn: state.modal.data.addOn,
  addClusterAddOnResponse: state.addOns.addClusterAddOnResponse,
});

const mapDispatchToProps = dispatch => ({
  closeModal: () => dispatch(closeModal()),
  addClusterAddOn: () => dispatch(addClusterAddOn()),
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

    dispatch(addClusterAddOn(props.clusterID, addOnRequest));
    dispatch(closeModal());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(reduxFormAddOnParameters);
