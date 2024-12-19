import { haveCapabilities, subscriptionCapabilities } from '~/common/subscriptionCapabilities';
import { GlobalState } from '~/redux/store';

import canSubscribeOCPListSelector from '../canSubscribeOCPListSelector';

jest.mock('~/common/subscriptionCapabilities');

const haveCapabilitiesMock = haveCapabilities as jest.Mock;

describe('canSubscribeOCPListSelector', () => {
  afterEach(() => jest.clearAllMocks());

  it('without clusters', () => {
    // Arrange
    haveCapabilitiesMock.mockReturnValueOnce({ '1': false, '2': false, '3': false });
    haveCapabilitiesMock.mockReturnValueOnce({ '1': true, '2': true, '3': false, '4': false });

    // Act
    const result = canSubscribeOCPListSelector({} as GlobalState);

    // Assert
    expect(result).toStrictEqual({ '1': true, '2': true, '3': false, '4': false });
    expect(haveCapabilitiesMock).toHaveBeenCalledTimes(2);
    expect(haveCapabilitiesMock).toHaveBeenCalledWith([], subscriptionCapabilities.SUBSCRIBED_OCP);
    expect(haveCapabilitiesMock).toHaveBeenCalledWith(
      [],
      subscriptionCapabilities.SUBSCRIBED_OCP_MARKETPLACE,
    );
  });

  it('with clusters', () => {
    // Arrange
    haveCapabilitiesMock.mockReturnValueOnce({ '1': false, '2': false, '3': false });
    haveCapabilitiesMock.mockReturnValueOnce({ '1': true, '2': true, '3': false, '4': true });

    // Act
    const result = canSubscribeOCPListSelector({
      clusters: { clusters: { clusters: 'whatever' } },
    } as any as GlobalState);

    // Assert
    expect(result).toStrictEqual({ '1': true, '2': true, '3': false, '4': true });
    expect(haveCapabilitiesMock).toHaveBeenCalledTimes(2);
    expect(haveCapabilitiesMock).toHaveBeenCalledWith(
      'whatever',
      subscriptionCapabilities.SUBSCRIBED_OCP,
    );
    expect(haveCapabilitiesMock).toHaveBeenCalledWith(
      'whatever',
      subscriptionCapabilities.SUBSCRIBED_OCP_MARKETPLACE,
    );
  });
});
