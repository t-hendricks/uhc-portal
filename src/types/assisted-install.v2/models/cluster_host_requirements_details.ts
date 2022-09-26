/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type cluster_host_requirements_details = {
  /**
   * Required number of CPU cores
   */
  cpu_cores?: number;
  /**
   * Required disk size in GB
   */
  disk_size_gb?: number;
  /**
   * Required installation disk speed in ms
   */
  installation_disk_speed_threshold_ms?: number;
  /**
   * Maximum network average latency (RTT) at L3 for role.
   */
  network_latency_threshold_ms?: number | null;
  /**
   * Maximum packet loss allowed at L3 for role.
   */
  packet_loss_percentage?: number | null;
  /**
   * Required number of RAM in MiB
   */
  ram_mib?: number;
  /**
   * Whether TPM module should be enabled in host's BIOS.
   */
  tpm_enabled_in_bios?: boolean;
};
