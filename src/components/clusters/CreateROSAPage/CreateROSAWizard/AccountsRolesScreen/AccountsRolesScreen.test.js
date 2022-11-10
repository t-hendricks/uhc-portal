import * as rosaActions from '../rosaActions';
import * as acctRoles from './AccountsRolesScreen';

describe('AccountRolesScreen', () => {
  describe('isUserRoleForSelectedAWSAccount', () => {
    it('returns false when no user detected', () => {
      const users = '';
      const selectedAwsAcctId = '000000000006';
      const usersByAcctIds = rosaActions.normalizeSTSUsersByAWSAccounts(users);
      expect(usersByAcctIds.length).toEqual(0);
      const result = acctRoles.isUserRoleForSelectedAWSAccount(usersByAcctIds, selectedAwsAcctId);
      expect(result).toBeFalsy();
    });

    it('returns true when user detected which matches selected aws account', () => {
      const users = 'arn:aws:iam::000000000006:role/ManagedOpenShift-User-dtaylor-ocm-Role';
      const selectedAwsAcctId = '000000000006';
      const usersByAcctIds = rosaActions.normalizeSTSUsersByAWSAccounts(users);
      expect(usersByAcctIds.length).toEqual(1);
      const result = acctRoles.isUserRoleForSelectedAWSAccount(usersByAcctIds, selectedAwsAcctId);
      expect(result).toBeTruthy();
    });

    it('returns false when user detected but their aws acct doesnt matches selected aws account', () => {
      const users = 'arn:aws:iam::000000000006:role/ManagedOpenShift-User-dtaylor-ocm-Role';
      const selectedAwsAcctId = '119733383077';
      const usersByAcctIds = rosaActions.normalizeSTSUsersByAWSAccounts(users);
      expect(usersByAcctIds.length).toEqual(1);
      const result = acctRoles.isUserRoleForSelectedAWSAccount(usersByAcctIds, selectedAwsAcctId);
      expect(result).toBeFalsy();
    });

    it('returns true when multiple users detected and one matches selected aws account', () => {
      const users =
        'arn:aws:iam::000000000006:role/ManagedOpenShift-User-dtaylor-ocm-Role,' +
        'arn:aws:iam::119733383044:role/ManagedOpenShift-User-foobar-ocm-Role';
      const selectedAwsAcctId = '119733383044';
      const usersByAcctIds = rosaActions.normalizeSTSUsersByAWSAccounts(users);
      expect(usersByAcctIds.length).toEqual(2);
      const result = acctRoles.isUserRoleForSelectedAWSAccount(usersByAcctIds, selectedAwsAcctId);
      expect(result).toBeTruthy();
    });
  });
});
