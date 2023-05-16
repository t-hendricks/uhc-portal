import React from 'react';
import { shallow } from 'enzyme';
import { Provider } from 'react-redux';
import { store } from '../../../../redux/store';
import DatacenterTab from '../DatacenterTab';
import { setFeatureAction } from '../../../../redux/actions/featureActions';
import { ASSISTED_INSTALLER_MULTIARCH_SUPPORTED } from '../../../../redux/constants/featureConstants';

describe('<DatacenterTab />', () => {
  it('renders correctly with assisted installer and multiarch disabled', () => {
    store.dispatch(setFeatureAction(ASSISTED_INSTALLER_MULTIARCH_SUPPORTED, false));
    const wrapper = shallow(
      <Provider store={store}>
        <DatacenterTab assistedInstallerFeature />
      </Provider>,
    );
    expect(wrapper).toMatchSnapshot();
  });
  it('renders correctly with assisted installer and multiarch enabled', () => {
    store.dispatch(setFeatureAction(ASSISTED_INSTALLER_MULTIARCH_SUPPORTED, true));
    const wrapper = shallow(
      <Provider store={store}>
        <DatacenterTab assistedInstallerFeature />
      </Provider>,
    );
    expect(wrapper).toMatchSnapshot();
  });
  it('renders correctly without assisted installer and without multiarch', () => {
    store.dispatch(setFeatureAction(ASSISTED_INSTALLER_MULTIARCH_SUPPORTED, false));
    const wrapper = shallow(
      <Provider store={store}>
        <DatacenterTab assistedInstallerFeature={false} />
      </Provider>,
    );
    expect(wrapper).toMatchSnapshot();
  });
});
