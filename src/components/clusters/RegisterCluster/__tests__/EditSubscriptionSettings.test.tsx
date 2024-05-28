import React from 'react';

import { subscriptionSupportLevels } from '~/common/subscriptionTypes';
import { render } from '~/testUtils';

import EditSubscriptionFields from '../../common/EditSubscriptionSettingsDialog/EditSubscriptionSettingsFields';
import EditSubscriptionSettings from '../EditSubscriptionSettings';

jest.mock('../../common/EditSubscriptionSettingsDialog/EditSubscriptionSettingsFields');
const EditSubscriptionFieldsMock = EditSubscriptionFields as any as jest.Mock;

describe('EditSubscriptionSettings', () => {
  it('renders EditSubscriptionFields component with default values', () => {
    // Arrange
    const properties = {
      setSettings: jest.fn(),
      canSubscribeOCP: true,
    };

    // Act
    render(<EditSubscriptionSettings {...properties} />);

    // Assert
    expect(EditSubscriptionFieldsMock).toHaveBeenCalledWith(
      {
        canSubscribeMarketplaceOCP: false,
        canSubscribeStandardOCP: true,
        initialSettings: {
          isValid: true,
          support_level: 'Eval',
        },
        onSettingsChange: properties.setSettings,
      },
      {},
    );
  });
  it('renders EditSubscriptionFields component with props values', () => {
    // Arrange
    const properties = {
      setSettings: jest.fn(),
      canSubscribeOCP: false,
      isValid: false,
      supportLevel: subscriptionSupportLevels.SUPPORT_BY_IBM,
      canSubscribeMarketplaceOCP: true,
    };

    // Act
    render(<EditSubscriptionSettings {...properties} />);

    // Assert
    expect(EditSubscriptionFieldsMock).toHaveBeenCalledWith(
      {
        canSubscribeMarketplaceOCP: true,
        canSubscribeStandardOCP: false,
        initialSettings: {
          isValid: false,
          support_level: 'Supported by IBM',
        },
        onSettingsChange: properties.setSettings,
      },
      {},
    );
  });
});
