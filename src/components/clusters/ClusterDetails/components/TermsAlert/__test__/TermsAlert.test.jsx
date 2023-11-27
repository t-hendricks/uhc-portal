import React from 'react';
import { render, screen, checkAccessibility } from '~/testUtils';
import TermsAlert from '../TermsAlert';
import * as Fixtures from './TermsAlert.fixtures';
import { buildUrlParams } from '../../../../../../common/queryHelpers';
import { normalizedProducts } from '../../../../../../common/subscriptionTypes';

describe('<TermsAlert />', () => {
  describe('TermsAlert OCP', () => {
    const props = { ...Fixtures, subscription: { plan: { id: normalizedProducts.OCP } } };
    it('renders an empty object', () => {
      const { container } = render(<TermsAlert {...props} />);
      expect(container).toBeEmptyDOMElement();
    });
  });

  describe('TermsAlert has no required terms', () => {
    const props = { ...Fixtures, selfTermsReviewResult: { terms_required: false } };

    it('renders an empty object', () => {
      const { container } = render(<TermsAlert {...props} />);
      expect(container).toBeEmptyDOMElement();
    });
  });

  describe('TermsAlert has required terms', () => {
    const locationSave = window.location;
    const currentUrl = 'http://cloud.openshift.com/details/123';
    const locationTest = new URL(currentUrl);
    delete window.location;
    window.location = locationTest;

    const selfTermsReview = jest.fn();

    beforeEach(() => {
      selfTermsReview.mockClear();
    });

    afterAll(() => {
      window.location = locationSave;
    });

    it('is accessible', async () => {
      const { container } = render(<TermsAlert {...Fixtures} />);
      await checkAccessibility(container);
    });
    it('should contain link to terms app', () => {
      const params = {
        redirect: currentUrl,
        cancelRedirect: currentUrl,
      };
      const redirectUrl = `${Fixtures.tncUrl}&${buildUrlParams(params)}`;
      render(<TermsAlert {...Fixtures} />);

      expect(screen.getByRole('link', { name: 'View Terms and Conditions' })).toHaveAttribute(
        'href',
        redirectUrl,
      );
    });
  });
});
