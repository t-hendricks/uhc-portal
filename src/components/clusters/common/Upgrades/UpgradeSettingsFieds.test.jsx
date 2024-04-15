import React from 'react';
import { reduxForm } from 'redux-form';

import { render, screen } from '~/testUtils';

import UpgradeSettingsFields from './UpgradeSettingsFields';

describe('<UpgradeSettingsFields />', () => {
  const change = jest.fn();
  const defaultProps = {
    isAutomatic: false,
    isDisabled: false,
    isHypershift: false,
    showDivider: true,
    change,
    product: 'ROSA',
    initialScheduleValue: '',
  };

  const ConnectedUpgradeSettingsFields = reduxForm({
    form: 'CreateCluster',
    initialValues: { node_drain_grace_period: 60 },
  })(UpgradeSettingsFields);

  describe('Node draining grace period', () => {
    it('is shown if not hypershift', () => {
      const newProps = {
        ...defaultProps,
        isHypershift: false,
      };
      render(<ConnectedUpgradeSettingsFields {...newProps} />);
      expect(screen.getByText('Node draining')).toBeInTheDocument();
    });
    it('is hidden if hypershift', () => {
      const newProps = {
        ...defaultProps,
        isHypershift: true,
      };
      render(<ConnectedUpgradeSettingsFields {...newProps} />);
      expect(screen.queryByText('Node draining')).not.toBeInTheDocument();
    });
  });
});
