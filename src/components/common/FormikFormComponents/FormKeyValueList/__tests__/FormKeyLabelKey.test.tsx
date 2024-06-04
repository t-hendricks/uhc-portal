import React from 'react';

import { checkAccessibility, render, screen, userEvent } from '~/testUtils';

import FormKeyLabelKey from '../FormKeyLabelKey';
import LabelKeyValueProps from '../LabelKeyValueProps';

describe('<FormKeyLabelKey />', () => {
  const onChangeFn = jest.fn();
  const props: LabelKeyValueProps = {
    index: 0,
    input: { onChange: onChangeFn, onBlur: () => {}, value: 'valueX', name: 'name' },
    meta: { value: 'valueY', touched: false, initialTouched: false },
  };

  afterEach(() => {
    onChangeFn.mockClear();
  });

  it('is accessible', async () => {
    // Act
    const { container } = render(<FormKeyLabelKey {...props} />);

    // Assert
    await checkAccessibility(container);
    const input = screen.getByRole('textbox', { name: /key-value list key/i });

    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('value', 'valueX');
  });

  it('onChange triggered', async () => {
    // Arrange
    const inputText = 'whateverthevalue';
    render(<FormKeyLabelKey {...props} />);
    const input = screen.getByRole('textbox', { name: /key-value list key/i });

    // Act
    await userEvent.type(input, inputText);

    // Assert
    expect(onChangeFn).toHaveBeenCalledTimes(inputText.length);
  });
});
