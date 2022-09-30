import { action, ActionType } from 'typesafe-actions';
import { persistentStorageConstants } from '../constants';
import { clusterService } from '../../services';
import type { AppThunk } from '../types';

const getPersistentStorage = () =>
  clusterService
    .getStorageQuotaValues()
    .then((storageQuotaValuesResponse) => storageQuotaValuesResponse.data.items);

const getPersistentStorageValuesAction = () =>
  action(persistentStorageConstants.GET_PERSISTENT_STORAGE_VALUES, getPersistentStorage());

const getPersistentStorageValues = (): AppThunk => (dispatch) =>
  dispatch(getPersistentStorageValuesAction());

type PersistentStorageAction = ActionType<typeof getPersistentStorageValuesAction>;

export { PersistentStorageAction };

export default getPersistentStorageValues;
