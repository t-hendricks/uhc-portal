import type { STSAccountRoles } from './STSAccountRoles';

export type STSAccountRolesList = {
  kind: 'AccountRolesList';
  ['aws_acccount_id']: string;
  items: STSAccountRoles[];
};
