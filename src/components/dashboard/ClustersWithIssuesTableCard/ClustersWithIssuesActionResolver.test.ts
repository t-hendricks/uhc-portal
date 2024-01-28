import { Subscription } from '~/types/accounts_mgmt.v1';

import { actionResolver } from './ClustersWithIssuesActionResolver';

describe('ActionResolver', () => {
  it('returns an active item with a link if the subscription has a console URL', () => {
    const actionItems = actionResolver({
      id: 'my-subscription',
      console_url: 'link-to-console',
    } as Subscription);
    expect(actionItems).toHaveLength(1);
    expect(actionItems[0]).toStrictEqual({
      title: 'Open console',
      key: `my-subscription.menu.adminconsole`,
      to: 'link-to-console',
      isExternalLink: true,
      rel: 'noopener noreferrer',
    });
  });

  it('returns an disabled item with a tooltip if the subscription does not have a console URL', () => {
    const actionItems = actionResolver({ id: 'my-subscription', console_url: '' } as Subscription);
    expect(actionItems).toHaveLength(1);
    expect(actionItems[0]).toStrictEqual({
      title: 'Open console',
      key: `my-subscription.menu.adminconsole`,
      component: 'button',
      isAriaDisabled: true,
      tooltipProps: {
        content: 'Admin console is not yet available for this cluster',
      },
    });
  });
});
