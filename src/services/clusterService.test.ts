import axios from 'axios';
import apiRequest from '~/services/apiRequest';
import { insightsMock } from '~/testUtils';
import clusterService from './clusterService';

type MockedJest = jest.Mocked<typeof axios> & jest.Mock;
const apiRequestMock = apiRequest as unknown as MockedJest;

insightsMock();

const getApiGetParams = () => apiRequestMock.get.mock.calls[0][1]?.params;

describe('clusterService', () => {
  beforeEach(() => {
    apiRequestMock.get.mockResolvedValue({ versions: ['a list of versions'] });
  });
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('call to get versions includes product=hcp when isHCP param is set', async () => {
    const isHCP = true;
    await clusterService.getInstallableVersions(true, false, isHCP);

    expect(apiRequestMock.get).toHaveBeenCalledTimes(1);
    expect(getApiGetParams().product).toEqual('hcp');
  });

  it('call to get versions includes rosa_enabled if isRosa is true', async () => {
    const isRosa = true;
    await clusterService.getInstallableVersions(isRosa, false, false);

    expect(apiRequestMock.get).toHaveBeenCalledTimes(1);
    expect(getApiGetParams().search).toContain("rosa_enabled='t'");
  });

  it('call to get versions does not includes rosa_enabled if isRosa is false', async () => {
    const isRosa = false;
    await clusterService.getInstallableVersions(isRosa, false, false);

    expect(apiRequestMock.get).toHaveBeenCalledTimes(1);
    expect(getApiGetParams().search).not.toContain("rosa_enabled='t'");
  });

  it('call to get versions includes gcp_marketplace_enabled if isGCP is true', async () => {
    const isGCP = true;
    await clusterService.getInstallableVersions(false, isGCP, false);

    expect(apiRequestMock.get).toHaveBeenCalledTimes(1);
    expect(getApiGetParams().search).toContain("gcp_marketplace_enabled='t'");
  });

  it('call to get versions does not includes gcp_marketplace_enabled if isGCP is false', async () => {
    const isGCP = false;
    await clusterService.getInstallableVersions(false, isGCP, false);

    expect(apiRequestMock.get).toHaveBeenCalledTimes(1);
    expect(getApiGetParams().search).not.toContain("gcp_marketplace_enabled='t'");
  });
});
