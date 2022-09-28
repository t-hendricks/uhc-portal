import { persistentStorageConstants } from '../constants';
import { clusterService } from '../../services';

const getPersistentStorage = () =>
  clusterService
    .getStorageQuotaValues()
    .then((storageQuotaValuesResponse) => storageQuotaValuesResponse.data.items);

const getPersistentStorageValues = () => (dispatch) =>
  dispatch({
    type: persistentStorageConstants.GET_PERSISTENT_STORAGE_VALUES,
    payload: getPersistentStorage(),
  });

export default getPersistentStorageValues;
