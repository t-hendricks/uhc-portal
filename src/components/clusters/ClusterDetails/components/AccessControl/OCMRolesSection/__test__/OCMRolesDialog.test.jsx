import React from 'react';
import { shallow } from 'enzyme';

import { row } from './OCMRolesDialog.fixture';
import { OCMRolesDialog } from '../OCMRolesDialog';

describe('<OCMRolesDialog />', () => {
  it('should render', () => {
    const wrapper = shallow(
      <OCMRolesDialog
        closeModal={jest.fn()}
        isOpen
        onSubmit={jest.fn()}
        canGrantClusterViewer
        row={row}
        clearGrantOCMRoleResponse={jest.fn()}
        grantOCMRoleResponse={{}}
      />,
    );

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('TextInput').length).toBe(1);
  });
});
