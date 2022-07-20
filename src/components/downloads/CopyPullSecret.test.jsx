import React from 'react';
import { shallow } from 'enzyme';
import { Button } from '@patternfly/react-core';

import CopyPullSecret from './CopyPullSecret';
import AnalyticsWrapper from '../../common/AnalyticsWrapper';

const variants = ['link-tooltip', 'link-inplace'];

describe('<CopyPullSecret />', () => {
  describe('with token', () => {
    variants.forEach((variant) => {
      describe(variant, () => {
        const token = { auths: { foo: 'bar' } };
        const wrapper = shallow(<CopyPullSecret variant={variant} token={token} />);

        it('should render', () => {
          expect(wrapper).toMatchSnapshot();
        });
        it('should have Copy', () => {
          const copy = wrapper.find(AnalyticsWrapper).renderProp('render')();
          expect(copy.length).toEqual(1);
          const copyButton = copy.find(Button);
          expect(copyButton.length).toEqual(1);
          expect(copyButton.props().isAriaDisabled).toBeFalsy();
        });
      });
    });
  });

  describe('with error', () => {
    variants.forEach((variant) => {
      describe(variant, () => {
        const token = { error: 'my error' };
        const wrapper = shallow(<CopyPullSecret variant={variant} token={token} />);

        it('should render', () => {
          expect(wrapper).toMatchSnapshot();
        });
        it('should disable Copy', () => {
          const copy = wrapper.find(AnalyticsWrapper).renderProp('render')();
          const buttons = copy.find(Button);
          expect(buttons.length).toEqual(1);
          expect(buttons.at(0).props().isAriaDisabled).toEqual(true);
        });
      });
    });
  });
});
