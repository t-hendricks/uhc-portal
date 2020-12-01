import React from 'react';
import { shallow } from 'enzyme';
import {
  Divider,
} from '@patternfly/react-core';
import { Spinner } from '@redhat-cloud-services/frontend-components';
import VersionSelectionGrid from '../VersionSelectionGrid';
import VersionCard from '../VersionCard';

const baseResponse = {
  fulfilled: false,
  pending: false,
  error: false,
};

describe('<VersionSelectionGrid />', () => {
  let wrapper;
  let getVersion;
  let onSelect;

  const cases = [
    { // should only have latest
      version: '4.5.20',
      channelGroup: 'candidate',
      availableUpgrades: [
        '4.6.5',
      ],
    },
    { // should only have latest in curr minor
      version: '4.5.15',
      channelGroup: 'stable',
      availableUpgrades: [
        '4.5.16',
        '4.5.17',
        '4.5.18',
        '4.5.19',
      ],
    },
    { // should have both recommendations and more
      version: '4.5.15',
      channelGroup: 'candidate',
      availableUpgrades: [
        '4.5.16',
        '4.5.17',
        '4.5.18',
        '4.5.19',
        '4.5.20',
        '4.6.0-rc.2',
        '4.6.0-rc.3',
        '4.6.0-rc.4',
        '4.6.2',
      ],
    },
    {
      // should have both recommendation and nothing more
      version: '4.5.18',
      channelGroup: 'fast',
      availableUpgrades: [
        '4.5.19',
        '4.6.4',
      ],
    },
  ];

  beforeAll(() => {
    getVersion = jest.fn();
    onSelect = jest.fn();
    wrapper = shallow(
      <VersionSelectionGrid
        clusterVersion=""
        clusterChannel=""
        getVersion={getVersion}
        versionInfo={
          {
            ...baseResponse,
          }
        }
        onSelect={onSelect}
        selected={undefined}
      />,
    );
  });

  it('should display a spinner while version info not fulfilled', () => {
    expect(wrapper.find(Spinner).length).toEqual(1);
  });

  it('should have recommended card for the latest version only and nothing more', () => {
    wrapper.setProps({
      clusterVersion: cases[0].version,
      clusterChannel: cases[0].channelGroup,
      versionInfo: {
        ...baseResponse,
        fulfilled: true,
        ...cases[0],
      },
    });
    const versionCards = wrapper.find(VersionCard);
    expect(versionCards.length).toEqual(1);
    expect(versionCards.at(0).props().isRecommended).toEqual(true);
    expect(versionCards.at(0).render().text()).toContain('Start taking advantage of the new features');
    expect(wrapper.find(Divider).length).toEqual(0);
  });

  it('should have recommended card for the latest version in minor and others unrecommended', () => {
    wrapper.setProps({
      clusterVersion: cases[1].version,
      clusterChannel: cases[1].channelGroup,
      versionInfo: {
        ...baseResponse,
        fulfilled: true,
        ...cases[1],
      },
    });
    const versionCards = wrapper.find(VersionCard);
    expect(versionCards.length).toEqual(4);
    expect(versionCards.filter({ isRecommended: true }).length).toEqual(1);
    expect(versionCards.filter({ isRecommended: true }).at(0).render().text()).toContain('The latest on your current minor version.');
    expect(wrapper.find(Divider).length).toEqual(1);
  });

  it('should have both recommended cards and nothing more', () => {
    wrapper.setProps({
      clusterVersion: cases[2].version,
      clusterChannel: cases[2].channelGroup,
      versionInfo: {
        ...baseResponse,
        fulfilled: true,
        ...cases[2],
      },
    });
    const versionCards = wrapper.find(VersionCard);
    expect(versionCards.length).toEqual(9);
    expect(versionCards.filter({ isRecommended: true }).length).toEqual(2);
    expect(wrapper.find(Divider).length).toEqual(1);
  });

  it('should have both recommended cards and others unrecommended', () => {
    wrapper.setProps({
      clusterVersion: cases[3].version,
      clusterChannel: cases[3].channelGroup,
      versionInfo: {
        ...baseResponse,
        fulfilled: true,
        ...cases[3],
      },
    });
    const versionCards = wrapper.find(VersionCard);
    expect(versionCards.length).toEqual(2);
    expect(versionCards.filter({ isRecommended: true }).length).toEqual(2);
    expect(wrapper.find(Divider).length).toEqual(0);
  });
});
