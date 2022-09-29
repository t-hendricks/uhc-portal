/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type manifest = {
  /**
   * The file name prefaced by the folder that contains it.
   */
  file_name?: string;
  /**
   * The folder that contains the files. Manifests can be placed in 'manifests' or 'openshift' directories.
   */
  folder?: manifest.folder;
};

export namespace manifest {
  /**
   * The folder that contains the files. Manifests can be placed in 'manifests' or 'openshift' directories.
   */
  export enum folder {
    MANIFESTS = 'manifests',
    OPENSHIFT = 'openshift',
  }
}
