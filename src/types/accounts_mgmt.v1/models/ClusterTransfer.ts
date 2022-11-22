/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ObjectReference } from './ObjectReference';

export type ClusterTransfer = ObjectReference & {
  cluster_uuid?: string;
  created_at?: string;
  expiration_date?: string;
  owner?: string;
  pull_secret_rotation_id?: string;
  recipient?: string;
  secret?: string;
  status?: ClusterTransfer.status;
  updated_at?: string;
};

export namespace ClusterTransfer {
  export enum status {
    PENDING = 'Pending',
    ACCEPTED = 'Accepted',
    DECLINED = 'Declined',
    RESCINDED = 'Rescinded',
    COMPLETED = 'Completed',
  }
}
