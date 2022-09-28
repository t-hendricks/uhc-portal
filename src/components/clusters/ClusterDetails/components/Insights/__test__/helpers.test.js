import { appendCrParamToDocLinks, appendQueryParameter } from '../helpers';

describe('insightsHelpers', () => {
  it('should append query parameter', () => {
    const href1 = 'https://console.redhat.com/test';
    const href2 = 'https://console.redhat.com/test?query=parameter#with-hash';

    expect(appendQueryParameter(href1, 'test', 42)).toEqual(
      'https://console.redhat.com/test?test=42',
    );
    expect(appendQueryParameter(href2, 'test', 42)).toEqual(
      'https://console.redhat.com/test?query=parameter&test=42#with-hash',
    );
  });

  it('should append cr param to docs links', () => {
    const docs1 =
      'Minimum... [Knowledgebase Article](https://docs.openshift.com/container?query=parameter#with-hash) and ... [Knowledgebase Article](https://access.redhat.com/containter)';
    const docs2 =
      'Something with [Knowledgebase Article](https://not-docs.openshift.com/container)';
    const parsed1 = appendCrParamToDocLinks(docs1);
    const parsed2 = appendCrParamToDocLinks(docs2);

    expect(parsed1).toContain(
      'https://docs.openshift.com/container?query=parameter&cr=OCM#with-hash',
    );
    expect(parsed1).toContain('https://access.redhat.com/containter?cr=OCM');
    expect(parsed2).toBe(
      'Something with [Knowledgebase Article](https://not-docs.openshift.com/container)',
    );
  });
});
