/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Representation of an _OpenShift_ version gate.
 */
export type VersionGate = {
    /**
     * Indicates the type of this object. Will be 'VersionGate' if this is a complete object or 'VersionGateLink' if it is just a link.
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
     * STSOnly indicates if this version gate is for STS clusters only
     */
    sts_only?: boolean;
    /**
     * CreationTimestamp is the date and time when the version gate was created,
     * format defined in https://www.ietf.org/rfc/rfc3339.txt[RC3339].
     */
    creation_timestamp?: string;
    /**
     * Description of the version gate.
     */
    description?: string;
    /**
     * DocumentationURL is the URL for the documentation of the version gate.
     */
    documentation_url?: string;
    /**
     * Label representing the version gate in OpenShift.
     */
    label?: string;
    /**
     * Value represents the required value of the label.
     */
    value?: string;
    /**
     * VersionRawIDPrefix represents the versions prefix that the gate applies to.
     */
    version_raw_id_prefix?: string;
    /**
     * WarningMessage is a warning that will be displayed to the user before they acknowledge the gate
     */
    warning_message?: string;
};

