import React from 'react';
import { shallow } from 'enzyme';

import fixtures from '../../ClusterDetails/__test__/ClusterDetails.fixtures';
import UpgradeTrialClusterDialog from './UpgradeTrialClusterDialog';
import ErrorBox from '../../../common/ErrorBox';

describe('<UpgradeTrialClusterDialog />', () => {
  const organizationState = {
    fulfilled: true,
    pending: false,
    quotaList: {},
  };
  const { cluster } = fixtures.OSDTrialClusterDetails;
  const machineTypesByID = {
    'm5.xlarge': { id: 'm5.xlarge', resource_name: 'gp.small' },
  };
  let wrapper;
  let closeModal;
  let onClose;
  let submit;
  let resetResponse;
  let getOrganizationAndQuota;

  beforeEach(() => {
    closeModal = jest.fn();
    onClose = jest.fn();
    submit = jest.fn();
    resetResponse = jest.fn();
    getOrganizationAndQuota = jest.fn();
    wrapper = shallow(<UpgradeTrialClusterDialog
      isOpen
      closeModal={closeModal}
      onClose={onClose}
      submit={submit}
      resetResponse={resetResponse}
      organization={organizationState}
      getOrganizationAndQuota={getOrganizationAndQuota}
      clusterID="some-cluster-id"
      cluster={cluster}
      machineTypesByID={machineTypesByID}
      upgradeTrialClusterResponse={{ errorMessage: '', error: false, fulfilled: false }}
    />);
  });

  it('renders correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('renders correctly when an erorr occurs', () => {
    wrapper.setProps({ upgradeTrialClusterResponse: { error: true, errorMessage: 'this is an error' } });
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(ErrorBox).length).toEqual(1);
  });
});
