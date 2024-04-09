import { action, ActionType } from 'typesafe-actions';

import type { ProductTechnologyPreview } from '../../types/clusters_mgmt.v1';
import { clustersConstants } from '../constants';
import { FULFILLED_ACTION, PENDING_ACTION, REJECTED_ACTION } from '../reduxHelpers';

export type TechPreviewActions = ActionType<
  | typeof getTechPreviewStatusPending
  | typeof getTechPreviewStatusError
  | typeof getTechPreviewStatusFulfilled
>;

const getTechPreviewStatusPending = (product: string, type: string) =>
  action(PENDING_ACTION(clustersConstants.GET_TECH_PREVIEW), { product, type });

const getTechPreviewStatusError = (product: string, type: string) =>
  action(REJECTED_ACTION(clustersConstants.GET_TECH_PREVIEW), { product, type });

const getTechPreviewStatusFulfilled = (
  product: string,
  type: string,
  data: ProductTechnologyPreview,
) => action(FULFILLED_ACTION(clustersConstants.GET_TECH_PREVIEW), { product, type, data });

const techPreviewActions = {
  getTechPreviewStatusPending,
  getTechPreviewStatusError,
  getTechPreviewStatusFulfilled,
};

export default techPreviewActions;
