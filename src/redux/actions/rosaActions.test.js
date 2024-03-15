import * as rosaActions from './rosaActions';
import accountRolesList from './rosaActionsMockAccountRolesList';

describe('rosaActions', () => {
  describe('getAWSIDsFromARNs', () => {
    it('return empty array when no ARNs provided', () => {
      const arns = [];
      const ids = rosaActions.getAWSIDsFromARNs(arns);
      expect(ids.length).toEqual(0);
    });

    it('return single aws account id', () => {
      const arns = ['arn:aws:iam::269733383011:role/ManagedOpenShift-OCM-Role-15212158'];
      const ids = rosaActions.getAWSIDsFromARNs(arns);
      expect(ids.length).toEqual(1);
      expect(ids[0]).toEqual('269733383011');
    });

    it('return two aws account ids', () => {
      const arns = [
        'arn:aws:iam::269733383011:role/ManagedOpenShift-OCM-Role-15212158',
        'arn:aws:iam::269733383022:role/ManagedOpenShift-OCM-Role-15212156',
      ];
      const ids = rosaActions.getAWSIDsFromARNs(arns);
      expect(ids.length).toEqual(2);
      expect(ids).toContain('269733383011');
      expect(ids).toContain('269733383022');
    });

    it('return two aws account ids (ignore duplicates)', () => {
      const arns = [
        'arn:aws:iam::269733383011:role/ManagedOpenShift-OCM-Role-15212158',
        'arn:aws:iam::269733383022:role/ManagedOpenShift-OCM-Role-15212156',
        'arn:aws:iam::269733383011:role/ManagedOpenShift-OCM-Role-15212158',
      ];
      const ids = rosaActions.getAWSIDsFromARNs(arns);
      expect(ids.length).toEqual(2);
      expect(ids).toContain('269733383011');
      expect(ids).toContain('269733383022');
    });
  });

  describe('normalizeAWSAccountRoles', () => {
    it.each([
      ['myManagedRoles', true],
      ['myUnManagedRoles', false],
      ['bothRoles', true],
      ['bothRoles', false],
    ])('normalizedAWSAccountRoles return expected result for %s', (expectedPrefix, isManaged) => {
      const myRoles = rosaActions
        .normalizeAWSAccountRoles(accountRolesList)
        .find(
          ({ prefix, managedPolicies, hcpManagedPolicies }) =>
            expectedPrefix === prefix &&
            managedPolicies === isManaged &&
            hcpManagedPolicies === isManaged,
        );
      expect(myRoles).not.toBeUndefined();
      if (isManaged) {
        expect(myRoles.managedPolicies).toBeTruthy();
        expect(myRoles.managedPolicies).toBeTruthy();
        expect(myRoles.Installer).toEqual(
          `arn:aws:iam::123456789012:role/${expectedPrefix}-HCP-ROSA-Installer-Role`,
        );
        expect(myRoles.Support).toEqual(
          `arn:aws:iam::123456789012:role/${expectedPrefix}-HCP-ROSA-Support-Role`,
        );
        expect(myRoles.Worker).toEqual(
          `arn:aws:iam::123456789012:role/${expectedPrefix}-HCP-ROSA-Worker-Role`,
        );
        expect(myRoles.ControlPlane).toBeUndefined();
      } else {
        // not managed
        expect(myRoles.managedPolicies).toBeFalsy();
        expect(myRoles.managedPolicies).toBeFalsy();
        expect(myRoles.Installer).toEqual(
          `arn:aws:iam::123456789012:role/${expectedPrefix}-Installer-Role`,
        );
        expect(myRoles.Support).toEqual(
          `arn:aws:iam::123456789012:role/${expectedPrefix}-Support-Role`,
        );
        expect(myRoles.Worker).toEqual(
          `arn:aws:iam::123456789012:role/${expectedPrefix}-Worker-Role`,
        );
        expect(myRoles.ControlPlane).toEqual(
          `arn:aws:iam::123456789012:role/${expectedPrefix}-ControlPlane-Role`,
        );
      }
    });

    it('Ignores poorly formed role', () => {
      const oddRole = rosaActions
        .normalizeAWSAccountRoles(accountRolesList)
        .find(({ prefix }) => prefix === 'oddRole');
      expect(oddRole).toBeUndefined();
    });
  });

  describe('normalizeSTSUsersByAWSAccounts', () => {
    it('return empty array when no users provided', () => {
      const users = '';
      const usersByAcctIds = rosaActions.normalizeSTSUsersByAWSAccounts(users);
      expect(usersByAcctIds.length).toEqual(0);
    });

    it('return single user and account id', () => {
      const users = 'arn:aws:iam::000000000006:role/ManagedOpenShift-User-dtaylor-ocm-Role';
      const usersByAcctIds = rosaActions.normalizeSTSUsersByAWSAccounts(users);
      expect(usersByAcctIds.length).toEqual(1);
      expect(usersByAcctIds[0].aws_id).toEqual('000000000006');
      expect(usersByAcctIds[0].sts_user).toEqual('ManagedOpenShift-User-dtaylor-ocm-Role');
    });

    it('return two users and account ids', () => {
      const users =
        'arn:aws:iam::000000000006:role/ManagedOpenShift-User-dtaylor-ocm-Role,' +
        'arn:aws:iam::119733383044:role/ManagedOpenShift-User-foobar-ocm-Role';
      const usersByAcctIds = rosaActions.normalizeSTSUsersByAWSAccounts(users);
      expect(usersByAcctIds.length).toEqual(2);
      expect(usersByAcctIds[0].aws_id).toEqual('000000000006');
      expect(usersByAcctIds[0].sts_user).toEqual('ManagedOpenShift-User-dtaylor-ocm-Role');
      expect(usersByAcctIds[1].aws_id).toEqual('119733383044');
      expect(usersByAcctIds[1].sts_user).toEqual('ManagedOpenShift-User-foobar-ocm-Role');
    });
  });
});
