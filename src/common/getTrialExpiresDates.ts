import dayjs from 'dayjs';

import { ClusterFromSubscription } from '../types/types';

const getTrialExpiresInDays = (cluster: ClusterFromSubscription, isOSD: boolean): string => {
  let trialEndDate: string | undefined = '';
  if (isOSD) {
    trialEndDate = cluster.subscription?.trial_end_date;
  } else {
    trialEndDate = cluster.subscription?.eval_expiration_date;
  }
  if (trialEndDate) {
    const endsInDays = dayjs(trialEndDate).diff(dayjs(), 'day');
    if (endsInDays === 0) {
      return '< 1 day';
    }
    return `${endsInDays} day${endsInDays === 1 ? '' : 's'}`;
  }

  return 'unknown days';
};

const getTrialEndDate = (cluster: ClusterFromSubscription): string => {
  const trialEndDate = cluster.subscription?.trial_end_date;
  if (trialEndDate) {
    return dayjs.utc(trialEndDate).local().format('dddd, MMMM Do YYYY, h:mm a');
  }

  return 'unknown date';
};

export { getTrialExpiresInDays, getTrialEndDate };
