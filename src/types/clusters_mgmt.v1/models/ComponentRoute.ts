/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Representation of a Component Route.
 */
export type ComponentRoute = {
  /**
   * Indicates the type of this object. Will be 'ComponentRoute' if this is a complete object or 'ComponentRouteLink' if it is just a link.
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
   * Hostname of the route.
   */
  hostname?: string;
  /**
   * TLS Secret reference of the route.
   */
  tls_secret_ref?: string;
};
