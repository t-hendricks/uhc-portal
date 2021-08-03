import React from 'react';
import { shallow } from 'enzyme';
import InstallToVPC from './InstallToVPC';
import SubnetFields, { SingleSubnetFieldsRow } from './SubnetFields';
import GCPNetworkConfigSection from './GCPNetworkConfigSection';

describe('<InstallToVPC>', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(
      <InstallToVPC
        selectedRegion="us-east-1"
        isMultiAz={false}
        cloudProviderID="aws"
      />,
    );
  });

  it('renders correctly when checkbox is not selected', () => {
    const fieldRowSets = wrapper.find(SubnetFields);
    expect(fieldRowSets.length).toEqual(0);
    expect(wrapper).toMatchSnapshot();
  });

  it('renders correctly when selected for single AZ', () => {
    wrapper.setProps({ selected: true });
    const fieldRows = wrapper.find(SubnetFields).dive().find(SingleSubnetFieldsRow);
    expect(fieldRows.length).toEqual(1);
    expect(wrapper).toMatchSnapshot();
  });

  it('renders correctly when selected for multi AZ', () => {
    wrapper.setProps({ selected: true, isMultiAz: true });
    const fieldRows = wrapper.find(SubnetFields).dive().find(SingleSubnetFieldsRow);
    expect(fieldRows.length).toEqual(3);
    expect(wrapper).toMatchSnapshot();
  });
});

describe('<InstallToVPC>', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(
      <InstallToVPC
        selectedRegion="us-east1"
        cloudProviderID="gcp"
      />,
    );
  });

  it('renders correctly when checkbox is not selected', () => {
    const fieldRowSets = wrapper.find(GCPNetworkConfigSection);
    expect(fieldRowSets.length).toEqual(0);
    expect(wrapper).toMatchSnapshot();
  });

  it('renders correctly when checkbox is selected', () => {
    wrapper.setProps({ selected: true });
    const fieldRowSets = wrapper.find(GCPNetworkConfigSection);
    expect(fieldRowSets.length).toEqual(1);
    expect(wrapper).toMatchSnapshot();
  });
});
