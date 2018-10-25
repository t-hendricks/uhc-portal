import React from 'react';
import { MemoryRouter } from 'react-router';
import { mount, shallow } from 'enzyme';

import Instructions from './Instructions';

let wrapper;

function validToken() {
  return { hi: { i: 'am a token without errors' } };
}

function invalidToken() {
  return { error: { msg: 'Invalid' } };
}

describe('<Instructions />', () => {
  describe('with a valid token', () => {
    const token = { hi: 'I have no errors' };

    it('displays the token', () => {
      wrapper = shallow(<Instructions token={token} />);

      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('with an invalid token', () => {
    const token = { error: { msg: 'Invalid' } };

    it('displays an error', () => {
      wrapper = shallow(<Instructions token={token} />);

      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('with a valid token', () => {
    beforeEach(() => {
      wrapper = mount(
        <MemoryRouter>
          <Instructions token={validToken()} />
        </MemoryRouter>,
      );
    });

    it('does not display an error', () => {
      expect(
        wrapper.find('div.install--errors'),
      ).toHaveLength(0);
    });

    it('enables copying the token', () => {
      expect(
        wrapper.find('.install--copy-token').first().props().disabled,
      ).toBeFalsy();
    });

    it('enables downloading the installer', () => {
      expect(
        wrapper.find('.install--download-installer').first().props().disabled,
      ).toBeFalsy();
    });
  });

  describe('with an invalid token', () => {
    beforeEach(() => {
      wrapper = mount(
        <MemoryRouter>
          <Instructions token={invalidToken()} />
        </MemoryRouter>,
      );
    });

    it('displays an error', () => {
      expect(
        wrapper.find('div.install--errors'),
      ).toHaveLength(1);
    });

    it('disables copying the token', () => {
      expect(
        wrapper.find('.install--copy-token').first().props().disabled,
      ).toBeTruthy();
    });

    it('disables downloading the installer', () => {
      expect(
        wrapper.find('.install--download-installer').first().props().disabled,
      ).toBeTruthy();
    });
  });
});
