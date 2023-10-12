import { groupTagHitsByGroups } from '../overviewHelpers';

describe('groupTagHitsByGroups', () => {
  let hits = {};
  let groups = [];

  const okReturnValue = {
    Group1: { count: 3, tags: 'tag1' },
    Group2: { count: 5, tags: 'tag1,tag2' },
    Group3: { count: 6, tags: 'tag1,tag2,tag3' },
  };

  beforeEach(() => {
    hits = { tag1: 3, tag2: 2, tag3: 1 };
    groups = [
      { title: 'Group1', tags: ['tag1'] },
      { title: 'Group2', tags: ['tag1', 'tag2'] },
      { title: 'Group3', tags: ['tag1', 'tag2', 'tag3'] },
    ];
  });

  it('returns groups with theirs count and tags', () => {
    expect(groupTagHitsByGroups(hits, groups)).toStrictEqual(okReturnValue);
  });

  it('does not count unknown tags', () => {
    groups[2].tags = ['tag42'];
    expect(groupTagHitsByGroups(hits, groups)).toStrictEqual({
      Group1: { count: 3, tags: 'tag1' },
      Group2: { count: 5, tags: 'tag1,tag2' },
      Group3: { count: 0, tags: 'tag42' },
    });
  });

  it('does not count tags not presented in groups', () => {
    hits.tag42 = 2;
    expect(groupTagHitsByGroups(hits, groups)).toStrictEqual(okReturnValue);
  });
});
