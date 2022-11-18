import { connect } from 'react-redux';

import { selfTermsReview } from '../../../redux/actions/userActions';
import TermsGuard from './TermsGuard';

const mapStateToProps = (state) => ({
  selfTermsReviewResult: state.userProfile.selfTermsReviewResult,
});

const mapDispatchToProps = {
  selfTermsReview,
};

export default connect(mapStateToProps, mapDispatchToProps)(TermsGuard);
