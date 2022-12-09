import React from 'react';
import { shallow } from 'enzyme';
import { Link } from 'react-router-dom';
import { Button, Text, Tooltip } from '@patternfly/react-core';

import ButtonWithTooltip from './ButtonWithTooltip';

describe('<ButtonWithTooltip>', () => {
  describe('without disableReason', () => {
    it('renders', () => {
      const button = shallow(<ButtonWithTooltip className="foo">Press me</ButtonWithTooltip>);
      expect(button).toMatchSnapshot();
      expect(button.find(Button).at(0).props().isAriaDisabled).toBeFalsy();
    });
  });

  describe('with blank disableReason', () => {
    it('renders', () => {
      const button = shallow(
        <ButtonWithTooltip className="foo" disableReason="">
          Press me
        </ButtonWithTooltip>,
      );
      expect(button).toMatchSnapshot();
    });
  });

  describe('with string disableReason', () => {
    it('renders', () => {
      const button = shallow(
        <ButtonWithTooltip
          disableReason="Unsafe in hyperspace"
          isAriaDisabled={false}
          tooltipProps={{ position: 'right' }}
          className="foo"
        >
          Teleport
        </ButtonWithTooltip>,
      );
      expect(button).toMatchSnapshot();
      expect(button.find(Tooltip).at(0).props().content).toEqual('Unsafe in hyperspace');
      expect(button.find(Button).at(0).props().isAriaDisabled).toBeTruthy();
    });
  });

  describe('with node disableReason', () => {
    it('renders', () => {
      const reason = (
        <Text>
          Unsupported. <Link to="http://example.com">Learn more</Link>
        </Text>
      );
      const button = shallow(
        <ButtonWithTooltip className="foo" disableReason={reason}>
          Teleport
        </ButtonWithTooltip>,
      );
      expect(button).toMatchSnapshot();
    });
  });

  describe('with disableReason and isAriaDisabled', () => {
    it('renders', () => {
      const button = shallow(
        <ButtonWithTooltip className="foo" disableReason="Parachute required" isAriaDisabled>
          Eject
        </ButtonWithTooltip>,
      );
      expect(button).toMatchSnapshot();
      expect(button.find(Tooltip).at(0).props().content).toEqual('Parachute required');
      expect(button.find(Button).at(0).props().isAriaDisabled).toBeTruthy();
    });
  });

  describe('with isAriaDisabled', () => {
    it('renders', () => {
      const button = shallow(
        <ButtonWithTooltip className="foo" disableReason={false} isAriaDisabled>
          Not clickable
        </ButtonWithTooltip>,
      );
      expect(button).toMatchSnapshot();
      expect(button.find(Tooltip)).toHaveLength(0);
      expect(button.find(Button).at(0).props().isAriaDisabled).toBeTruthy();
    });
  });
});
