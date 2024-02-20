import React from 'react';
import { Formik } from 'formik';
import { withState, checkAccessibility, insightsMock, screen, act, TestRouter } from '~/testUtils';
import { CompatRouter } from 'react-router-dom-v5-compat';
import { normalizeSTSUsersByAWSAccounts } from '~/redux/actions/rosaActions';
import AccountsRolesScreen, {
  AccountsRolesScreenProps,
  isUserRoleForSelectedAWSAccount,
} from '../AccountsRolesScreen';
import { initialValues } from '../../constants';

const useAnalyticsMock = jest.fn();
jest.mock('~/hooks/useAnalytics', () => jest.fn(() => useAnalyticsMock));
insightsMock();

const accountRolesScreenProps: AccountsRolesScreenProps = {
  getAWSAccountIDs: () => {},
  getAWSAccountIDsResponse: () => {},
  getAWSAccountRolesARNs: () => {},
  getAWSAccountRolesARNsResponse: () => {},
  getUserRoleResponse: () => {},
  clearGetAWSAccountIDsResponse: () => {},
  clearGetAWSAccountRolesARNsResponse: () => {},
  clearGetUserRoleResponse: () => {},
  organizationID: 'org-id',
  isHypershiftEnabled: true,
  isHypershiftSelected: false,
};

const buildTestComponent = (children: React.ReactNode, formValues = {}) => (
  <Formik
    initialValues={{
      ...initialValues,
      ...formValues,
    }}
    onSubmit={() => {}}
  >
    {children}
  </Formik>
);

describe('<AccountsRolesScreen />', () => {
  it('is accessible', async () => {
    const { container } = withState({}).render(
      buildTestComponent(
        <TestRouter>
          <CompatRouter>
            <AccountsRolesScreen {...accountRolesScreenProps} />
          </CompatRouter>
        </TestRouter>,
      ),
    );
    await act(() => Promise.resolve());
    await checkAccessibility(container);
  });

  it('does not show the welcome and prerequisites sections for users with HyperShift enabled', async () => {
    withState({}).render(
      buildTestComponent(
        <TestRouter>
          <CompatRouter>
            <AccountsRolesScreen {...accountRolesScreenProps} />
          </CompatRouter>
        </TestRouter>,
      ),
    );
    await act(() => Promise.resolve());

    expect(
      screen.queryByText('Welcome to Red Hat OpenShift Service on AWS (ROSA)'),
    ).not.toBeInTheDocument();
    expect(screen.queryByText('Did you complete your prerequisites?')).not.toBeInTheDocument();
  });

  it('shows the welcome and prerequisites sections for users with HyperShift disabled without the CLI warning', async () => {
    const props = { ...accountRolesScreenProps, isHypershiftEnabled: false };
    withState({}).render(
      buildTestComponent(
        <TestRouter>
          <CompatRouter>
            <AccountsRolesScreen {...props} />
          </CompatRouter>
        </TestRouter>,
      ),
    );
    await act(() => Promise.resolve());

    expect(
      screen.getByText('Welcome to Red Hat OpenShift Service on AWS (ROSA)'),
    ).toBeInTheDocument();
    expect(screen.getByText('Did you complete your prerequisites?')).toBeInTheDocument();
    expect(screen.queryByText(/Make sure you are using ROSA CLI version/)).not.toBeInTheDocument();
  });
});

describe('isUserRoleForSelectedAWSAccount', () => {
  it.each([
    ['returns false when no user detected', '', '000000000006', 0, false],
    [
      'returns true when user detected which matches selected aws account',
      'arn:aws:iam::000000000006:role/ManagedOpenShift-User-dtaylor-ocm-Role',
      '000000000006',
      1,
      true,
    ],
    [
      'returns false when user detected but their aws acct doesnt matches selected aws account',
      'arn:aws:iam::000000000006:role/ManagedOpenShift-User-dtaylor-ocm-Role',
      '119733383077',
      1,
      false,
    ],
    [
      'returns true when multiple users detected and one matches selected aws account',
      'arn:aws:iam::000000000006:role/ManagedOpenShift-User-dtaylor-ocm-Role,arn:aws:iam::119733383044:role/ManagedOpenShift-User-foobar-ocm-Role',
      '119733383044',
      2,
      true,
    ],
  ])(
    '%p',
    (
      title: string,
      users: string,
      selectedAwsAcctId: string,
      expectedLength: number,
      expectedResult: boolean,
    ) => {
      const usersByAcctIds = normalizeSTSUsersByAWSAccounts(users);
      expect(usersByAcctIds.length).toEqual(expectedLength);
      const result = isUserRoleForSelectedAWSAccount(usersByAcctIds, selectedAwsAcctId);
      expect(result).toBe(expectedResult);
    },
  );
});
