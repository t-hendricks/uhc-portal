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
});
