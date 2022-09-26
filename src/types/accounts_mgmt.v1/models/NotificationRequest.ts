/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { TemplateParameter } from './TemplateParameter';

export type NotificationRequest = {
  bcc_address?: string;
  cluster_id?: string;
  cluster_uuid?: string;
  include_red_hat_associates?: boolean;
  internal_only?: boolean;
  subject?: string;
  subscription_id?: string;
  template_name: string;
  template_parameters?: Array<TemplateParameter>;
};
