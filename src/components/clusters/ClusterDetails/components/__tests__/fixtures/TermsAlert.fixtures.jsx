import { defaultSubscription } from '~/components/clusters/common/__tests__/defaultClusterFromSubscription.fixtures';
import { normalizedProducts } from '../../../../../../common/subscriptionTypes';

const tncUrl = 'https://www.redhat.com/wapps/tnc/ackrequired?site=ocm&event=register';

const selfTermsReviewResult = {
  fulfilled: true,
  pending: false,
  error: false,
  terms_available: true,
  terms_required: true,
  redirect_url: tncUrl,
};

const subscription = {
  ...defaultSubscription,
  id: '1234567890',
  plan: { id: normalizedProducts.ROSA, type: normalizedProducts.ROSA },
  status: 'Active',
};

export { tncUrl, selfTermsReviewResult, subscription };
