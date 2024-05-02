import React from 'react';

import wizardConnector from '~/components/clusters/wizards/common/WizardConnector';
import { checkAccessibility, render, screen } from '~/testUtils';

import ReduxFormKeyValueList from './ReduxFormKeyValueList';

const push = jest.fn();
const remove = jest.fn();

class MockFields extends Array {
  constructor(...args) {
    super(...args);
    this.push = push;
    this.get = () => 'id';
    this.remove = remove;
    this.getAll = jest.fn();
  }
}

describe('<ReduxFormKeyValueList />', () => {
  const emptyListFields = new MockFields({});
  const listWithItemsFields = new MockFields(
    { key: 'aa', value: 'bb' },
    { key: 'cc', value: 'dd' },
  );

  afterEach(() => {
    jest.clearAllMocks();
  });

  const ConnectedKeyValueList = wizardConnector(ReduxFormKeyValueList);

  it.skip('is accessible', async () => {
    const { container } = render(
      <ConnectedKeyValueList fields={emptyListFields} meta={{ error: '', submitFailed: false }} />,
    );

    // this fails because button elements do not have an accessible name/label
    await checkAccessibility(container);
  });

  it('displays one input set when no field items are passed', () => {
    render(
      <ConnectedKeyValueList fields={emptyListFields} meta={{ error: '', submitFailed: false }} />,
    );
    const keyFields = screen.getAllByLabelText('Key-value list key');
    const valueFields = screen.getAllByLabelText('Key-value list value');

    expect(keyFields).toHaveLength(1);
    expect(valueFields).toHaveLength(1);
  });

  it('has same number of input sets as field items', () => {
    render(
      <ConnectedKeyValueList
        fields={listWithItemsFields}
        meta={{ error: '', submitFailed: false }}
      />,
    );

    const keyFields = screen.getAllByLabelText('Key-value list key');
    const valueFields = screen.getAllByLabelText('Key-value list value');

    expect(keyFields).toHaveLength(listWithItemsFields.length);
    expect(valueFields).toHaveLength(listWithItemsFields.length);
  });

  it('calls push function when adding a new item', async () => {
    const { user } = render(
      <ConnectedKeyValueList
        fields={listWithItemsFields}
        meta={{ error: '', submitFailed: false }}
      />,
    );
    expect(push).not.toBeCalled();

    await user.click(screen.getByRole('button', { name: 'Add additional label' }));

    expect(push).toBeCalled();
  });

  it('calls remove function when removing an item', async () => {
    const { user } = render(
      <ConnectedKeyValueList
        fields={listWithItemsFields}
        meta={{ error: '', submitFailed: false }}
      />,
    );
    expect(remove).not.toBeCalled();

    await user.click(screen.getAllByRole('button', { name: 'Remove item' })[0]);

    expect(remove).toBeCalled();
  });
});
