export const ExtAuthProviders = {
  fulfilled: true,
  data: {
    kind: 'ExternalAuth',
    page: 1,
    size: 1,
    total: 1,
    items: [
      {
        id: 'myprovider1',
        issuer: { url: 'https://redhat.com', audiences: ['audience-abc'] },
        claim: { mappings: { username: { claim: 'email' }, groups: { claim: 'groups' } } },
      },
    ],
  },
};
