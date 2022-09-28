export enum RosaCliCommand {
  UserRole = 'rosa create user-role',
  LinkUserRole = 'rosa link user-role <arn>',
  OcmRole = 'rosa create ocm-role',
  AdminOcmRole = 'rosa create ocm-role --admin',
  LinkOcmRole = 'rosa link ocm-role <arn>',
}
