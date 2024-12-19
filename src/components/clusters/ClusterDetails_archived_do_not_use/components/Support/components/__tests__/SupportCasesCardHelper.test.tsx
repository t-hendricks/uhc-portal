import React from 'react';
import dayjs from 'dayjs';

import { isRestrictedEnv } from '~/restrictedEnv';

import { getSupportCaseURL, supportCaseRow } from '../SupportCasesCardHelper';

jest.mock('~/restrictedEnv', () => ({
  isRestrictedEnv: jest.fn(),
  SUPPORT_CASE_URL: 'SUPPORT_CASE_URL_VALUE',
}));

const isRestrictedEnvMock = isRestrictedEnv as jest.Mock;

describe('getSupportCaseURL', () => {
  it('returns correct URL for non-restricted environment', () => {
    isRestrictedEnvMock.mockReturnValue(false);
    const product = 'OSD';
    const version = 'v1.0';
    const clusterUUID = '12345';
    const expectedURL =
      'https://access.redhat.com/support/cases/#/case/new/open-case/describe-issue?clusterId=12345&caseCreate=true&product=OpenShift%20Dedicated&version=OpenShift%20Dedicated';
    expect(getSupportCaseURL(product, version, clusterUUID)).toBe(expectedURL);
  });

  it('returns correct URL for non-restricted environment and non-existing product', () => {
    isRestrictedEnvMock.mockReturnValue(false);
    const product = 'whatever';
    const version = 'v1.0';
    const clusterUUID = '12345';
    const expectedURL =
      'https://access.redhat.com/support/cases/#/case/new/open-case/describe-issue?clusterId=12345&caseCreate=true&product=undefined&version=undefined';
    expect(getSupportCaseURL(product, version, clusterUUID)).toBe(expectedURL);
  });

  it('returns SUPPORT_CASE_URL for restricted environment', () => {
    isRestrictedEnvMock.mockReturnValue(true);
    expect(getSupportCaseURL('OSD', 'v1.0', '12345')).toBe('SUPPORT_CASE_URL_VALUE');
  });
});

describe('supportCaseRow', () => {
  it('returns correct row object for a support case', () => {
    const supportCase = {
      caseID: '123456',
      summary: 'Test summary',
      ownerID: 'owner123',
      lastModifiedDate: '2023-03-28T12:00:00Z',
      lastModifiedBy: 'User123',
      severity: 'High',
      status: 'Open',
    };
    const expectedRow = {
      cells: [
        <a
          href="https://access.redhat.com/support/cases/#/case/123456"
          target="_blank"
          rel="noopener noreferrer"
        >
          123456
        </a>,
        'Test summary',
        'owner123',
        <>
          User123
          <br />
          {dayjs.utc('2023-03-28T12:00:00Z').format('D MMM YYYY')}
        </>,
        'High',
        'Open',
      ],
      caseID: '123456',
    };
    expect(supportCaseRow(supportCase)).toEqual(expectedRow);
  });

  it('formats last modified by and date correctly when last modified date is provided', () => {
    const supportCase = {
      caseID: '789',
      summary: 'Another test summary',
      ownerID: 'owner789',
      lastModifiedDate: '2022-01-15T08:30:00Z',
      lastModifiedBy: 'User789',
      severity: 'Medium',
      status: 'Closed',
    };
    const expectedLastModifiedByAndDate = (
      <>
        User789
        <br />
        {dayjs.utc('2022-01-15T08:30:00Z').format('D MMM YYYY')}
      </>
    );
    const row = supportCaseRow(supportCase);
    expect(row.cells[3]).toEqual(expectedLastModifiedByAndDate);
  });

  it('formats last modified by and date correctly when last modified date is not provided', () => {
    const supportCase = {
      caseID: '555',
      summary: 'No last modified date',
      ownerID: 'owner555',
      lastModifiedBy: 'User555',
      severity: 'Low',
      status: 'Open',
    };
    const expectedLastModifiedByAndDate = (
      <>
        User555
        <br />
        {dayjs.utc(undefined).format('D MMM YYYY')}
      </>
    );
    const row = supportCaseRow(supportCase);
    expect(row.cells[3]).toEqual(expectedLastModifiedByAndDate);
  });
});
