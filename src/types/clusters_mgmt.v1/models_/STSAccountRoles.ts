import type { STSAccountRole } from './STSAccountRole';

export type STSAccountRoles = {
  prefix: string;
  kind: 'AccountRoles';
  items: STSAccountRole[];
};
