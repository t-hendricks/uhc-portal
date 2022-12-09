export enum RosaCliCommand {
  UserRole = 'rosa create user-role',
  LinkUserRole = 'rosa link user-role <arn>',
  OcmRole = 'rosa create ocm-role',
  AdminOcmRole = 'rosa create ocm-role --admin',
  LinkOcmRole = 'rosa link ocm-role <arn>',
  VerifyQuota = 'rosa verify quota',
  WhoAmI = 'rosa whoami',
  CreateAccountRoles = 'rosa create account-roles -mode auto',
  CreateCluster = 'rosa create cluster',
}
