import React from 'react';
import { shallow } from 'enzyme';

import DynamicSelect from './DynamicSelect';
import { PromiseReducerState } from '~/redux/types';

type DynamicSelectProps = React.ComponentProps<typeof DynamicSelect>;

describe('<DynamicSelect>', () => {
  let loadData: DynamicSelectProps['loadData'];
  let onChange: DynamicSelectProps['input']['onChange'];
  let baseProps: DynamicSelectProps;
  beforeEach(() => {
    loadData = jest.fn();
    onChange = jest.fn();
    baseProps = {
      loadData,
      input: {
        onChange,
        value: '',
      },
      meta: {
        invalid: false,
        error: null,
        touched: false,
      },
      label: 'Label',
      placeholder: 'Select foo',
      emptyAlertTitle: 'No foos',
      noDependenciesPlaceholder: 'Must select bar first',
      requestErrorTitle: 'Failed listing foos',
      hasDependencies: true,
      matchesDependencies: true,
      requestStatus: {
        pending: false,
        fulfilled: false,
        error: false,
      },
      items: ['Foo', 'Bar'],
    };
  });

  it('without dependencies', () => {
    const select = shallow(<DynamicSelect {...baseProps} hasDependencies={false} />);
    expect(select).toMatchSnapshot('blank');
    expect(select.find('FormSelectOption').at(0).props().label).toEqual('Must select bar first');
    expect(loadData).not.toBeCalled();
  });

  it('gets data', () => {
    const select = shallow(<DynamicSelect {...baseProps} matchesDependencies={false} />);
    expect(loadData).toBeCalled();

    select.setProps({
      requestStatus: { pending: true, fulfilled: false, error: null },
      matchesDependencies: true,
    });
    expect(select).toMatchSnapshot('loading');
    expect(select.find('FormSelectOption').at(0).props().label).toEqual('Loading...');

    select.setProps({
      requestStatus: { pending: false, fulfilled: true, error: null },
    });
    expect(select).toMatchSnapshot('items');
    expect(select.find('FormSelectOption').at(0).props().label).toEqual('Select foo');
    expect(loadData).toBeCalledTimes(1);
  });

  it('empty data', () => {
    const status: PromiseReducerState = { pending: false, fulfilled: true, error: false };
    const select = shallow(<DynamicSelect {...baseProps} requestStatus={status} items={[]} />);
    expect(loadData).not.toBeCalled();
    expect(select).toMatchSnapshot('empty');
    expect(select.find('FormSelectOption').at(0).props().label).toEqual('');
  });

  it('error, untouched', () => {
    const meta = { invalid: true, error: 'Bad!', touched: false };
    const select = shallow(<DynamicSelect {...baseProps} meta={meta} />);
    expect(select).toMatchSnapshot('no error');
  });

  it('error, touched', () => {
    const meta = { invalid: true, error: 'Bad!', touched: true };
    const select = shallow(<DynamicSelect {...baseProps} meta={meta} />);
    expect(select).toMatchSnapshot('shows error');
  });

  it('resets when selected value no longer valid option', () => {
    const status: PromiseReducerState = { pending: false, fulfilled: true, error: false };
    const select = shallow(
      <DynamicSelect {...baseProps} input={{ value: 'Foo', onChange }} requestStatus={status} />,
    );
    expect(loadData).not.toBeCalled();
    expect(onChange).not.toBeCalled();

    select.setProps({
      items: ['Bar', 'Baz'],
    });
    expect(onChange).toBeCalledWith('');
    select.setProps({
      input: { value: '', onChange },
    });
    expect(select).toMatchSnapshot('new items');
    expect(select.find('FormSelectOption').at(0).props().label).toEqual('Select foo');
  });

  it('resets on lost dependencies', () => {
    const status: PromiseReducerState = { pending: false, fulfilled: true, error: false };
    const select = shallow(
      <DynamicSelect {...baseProps} input={{ value: 'Foo', onChange }} requestStatus={status} />,
    );
    expect(loadData).not.toBeCalled();
    expect(onChange).not.toBeCalled();

    select.setProps({
      hasDependencies: false,
      matchesDependencies: false,
    });
    expect(onChange).toBeCalledWith('');
    select.setProps({
      input: { value: '', onChange },
    });
    expect(select.find('FormSelectOption').at(0).props().label).toEqual('Must select bar first');
  });
});
