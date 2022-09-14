/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export enum step_type {
    CONNECTIVITY_CHECK = 'connectivity-check',
    EXECUTE = 'execute',
    INVENTORY = 'inventory',
    INSTALL = 'install',
    FREE_NETWORK_ADDRESSES = 'free-network-addresses',
    DHCP_LEASE_ALLOCATE = 'dhcp-lease-allocate',
    API_VIP_CONNECTIVITY_CHECK = 'api-vip-connectivity-check',
    NTP_SYNCHRONIZER = 'ntp-synchronizer',
    INSTALLATION_DISK_SPEED_CHECK = 'installation-disk-speed-check',
    CONTAINER_IMAGE_AVAILABILITY = 'container-image-availability',
    DOMAIN_RESOLUTION = 'domain-resolution',
    STOP_INSTALLATION = 'stop-installation',
    LOGS_GATHER = 'logs-gather',
    NEXT_STEP_RUNNER = 'next-step-runner',
}
