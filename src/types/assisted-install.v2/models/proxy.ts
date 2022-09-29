/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type proxy = {
  /**
   * A proxy URL to use for creating HTTP connections outside the cluster.
   * http://\<username\>:\<pswd\>@\<ip\>:\<port\>
   *
   */
  http_proxy?: string | null;
  /**
   * A proxy URL to use for creating HTTPS connections outside the cluster.
   * http://\<username\>:\<pswd\>@\<ip\>:\<port\>
   *
   */
  https_proxy?: string | null;
  /**
   * An "*" or a comma-separated list of destination domain names, domains, IP addresses, or other network CIDRs to exclude from proxying.
   */
  no_proxy?: string | null;
};
