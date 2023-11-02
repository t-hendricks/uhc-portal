import MockAdapter from 'axios-mock-adapter';
import apiRequest from '~/services/apiRequest';
import { insightsMock } from '~/testUtils';
import clusterService from './clusterService';

const mock = new MockAdapter(apiRequest);
insightsMock();

describe('clusterService', () => {
  afterEach(() => {
    mock.resetHistory();
    mock.reset();
  });

  it('call to get versions includes product=hcp when isHCP param is set', async () => {
    mock.onGet().reply(200, { versions: ['a list of versions'] });
    const isHCP = true;
    await clusterService.getInstallableVersions(true, false, isHCP);

    expect(mock.history.get).toHaveLength(1);
    expect(mock.history.get[0].params.product).toEqual('hcp');
  });

  it('call to get versions does not include product if isHCP param is not set', async () => {
    mock.onGet().reply(200, { versions: ['a list of versions'] });
    const isHCP = false;
    await clusterService.getInstallableVersions(true, false, isHCP);

    expect(mock.history.get).toHaveLength(1);
    expect(mock.history.get[0].params.product).toBeUndefined();
  });

  it('call to get versions includes rosa_enabled if isRosa is true', async () => {
    mock.onGet().reply(200, { versions: ['a list of versions'] });
    const isRosa = true;
    await clusterService.getInstallableVersions(isRosa, false, false);

    expect(mock.history.get).toHaveLength(1);
    expect(mock.history.get[0].params.search).toContain("rosa_enabled='t'");
  });

  it('call to get versions does not includes rosa_enabled if isRosa is false', async () => {
    mock.onGet().reply(200, { versions: ['a list of versions'] });
    const isRosa = false;
    await clusterService.getInstallableVersions(isRosa, false, false);

    expect(mock.history.get).toHaveLength(1);
    expect(mock.history.get[0].params.search).not.toContain('rosa_enabled');
  });

  it('call to get versions includes gcp_marketplace_enabled if isGCP is true', async () => {
    mock.onGet().reply(200, { versions: ['a list of versions'] });
    const isGCP = true;
    await clusterService.getInstallableVersions(false, isGCP, false);

    expect(mock.history.get).toHaveLength(1);
    expect(mock.history.get[0].params.search).toContain("gcp_marketplace_enabled='t'");
  });

  it('call to get versions does not includes gcp_marketplace_enabled if isGCP is false', async () => {
    mock.onGet().reply(200, { versions: ['a list of versions'] });
    const isGCP = false;
    await clusterService.getInstallableVersions(false, isGCP, false);

    expect(mock.history.get).toHaveLength(1);
    expect(mock.history.get[0].params.search).not.toContain('gcp_marketplace_enabled');
  });
});
