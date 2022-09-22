/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type create_manifest_params = {
    /**
     * base64 encoded manifest content.
     */
    content: string;
    /**
     * The name of the manifest to customize the installed OCP cluster.
     */
    file_name: string;
    /**
     * The folder that contains the files. Manifests can be placed in 'manifests' or 'openshift' directories.
     */
    folder?: create_manifest_params.folder;
};

export namespace create_manifest_params {

    /**
     * The folder that contains the files. Manifests can be placed in 'manifests' or 'openshift' directories.
     */
    export enum folder {
        MANIFESTS = 'manifests',
        OPENSHIFT = 'openshift',
    }


}

