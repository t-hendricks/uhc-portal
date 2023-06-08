import React from 'react';
import * as reactRedux from 'react-redux';
import * as helpers from '~/common/helpers';
import { screen, render, axe, userEvent, within } from '~/testUtils';
import wizardConnector from '~/components/clusters/CreateOSDPage/CreateOSDWizard/WizardConnector';
import AWSBillingAccount from './AWSBillingAccount';

const defaultProps = {
  change: () => jest.fn(),
  selectedAWSBillingAccountID: '123',
  selectedAWSAccountID: '123',
};

const defaultState = {
  userProfile: {
    organization: {
      quotaList: {
        items: [
          {
            allowed: 2020,
            cloud_accounts: [
              {
                cloud_provider_id: 'aws',
              },
            ],

            quota_id: 'cluster|byoc|moa|marketplace',
          },
        ],
      },
    },
  },
  rosaReducer: {
    getAWSBillingAccountsResponse: {
      data: ['123', '111', '222', '333'],
      fulfilled: true,
      pending: false,
      error: false,
    },
  },
};

describe('<AWSBillingAccount />', () => {
  const useDispatchMock = jest.spyOn(reactRedux, 'useDispatch');
  const shouldRefreshQuotaMock = jest.spyOn(helpers, 'shouldRefetchQuota');

  const ConnectedAWSBillingAccount = wizardConnector(AWSBillingAccount);

  afterEach(() => {
    useDispatchMock.mockClear();
    shouldRefreshQuotaMock.mockClear();
  });

  it('is accessible', async () => {
    // Arrange
    shouldRefreshQuotaMock.mockReturnValue(false);
    const { container } = render(
      <ConnectedAWSBillingAccount {...defaultProps} />,
      {},
      defaultState,
    );

    // Assert
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('calls dispatch to get billing account IDs when shouldRefreshQuota returns true called on load', () => {
    // Arrange
    const dummyDispatch = jest.fn();
    useDispatchMock.mockReturnValue(dummyDispatch);
    shouldRefreshQuotaMock.mockReturnValue(true);

    render(<ConnectedAWSBillingAccount {...defaultProps} />);

    // Assert
    expect(dummyDispatch).toHaveBeenCalledTimes(1);
  });

  it('does not call dispatch to get billing account IDs when shouldRefreshQuota returns false called on load', () => {
    // Arrange
    const dummyDispatch = jest.fn();
    useDispatchMock.mockReturnValue(dummyDispatch);
    shouldRefreshQuotaMock.mockReturnValue(false);

    render(<ConnectedAWSBillingAccount {...defaultProps} />, {}, defaultState);

    // Assert
    expect(dummyDispatch).toHaveBeenCalledTimes(0);
  });

  it('populates the billing account id drop down with accounts in Redux state', async () => {
    // Arrange
    const user = userEvent.setup();
    const accountInState = defaultState.rosaReducer.getAWSBillingAccountsResponse.data;
    render(<ConnectedAWSBillingAccount {...defaultProps} />, {}, defaultState);
    await user.click(screen.getByRole('button', { name: 'Options menu' })); // expand drop-down

    // Assert
    expect(screen.getAllByRole('option')).toHaveLength(accountInState.length);

    accountInState.forEach((account: string) => {
      expect(screen.getByRole('option', { name: account })).toBeInTheDocument();
    });
  });

  it.skip('makes call to set billing account to "" if selected billing account is not accounts in Redux state', async () => {
    // Redux forms doesn't allow you to spy or mock change
    // nor does it allow you to mock the Field component
    // This tests fails because changeMock is never called

    // Arrange
    const changeMock = jest.fn();
    shouldRefreshQuotaMock.mockReturnValue(false);
    const newProps = {
      ...defaultProps,
      selectedAWSBillingAccountID: 'notAnAccount',
      change: changeMock,
    };
    render(<ConnectedAWSBillingAccount {...newProps} />, {}, defaultState);

    // Assert

    expect(changeMock).toHaveBeenCalledTimes(1);

    expect(changeMock.mock.calls[0][0]).toEqual('billing_account_id');
    expect(changeMock.mock.calls[0][0]).toEqual('');

    changeMock.mockClear();
  });

  it.skip('makes call to set billing account single account in Redux if selected billing account is not accounts in Redux state and there is only one account', async () => {
    // Redux forms doesn't allow you to spy or mock change
    // nor does it allow you to mock the Field component
    // This tests fails because changeMock is never called

    // Arrange
    const changeMock = jest.fn();
    shouldRefreshQuotaMock.mockReturnValue(false);
    const newProps = {
      ...defaultProps,
      selectedAWSBillingAccountID: 'notAnAccount',
      change: changeMock,
    };

    const newState = {
      ...defaultState,
      rosaReducer: {
        getAWSBillingAccountsResponse: {
          data: ['123'],
          fulfilled: true,
          pending: false,
          error: false,
        },
      },
    };
    render(<ConnectedAWSBillingAccount {...newProps} />, {}, newState);

    // Assert
    expect(changeMock).toHaveBeenCalledTimes(1);

    expect(changeMock.mock.calls[0][0]).toEqual('billing_account_id');
    expect(changeMock.mock.calls[0][0]).toEqual('123');

    changeMock.mockClear();
  });

  it('displays an error if get organization returns an error and is accessible', async () => {
    // Arrange
    const newState = {
      ...defaultState,
      userProfile: {
        ...defaultState.userProfile,
        organization: {
          ...defaultState.userProfile.organization,
          error: true,
          errorMessage: 'I am an org error',
        },
      },
    };

    shouldRefreshQuotaMock.mockReturnValue(false);
    const { container } = render(<ConnectedAWSBillingAccount {...defaultProps} />, {}, newState);

    // Assert

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(
      within(screen.getByRole('alert')).getByText('I am an org error', { exact: false }),
    ).toBeInTheDocument();

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('displays an error if getting billing account returns an error and is accessible', async () => {
    // Arrange
    const newState = {
      ...defaultState,
      rosaReducer: {
        getAWSBillingAccountsResponse: {
          error: true,
          errorMessage: 'I am a billing account error',
        },
      },
    };

    shouldRefreshQuotaMock.mockReturnValue(false);
    const { container } = render(<ConnectedAWSBillingAccount {...defaultProps} />, {}, newState);

    // Assert

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(
      within(screen.getByRole('alert')).getByText('I am a billing account error', { exact: false }),
    ).toBeInTheDocument();

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('displays info alert if the billing and infrastructure account are different and is accessible', async () => {
    // Arrange
    const newProps = {
      ...defaultProps,
      selectedAWSBillingAccountID: '123',
      selectedAWSAccountID: '456',
    };
    shouldRefreshQuotaMock.mockReturnValue(false);
    const { container } = render(<ConnectedAWSBillingAccount {...newProps} />, {}, defaultState);

    // Assert
    expect(screen.getByRole('alert')).toBeInTheDocument();

    expect(
      within(screen.getByRole('alert')).getByText(
        'The selected AWS billing account is a different account than your AWS infrastructure account.',
        { exact: false },
      ),
    ).toBeInTheDocument();

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('hides info alert if billing and infrastructure are the same', () => {
    // Arrange
    const newProps = {
      ...defaultProps,
      selectedAWSBillingAccountID: '123',
      selectedAWSAccountID: '123',
    };
    shouldRefreshQuotaMock.mockReturnValue(false);
    render(<ConnectedAWSBillingAccount {...newProps} />, {}, defaultState);

    // Assert
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('hides info alert if a billing account has not been selected', () => {
    // Arrange
    const newProps = {
      ...defaultProps,
      selectedAWSBillingAccountID: '',
      selectedAWSAccountID: '123',
    };
    shouldRefreshQuotaMock.mockReturnValue(false);
    render(<ConnectedAWSBillingAccount {...newProps} />, {}, defaultState);

    // Assert
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('hides info alert if a infrastructure account has not been selected', () => {
    // Arrange
    const newProps = {
      ...defaultProps,
      selectedAWSBillingAccountID: '123',
      selectedAWSAccountID: '',
    };
    shouldRefreshQuotaMock.mockReturnValue(false);
    render(<ConnectedAWSBillingAccount {...newProps} />, {}, defaultState);

    // Assert
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
