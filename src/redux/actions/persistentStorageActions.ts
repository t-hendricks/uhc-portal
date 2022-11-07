import { action, ActionType } from 'typesafe-actions';
import { persistentStorageConstants } from '../constants';
import { clusterService } from '../../services';

const getPersistentStorage = () =>
  clusterService
    .getStorageQuotaValues()
    .then((storageQuotaValuesResponse) => storageQuotaValuesResponse.data.items);

const getPersistentStorageValues = () =>
  action(persistentStorageConstants.GET_PERSISTENT_STORAGE_VALUES, getPersistentStorage());

type PersistentStorageAction = ActionType<typeof getPersistentStorageValues>;

export { PersistentStorageAction };

export default getPersistentStorageValues;
