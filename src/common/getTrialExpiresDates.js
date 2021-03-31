import get from 'lodash/get';
import moment from 'moment';

const getTrialExpiresInDays = (cluster) => {
  const trialEndDate = get(cluster, 'subscription.trial_end_date');
  if (trialEndDate) {
    const endsInDays = moment(trialEndDate).diff(moment(), 'days');
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
