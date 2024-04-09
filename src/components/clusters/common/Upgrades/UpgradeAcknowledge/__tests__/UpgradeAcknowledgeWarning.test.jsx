import React from 'react';

import { checkAccessibility, render, screen } from '~/testUtils';

import UpgradeAcknowledgeWarning from '../UpgradeAcknowledgeWarning/UpgradeAcknowledgeWarning';

const unMetAcks = [{ title: 'myUnmetAcks' }];
const metAcks = [{ title: 'myMetAcks' }];

describe('<UpgradeAcknowledgeWarning>', () => {
  const openModal = jest.fn();

  const defaultProps = {
    openModal,
    clusterId: 'myClusterId',
    fromVersion: '4.8.10',
    toVersion: '4.9.11',
    getAcks: [unMetAcks, metAcks],
    openshiftVersion: 'my.openshift.version',
  };

  afterEach(() => {
    openModal.mockClear();
  });

  it('Displays nothing if cluster id is unknown', () => {
    const newProps = {
      ...defaultProps,
      clusterId: undefined,
    };
    const { container } = render(<UpgradeAcknowledgeWarning {...newProps} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('Displays nothing if openshiftVersion is unknown', () => {
    const newProps = {
      ...defaultProps,
      openshiftVersion: undefined,
    };
    const { container } = render(<UpgradeAcknowledgeWarning {...newProps} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('Display nothing if no clusterUnmetAcks AND do not show confirm', () => {
    const newProps = {
      ...defaultProps,
      showConfirm: false,
      getAcks: [[], metAcks],
    };
    const { container } = render(<UpgradeAcknowledgeWarning {...newProps} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('Display confirmation if  clusterMetAcks and is yStream approved', async () => {
    const newProps = {
      ...defaultProps,
      showConfirm: true,
      getAcks: [[], metAcks],
      isMinorVersionUpgradesEnabled: true,
    };
    const { container } = render(<UpgradeAcknowledgeWarning {...newProps} />);

    expect(screen.getByText('Administrator acknowledgement was received.')).toBeInTheDocument();
    await checkAccessibility(container);
  });

  it('Display confirmation if there is only clusterMetAcks and is not yStream approved', () => {
    const newProps = {
      ...defaultProps,
      showConfirm: true,
      getAcks: [[], metAcks],
      isMinorVersionUpgradesEnabled: false,
    };
    render(<UpgradeAcknowledgeWarning {...newProps} />);

    expect(screen.getByText('Administrator acknowledgement was received.')).toBeInTheDocument();
  });

  it('Display message if isManual AND if is Info', () => {
    const newProps = {
      ...defaultProps,
      isManual: true,
      isInfo: true,
      getAcks: [unMetAcks, []],
    };
    render(<UpgradeAcknowledgeWarning {...newProps} />);

    expect(
      screen.getByText(
        'Administrator acknowledgement is required before updating from 4.8.10 to 4.9.11',
      ),
    ).toBeInTheDocument();

    expect(screen.queryByRole('button', { name: 'Provide approval' })).not.toBeInTheDocument();
  });

  it('displays nothing if isManual but has a scheduled upgrade', () => {
    const newProps = {
      ...defaultProps,
      isManual: true,
      isInfo: true,
      getAcks: [unMetAcks, []],
      hasScheduledManual: true,
    };
    const { container } = render(<UpgradeAcknowledgeWarning {...newProps} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('Display nothing if isManual AND if is not Info', () => {
    const newProps = {
      ...defaultProps,
      isManual: true,
      isInfo: false,
      getAcks: [unMetAcks, []],
    };
    const { container } = render(<UpgradeAcknowledgeWarning {...newProps} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('Display alert if is not manual', () => {
    const newProps = {
      ...defaultProps,
      isManual: false,
      getAcks: [unMetAcks, []],
    };
    render(<UpgradeAcknowledgeWarning {...newProps} />);
    expect(
      screen.getByText(
        'Administrator acknowledgement is required before updating from 4.8.10 to 4.9.11',
      ),
    ).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'Provide approval' })).toBeInTheDocument();
  });

  it('Set correct info when opening modal', () => {
    const newProps = {
      ...defaultProps,
      isManual: false,
      isPlain: true,
      getAcks: [unMetAcks, []],
    };
    render(<UpgradeAcknowledgeWarning {...newProps} />);
    expect(
      screen.getByText(
        'Administrator acknowledgement is required before updating from 4.8.10 to 4.9.11',
      ),
    ).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'Provide approval' })).toBeInTheDocument();
  });
});
