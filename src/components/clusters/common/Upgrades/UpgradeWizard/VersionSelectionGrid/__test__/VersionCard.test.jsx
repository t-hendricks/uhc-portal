import React from 'react';
import { shallow } from 'enzyme';
import VersionCard from '../VersionCard';

let wrapper;
const onKeyDown = jest.fn();
const onClick = jest.fn();

describe('<VersionCard>', () => {
  it('should render correctly when recommended', () => {
    wrapper = shallow(
      <VersionCard
        isRecommended
        version="4.5.20"
        onKeyDown={onKeyDown}
        onClick={onClick}
      >
        The latest on your current minor version.
      </VersionCard>,
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly when selected & not recommended', () => {
    wrapper.setProps(
      {
        isSelected: true,
        version: '4.5.16',
        isRecommended: false,
      },
    );
    expect(wrapper).toMatchSnapshot();
  });
});
