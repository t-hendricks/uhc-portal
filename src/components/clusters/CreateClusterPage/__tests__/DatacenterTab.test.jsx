import React from 'react';
import { shallow } from 'enzyme';
import { Provider } from 'react-redux';
import { store } from '../../../../redux/store';
import DatacenterTab from '../DatacenterTab';

describe('<DatacenterTab />', () => {
  it('renders correctly with assisted installer and multiarch disabled', () => {
    const wrapper = shallow(
      <Provider store={store}>
        <DatacenterTab assistedInstallerFeature multiArchFeatureEnabled={false} />
      </Provider>,
    );
    expect(wrapper).toMatchSnapshot();
  });
  it('renders correctly with assisted installer and multiarch enabled', () => {
    const wrapper = shallow(
      <Provider store={store}>
        <DatacenterTab assistedInstallerFeature multiArchFeatureEnabled />
      </Provider>,
    );
    expect(wrapper).toMatchSnapshot();
  });
  it('renders correctly without assisted installer and without multiarch', () => {
    const wrapper = shallow(
      <Provider store={store}>
        <DatacenterTab assistedInstallerFeature={false} multiArchFeatureEnabled={false} />
      </Provider>,
    );
    expect(wrapper).toMatchSnapshot();
  });
});
