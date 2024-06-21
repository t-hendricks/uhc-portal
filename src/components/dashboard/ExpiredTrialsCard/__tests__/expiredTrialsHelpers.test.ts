import { expiredTrialsFilter } from '../expiredTrialsHelpers';

describe('expiredTrialsFilter', () => {
  it('expiredTrialsFilter', () =>
    expect(expiredTrialsFilter).toStrictEqual({
      filter: "support_level='None' AND status NOT IN ('Deprovisioned', 'Archived')",
    }));
});
