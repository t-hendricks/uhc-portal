import React from 'react';
import { shallow } from 'enzyme';
import { Link } from 'react-router-dom';
import { Text } from '@patternfly/react-core';

import ButtonWithTooltip from './ButtonWithTooltip';

describe('<ButtonWithTooltip>', () => {
  describe('without disableReason', () => {
    it('renders', () => {
      const button = shallow(<ButtonWithTooltip className="foo">Press me</ButtonWithTooltip>);
      expect(button).toMatchSnapshot();
    });
  });

  describe('with blank disableReason', () => {
    it('renders', () => {
      const button = shallow(<ButtonWithTooltip className="foo" disableReason="">Press me</ButtonWithTooltip>);
      expect(button).toMatchSnapshot();
    });
  });

  describe('with string disableReason', () => {
    it('renders', () => {
      const button = shallow(
        <ButtonWithTooltip className="foo" disableReason="Unsafe in hyperspace">Teleport</ButtonWithTooltip>,
      );
      expect(button).toMatchSnapshot();
    });
  });

  describe('with node disableReason', () => {
    it('renders', () => {
      const reason = (
        <Text>
          Unsupported.
          {' '}
          <Link to="http://example.com">Learn more</Link>
        </Text>
      );
      const button = shallow(
        <ButtonWithTooltip className="foo" disableReason={reason}>Teleport</ButtonWithTooltip>,
      );
      expect(button).toMatchSnapshot();
    });
  });
});
