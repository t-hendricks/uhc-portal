/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { upgradeRisksPredictors } from './upgradeRisksPredictors';
export type upgradeRisksPrediction = {
  cluster_id: string;
  last_checked_at?: string;
  prediction_status: string;
  upgrade_recommended?: boolean;
  upgrade_risks_predictors?: upgradeRisksPredictors;
};
