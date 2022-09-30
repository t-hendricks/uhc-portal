import type { AxiosResponse } from 'axios';
import type { ActionType } from 'redux-promise-middleware';
import type { SelfResourceReview } from '../types/authorizations.v1/models/SelfResourceReview';
import type { BaseRequestState } from './types';

const INVALIDATE_ACTION = <T extends string>(base: T): `${T}_INVALIDATE` => `${base}_INVALIDATE`;

// redux-middleware-promise
const FULFILLED_ACTION = <T extends string>(base: T): `${T}_${typeof ActionType.Fulfilled}` =>
  `${base}_FULFILLED`;
const PENDING_ACTION = <T extends string>(base: T): `${T}_${typeof ActionType.Pending}` =>
  `${base}_PENDING`;
const REJECTED_ACTION = <T extends string>(base: T): `${T}_${typeof ActionType.Rejected}` =>
  `${base}_REJECTED`;

/** Build a dict mapping a cluster ID to a specific permission state
 * @param {*} response - a response from selfResourceReview
 */
const buildPermissionDict = (
  response: AxiosResponse<SelfResourceReview>,
): { [clusterID: string]: boolean } => {
  const ret: { [clusterID: string]: boolean } = {};
  if (!response || !response.data || !response.data.cluster_ids) {
    return ret;
  }
  response.data.cluster_ids.forEach((clusterID) => {
    ret[clusterID] = true;
  });
  return ret;
};

const actionTypes = {
  INVALIDATE_ACTION,
  FULFILLED_ACTION,
  PENDING_ACTION,
  REJECTED_ACTION,
};

const baseRequestState: BaseRequestState = {
  error: false,
  errorMessage: '',
  errorDetails: null,
  pending: false,
  fulfilled: false,
};

export {
  INVALIDATE_ACTION,
  FULFILLED_ACTION,
  PENDING_ACTION,
  REJECTED_ACTION,
  actionTypes,
  baseRequestState,
  buildPermissionDict,
};
