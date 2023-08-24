import { action, ActionType } from 'typesafe-actions';
import { dnsDomainsConstants } from '~/redux/constants';
import { clusterService } from '../../services';

// Gets available DNS domains that can be used for sharing VPCs
const getAvailableSharedVpcDnsDomains = () =>
  action(
    dnsDomainsConstants.GET_DNS_DOMAINS,
    clusterService.getDnsDomains({
      userDefined: true,
      hasCluster: false,
    }),
  );

const createNewBaseDnsDomain = () =>
  action(dnsDomainsConstants.CREATE_DNS_DOMAIN, clusterService.createNewDnsDomain());

const deleteBaseDnsDomain = (id: string) =>
  action(dnsDomainsConstants.DELETE_DNS_DOMAIN, clusterService.deleteDnsDomain(id), {
    deletedDnsId: id,
  });

// "Forgets" the last created domain
const clearLastCreatedBaseDnsDomain = () => action(dnsDomainsConstants.CLEAR_CREATED_DNS_DOMAIN);

const dnsDomainsActions = {
  getAvailableSharedVpcDnsDomains,
  createNewBaseDnsDomain,
  deleteBaseDnsDomain,
  clearLastCreatedBaseDnsDomain,
};

export { dnsDomainsActions };

export type DnsDomainsAction = ActionType<typeof dnsDomainsActions>;

export default dnsDomainsActions;
