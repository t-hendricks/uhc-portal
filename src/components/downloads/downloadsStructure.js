import { tools } from '../../common/installLinks.mjs';

/** Used to track row collapsed/expanded state, and also for URLs linking to specific row. */
export const expandKeys = {
  ...tools,
  // the rest should be distinct from `tools` keys.
  PULL_SECRET: 'pull-secret',
  TOKEN_OCM: 'ocm-api-token',
};

/**
 * Represents the sections and entries of downloads page.
 */
export const downloadsCategories = [
  // 'ALL' will be inserted here, see below.
  {
    key: 'CLI',
    title: 'Command-line interface (CLI) tools',
    tools: [tools.OC, tools.OCM, tools.ROSA, tools.KN, tools.TKN],
  },
  {
    key: 'DEV',
    title: 'Developer tools',
    tools: [tools.ODO, tools.HELM, tools.OPM, tools.OPERATOR_SDK, tools.RHOAS],
  },
  {
    key: 'INSTALLATION',
    title: 'OpenShift installation',
    tools: [
      tools.X86INSTALLER,
      tools.IBMZINSTALLER,
      tools.PPCINSTALLER,
      tools.ARMINSTALLER,
      tools.MULTIINSTALLER,
      tools.CRC,
    ],
  },
  {
    key: 'DISCONNECTED_INSTALLATION',
    title: 'OpenShift disconnected installation tools',
    tools: [tools.MIRROR_REGISTRY, tools.OC_MIRROR_PLUGIN],
  },
  {
    key: 'CUSTOM_INSTALLATION',
    title: 'OpenShift installation customization tools',
    tools: [tools.BUTANE, tools.COREOS_INSTALLER, tools.CCOCTL],
  },
  {
    key: 'TOKENS',
    title: 'Tokens',
    tools: [expandKeys.PULL_SECRET, expandKeys.TOKEN_OCM],
  },
];
downloadsCategories.unshift({
  key: 'ALL',
  title: 'All categories',
  tools: [].concat(...downloadsCategories.map((c) => c.tools)),
});
