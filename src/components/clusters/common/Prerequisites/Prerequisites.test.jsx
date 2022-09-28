import React from 'react';
import { shallow, mount } from 'enzyme';
import { Text, TextContent, TextVariants } from '@patternfly/react-core';

import Prerequisites from './Prerequisites';

describe('<Prerequisites/>', () => {
  let wrapper;
  it('<Prerequisites initiallyExpanded="true" acknowledgementRequired="false"/>', () => {
    wrapper = mount(
      <Prerequisites initiallyExpanded>
        <TextContent>
          <Text component={TextVariants.p} className="ocm-secondary-text">
            Before continuing, confirm that all prerequisites are met:
          </Text>
        </TextContent>
      </Prerequisites>,
    );
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('ExpandableSection').props().isExpanded).toBeTruthy();
  });

  it('<Prerequisites initiallyExpanded="false" acknowledgementRequired="true"/>', () => {
    wrapper = shallow(
      <Prerequisites initiallyExpanded={false} acknowledgementRequired>
        <TextContent>
          <Text component={TextVariants.p} className="ocm-secondary-text">
            Before continuing, confirm that all prerequisites are met:
          </Text>
        </TextContent>
      </Prerequisites>,
    );
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('ExpandableSection').props().isExpanded).toBeFalsy();
  });

  it('<Prerequisites toggleText="Cluster Prerequisites"/>', () => {
    wrapper = shallow(<Prerequisites toggleText="Cluster Prerequisites" />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('ExpandableSection').props().toggleText).toBe('Cluster Prerequisites');
  });
});
