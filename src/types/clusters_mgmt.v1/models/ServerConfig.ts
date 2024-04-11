/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ProvisionShardTopology } from './ProvisionShardTopology';
/**
 * Representation of a server config
 */
export type ServerConfig = {
  /**
   * Indicates the type of this object. Will be 'ServerConfig' if this is a complete object or 'ServerConfigLink' if it is just a link.
   */
  kind?: string;
  /**
   * Unique identifier of the object.
   */
  id?: string;
  /**
   * Self link.
   */
  href?: string;
  /**
   * The kubeconfig of the server.
   */
  kubeconfig?: string;
  /**
   * The URL of the server.
   */
  server?: string;
  /**
   * The topology of a provision shard (Optional).
   */
  topology?: ProvisionShardTopology;
};
