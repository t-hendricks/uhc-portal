import { TechnologyPreview as MockTechnologyPreview, ClusterStatus as MockClusterStatus } from './assistedUiFakeComponents';

const plainFnMock = () => 1;
const promiseFnMock = () => Promise.resolve();

export const PreviewBadgePosition = {
    default: 'default',
    inline: 'inline',
    inlineRight: 'inlineRight',
}

export const TechnologyPreview = MockTechnologyPreview;

export const ClusterStatus = MockClusterStatus;

export const Services = {
    APIs: {
        ClustersAPI: {get: promiseFnMock, listBySubscriptionIds: promiseFnMock },
        ManagedDomainsAPI: {},
        SupportedOpenshiftVersionsAPI: {},
        ComponentVersionsAPI: {},
        HostsAPI: {},
        InfraEnvsAPI: {},
        EventsAPI: {},
        NewFeatureSupportLevelsAPI: {},
    },
    NewFeatureSupportLevelsService: { getFeaturesSupportLevel: promiseFnMock },
};

// The mock contains a dummy implementation for all of assisted-ui-lib's "OCM" object properties used within OCM UI
export const OCM = {
    getMasterCount: plainFnMock,
    getWorkerCount: plainFnMock,
    getClustervCPUCount: plainFnMock,
    getClusterMemoryAmount: plainFnMock,
    Services,
    TechnologyPreview,
    PreviewBadgePosition,
    ClusterStatus,
}

export default OCM;
