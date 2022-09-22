/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Representation of an _OpenShift_ version.
 */
export type Version = {
    /**
     * Indicates the type of this object. Will be 'Version' if this is a complete object or 'VersionLink' if it is just a link.
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
     * ROSAEnabled indicates whether this version can be used to create ROSA clusters.
     */
    rosa_enabled?: boolean;
    /**
     * AvailableUpgrades is the list of versions this version can be upgraded to.
     */
    available_upgrades?: Array<string>;
    /**
     * ChannelGroup is the name of the group where this image belongs.
     * ChannelGroup is a mechanism to partition the images to different groups,
     * each image belongs to only a single group.
     */
    channel_group?: string;
    /**
     * Indicates if this should be selected as the default version when a cluster is created
     * without specifying explicitly the version.
     */
    default?: boolean;
    /**
     * Indicates if this version can be used to create clusters.
     */
    enabled?: boolean;
    /**
     * EndOfLifeTimestamp is the date and time when the version will get to End of Life, using the
     * format defined in https://www.ietf.org/rfc/rfc3339.txt[RC3339].
     */
    end_of_life_timestamp?: string;
    /**
     * RawID is the id of the version - without channel group and prefix.
     */
    raw_id?: string;
    /**
     * ReleaseImage contains the URI of Openshift release image
     */
    release_image?: string;
};

