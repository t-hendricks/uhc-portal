import get from 'lodash/get';
import moment from 'moment';

const getTrialExpiresInDays = (cluster, isOSD) => {
  let trialEndDate = '';
  if (isOSD) {
    trialEndDate = get(cluster, 'subscription.trial_end_date');
  } else {
    trialEndDate = get(cluster, 'subscription.eval_expiration_date');
  }
  if (trialEndDate) {
    const endsInDays = moment(trialEndDate).diff(moment(), 'days');
    if (endsInDays === 0) {
      return '< 1 day';
    }
    return `${endsInDays} day${endsInDays === 1 ? '' : 's'}`;
  }

  return 'unknown days';
};

const getTrialEndDate = (cluster) => {
  const trialEndDate = get(cluster, 'subscription.trial_end_date');
  if (trialEndDate) {
    return moment(trialEndDate).local().format('dddd, MMMM Do YYYY, h:mm a');
  }

  return 'unknown date';
};

export {
  getTrialExpiresInDays,
  getTrialEndDate,
};
