import React from 'react';
import { shallow } from 'enzyme';

import AddOnsMetaDataItem from '../AddOnsDrawerMetadataItem';

describe('<AddOnsMetaDataItem />', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(
      <AddOnsMetaDataItem
        activeCardDocsLink="https://example.com/veryfakedocs"
        installedAddOnOperatorVersion="v0.0.1"
      />,
    );
  });

  it('renders correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('ensure both elements are rendered correctly in metadata', () => {
    const elements = wrapper.find('FlexItem').props();
    expect(elements.children.length).toEqual(2);

    const version = elements.children[0];
    expect(version.props.children.includes('v0.0.1')).toBeTruthy();

    const docs = elements.children[1];
    expect(docs.props.href).toEqual('https://example.com/veryfakedocs');
  });

  it('ensure only doc elemented is rendered when version is not included', () => {
    wrapper.setProps({
      installedAddOnOperatorVersion: null,
    });

    const elements = wrapper.find('FlexItem').props();
    expect(elements.children.length).toEqual(2);

    const version = elements.children[0];
    expect(version.props).toBeFalsy();

    const docs = elements.children[1];
    expect(docs.props.href).toEqual('https://example.com/veryfakedocs');
  });

  it('ensure only version elemented is rendered when doc is not included', () => {
    wrapper.setProps({
      installedAddOnOperatorVersion: 'v0.0.2',
      activeCardDocsLink: null,
    });

    const elements = wrapper.find('FlexItem').props();
    expect(elements.children.length).toEqual(2);

    const version = elements.children[0];
    expect(version.props.children.includes('v0.0.2')).toBeTruthy();

    const docs = elements.children[1];
    expect(docs.props).toBeFalsy();
  });
});
