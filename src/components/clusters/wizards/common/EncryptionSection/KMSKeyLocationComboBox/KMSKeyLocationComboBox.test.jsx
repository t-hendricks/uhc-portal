import React from 'react';

import { checkAccessibility, render, screen } from '~/testUtils';

import DisconnectedKMSKeyLocationComboBox from './KMSKeyLocationComboBox';

const kmsRegionsArray = ['us-east-1', 'global'];

describe('<KMSKeyLocationComboBox />', () => {
  const onChange = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });
  const defaultProps = {
    input: { onChange },
    kmsRegionsArray,
  };
  describe('when location needs to be fetched', () => {
    it('renders correctly', async () => {
      const { container } = render(<DisconnectedKMSKeyLocationComboBox {...defaultProps} />);

      expect(screen.getByRole('option', { name: 'us-east-1' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'global' })).toBeInTheDocument();
      await checkAccessibility(container);
    });
  });
});
