import React from 'react';
import { shallow } from 'enzyme';
import {
  Button,
  ClipboardCopy,
} from '@patternfly/react-core';

import GetStarted from '../GetStarted';
import ExternalLink from '../../../../../common/ExternalLink';

describe('<GetStarted />', () => {
  describe('GetStarted w/ customizations', () => {
    const wrapper = shallow(<GetStarted docURL="" cloudProviderID="" customizations="example.doc.link" />);

    it('should render', () => {
      expect(wrapper).toMatchSnapshot();
    });
    it('should have a Get Started button', () => {
      const getStartedButton = wrapper.find(Button);
      expect(getStartedButton.length).toEqual(1);
    });
    it('should have a copybox', () => {
      const copybox = wrapper.find(ClipboardCopy);
      expect(copybox.length).toEqual(1);
      expect(copybox.props().isReadOnly).toEqual(true);
    });
    it('should have a customizations link', () => {
      const link = wrapper.find(ExternalLink);
      expect(link.length).toEqual(1);
    });
  });

  describe('GetStarted w/o customizations', () => {
    const wrapper = shallow(<GetStarted docURL="" cloudProviderID="" />);

    it('should render', () => {
      expect(wrapper).toMatchSnapshot();
    });
    it('should have a Get Started button', () => {
      const getStartedButton = wrapper.find(Button);
      expect(getStartedButton.length).toEqual(1);
    });
    it('should have a copybox', () => {
      const copybox = wrapper.find(ClipboardCopy);
      expect(copybox.length).toEqual(1);
      expect(copybox.props().isReadOnly).toEqual(true);
    });
    it('should not have a customizations link', () => {
      const link = wrapper.find('a');
      expect(link.length).toEqual(0);
    });
  });

  describe('GetStarted for UPI', () => {
    const wrapper = shallow(<GetStarted docURL="" cloudProviderID="" isUPI />);

    it('should render', () => {
      expect(wrapper).toMatchSnapshot();
    });
    it('should have a Get Started button', () => {
      const getStartedButton = wrapper.find(Button);
      expect(getStartedButton.length).toEqual(1);
    });
    it('should not have a copybox', () => {
      const copybox = wrapper.find(ClipboardCopy);
      expect(copybox.length).toEqual(0);
    });
  });
});
