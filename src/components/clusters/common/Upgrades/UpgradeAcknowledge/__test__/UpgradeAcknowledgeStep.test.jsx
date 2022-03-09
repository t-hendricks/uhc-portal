import React from 'react';
import { mount } from 'enzyme';

import UpgradeAcknowledgeStep from '../UpgradeAcknowledgeStep';

describe('<UpgradeAcknowledgeStep>', () => {
  let wrapper;
  const ackWord = 'Acknowledge';
  const confirmedMock = jest.fn();

  const ackArray = [
    { description: 'my upgrade gate', warning_message: 'my ack warning message', documentation_url: 'my doc url' },
    { description: 'my other upgrade gate', warning_message: 'my other ack warning message', documentation_url: 'my other doc url' },
  ];

  beforeEach(() => {
    confirmedMock.mockClear();

    wrapper = mount(
      <UpgradeAcknowledgeStep
        confirmed={confirmedMock}
        unmetAcknowledgements={ackArray}
        fromVersion="4.8.2"
        toVersion="4.9.12"
      />,
    );
  });

  it('should render correctly on load', () => {
    expect(wrapper.find('[data-testid="unmetAcknowledgement"]')).toHaveLength(ackArray.length);
    expect(wrapper).toMatchSnapshot();
  });

  it('should not be confirmed on empty confirm text', () => {
    wrapper.find('TextInput[data-testid="acknowledgeTextInput"]').invoke('onChange')('');
    wrapper.update();
    expect(confirmedMock.mock.calls[confirmedMock.mock.calls.length - 1][0]).toEqual(false);
  });

  it('should not be confirmed if wrong confirm word is typed', () => {
    wrapper.find('TextInput[data-testid="acknowledgeTextInput"]').invoke('onChange')('notCorrectWord');
    wrapper.update();
    expect(confirmedMock.mock.calls[confirmedMock.mock.calls.length - 1][0]).toEqual(false);
  });

  it('should confirm if correct confirm word is typed', () => {
    wrapper.find('TextInput[data-testid="acknowledgeTextInput"]').invoke('onChange')(ackWord);
    wrapper.update();
    expect(confirmedMock.mock.calls[confirmedMock.mock.calls.length - 1][0]).toEqual(true);
  });

  it('is confirmed on load if initiallyConfirmed is true', () => {
    wrapper = mount(
      <UpgradeAcknowledgeStep
        confirmed={confirmedMock}
        unmetAcknowledgements={ackArray}
        fromVersion="4.8.2"
        toVersion="4.9.12"
        initiallyConfirmed
      />,
    );

    expect(confirmedMock.mock.calls[confirmedMock.mock.calls.length - 1][0]).toEqual(true);
  });
});
