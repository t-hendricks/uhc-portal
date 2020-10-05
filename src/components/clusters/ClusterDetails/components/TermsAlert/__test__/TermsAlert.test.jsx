import React from 'react';
import { shallow } from 'enzyme';

import TermsAlert from '../TermsAlert';
import * as Fixtures from './TermsAlert.fixtures';
import { buildUrlParams } from '../../../../../../common/queryHelpers';

describe('<TermsAlert />', () => {
  describe('TermsAlert OCP', () => {
    const props = { ...Fixtures, subscription: { plan: { id: 'OCP' } } };
    const wrapper = shallow(<TermsAlert {...props} />);

    it('should not render', () => {
      expect(wrapper).toMatchObject({});
    });
  });

  describe('TermsAlert has no required terms', () => {
    const props = { ...Fixtures, selfTermsReviewResult: { terms_required: false } };
    const wrapper = shallow(<TermsAlert {...props} />);

    it('should not render', () => {
      expect(wrapper).toMatchObject({});
    });
  });

  describe('TermsAlert has required terms', () => {
    const locationSave = window.location;
    const currentUrl = 'http://cloud.openshift.com/details/123';
    const locationTest = new URL(currentUrl);
    delete window.location;
    window.location = locationTest;
    const wrapper = shallow(<TermsAlert {...Fixtures} />);

    it('should render', () => {
      expect(wrapper).toMatchSnapshot();
    });
    it('should contain link to terms app', () => {
      const params = {
        redirect: currentUrl,
        cancelRedirect: currentUrl,
      };
      const redirectUrl = `${Fixtures.tncUrl}&${buildUrlParams(params)}`;
      const link = wrapper.find('Alert').prop('actionLinks');
      expect(link).toBeDefined();
      expect(link.props.href).toEqual(redirectUrl);
    });

    window.location = locationSave;
  });

  it('should call terms review', () => {
    // not needed for OCP, so it's only called twice.
    expect(Fixtures.selfTermsReview).toHaveBeenCalledTimes(2);
  });
});
