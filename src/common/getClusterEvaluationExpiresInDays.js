import get from 'lodash/get';
import moment from 'moment';

const getClusterEvaluationExpiresInDays = (cluster) => {
  const clusterCreationTime = get(cluster, 'creation_timestamp', false);

  if (clusterCreationTime) {
    const clusterRunningInDays = moment().diff(clusterCreationTime, 'days');
    const evaluationExpiresInDays = Math.max(60 - clusterRunningInDays, 0);
    return `${evaluationExpiresInDays} day${evaluationExpiresInDays === 1 ? '' : 's'}`;
  }

  return 'unknown days';
};

export default getClusterEvaluationExpiresInDays;
