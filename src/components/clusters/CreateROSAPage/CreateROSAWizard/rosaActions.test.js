import * as rosaActions from './rosaActions';

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
    it('returns correct array of AWSAccountRoles objects', () => {
      const acountRolesList = {
        kind: 'AccountRolesList',
        aws_acccount_id: '765374464689',
        items: [
          {
            prefix: 'croche-test',
            kind: 'AccountRoles',
            items: [
              {
                arn: 'arn:aws:iam::765374464689:role/croche-test-ControlPlane-Role',
                type: 'ControlPlane',
              },
              {
                arn: 'arn:aws:iam::765374464689:role/croche-test-Installer-Role',
                type: 'Installer',
              },
              {
                arn: 'arn:aws:iam::765374464689:role/croche-test-Support-Role',
                type: 'Support',
              },
              {
                arn: 'arn:aws:iam::765374464689:role/croche-test-Worker-Role',
                type: 'Worker',
              },
            ],
          },
          {
            prefix: 'ManagedOpenShift',
            kind: 'AccountRoles',
            items: [
              {
                arn: 'arn:aws:iam::765374464689:role/ManagedOpenShift-ControlPlane-Role',
                type: 'ControlPlane',
              },
              {
                arn: 'arn:aws:iam::765374464689:role/ManagedOpenShift-Installer-Role',
                type: 'Installer',
              },
              {
                arn: 'arn:aws:iam::765374464689:role/ManagedOpenShift-Support-Role',
                type: 'Support',
              },
              {
                arn: 'arn:aws:iam::765374464689:role/ManagedOpenShift-Worker-Role',
                type: 'Worker',
              },
            ],
          },
        ],
      };

      const AWSAccountRoles = rosaActions.normalizeAWSAccountRoles(acountRolesList);
      expect(AWSAccountRoles.length).toEqual(2);

      // prefix = 'croche-test'
      expect(AWSAccountRoles[0].Installer).toEqual(
        'arn:aws:iam::765374464689:role/croche-test-Installer-Role',
      );
      expect(AWSAccountRoles[0].ControlPlane).toEqual(
        'arn:aws:iam::765374464689:role/croche-test-ControlPlane-Role',
      );
      // prefix = 'ManagedOpenShift'
      expect(AWSAccountRoles[1].Installer).toEqual(
        'arn:aws:iam::765374464689:role/ManagedOpenShift-Installer-Role',
      );
      expect(AWSAccountRoles[1].Support).toEqual(
        'arn:aws:iam::765374464689:role/ManagedOpenShift-Support-Role',
      );
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
