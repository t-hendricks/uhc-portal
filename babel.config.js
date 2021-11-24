// babel config, adapted from https://github.com/RedHatInsights/insights-rbac-ui/blob/master/babel.config.js
const path = require('path');
const glob = require('glob');
/*
Define mappers for automatic loading of CommonJS modules / es modules.

By default, when you import a component from PatternFly (for example),
babel/webpack often end up importing the entire library, and that makes
tree-shaking difficult and inefficient.

By importing specific components directly, we can save few megabytes in final bundle size.
We could go to every import statement in the app and change it to import the specific component,
but that's tedious and requires developers to remember they need to do this.

Instead, we can write some babel rules to load specific components,
without loading the entire library.

For most components/exported objects, the file name and the export name are identical.
But in some cases the export is not in its own file, but rather in a file with a different name.

These mappers map exported names -> the filename of the file that contains them.

Based on recommendation from Karel Hala: http://post-office.corp.redhat.com/archives/insights-platform/2020-June/msg00005.html

See https://github.com/RedHatInsights/frontend-components#treeshaking-pf-with-babel-plugin for more information.
*/
const PFmapper = {
  TextVariants: 'Text',
  DropdownPosition: 'dropdownConstants',
  EmptyStateVariant: 'EmptyState',
  TextListItemVariants: 'TextListItem',
  TextListVariants: 'TextList',
  TooltipPosition: 'Tooltip',
  PopoverPosition: 'Popover',
  FlexModifiers: 'FlexUtils',
  ListComponent: 'List',
  OrderType: 'List',
  SelectVariant: 'Select',
  ButtonVariant: 'Button',
  ProgressSize: 'Progress',
  ModalVariant: 'Modal',
  AlertVariant: 'Alert',
  clipboardCopyFunc: 'ClipboardCopy',
  TextInputTypes: 'TextInput',
  ProgressVariant: 'Progress',
  ProgressMeasureLocation: 'Progress',
  ButtonType: 'Button',
  TitleSizes: 'Title',
  PageSectionVariants: 'PageSection',
};

const FECMapper = {
  SkeletonSize: 'Skeleton',
  PageHeaderTitle: 'PageHeader',
  conditionalFilterType: 'ConditionalFilter',
};

module.exports = {
  presets: [['@babel/preset-env', {
    targets: {
      browsers: [
        'last 2 firefox versions',
        'last 2 chrome versions',
        'last 2 edge versions',
        'last 2 safari versions',
      ],
      // As of Nov 2021, we have Node 12 in CI.  Most people have newer (14-16) locally,
      // could use 'current' but prefer testing exactly same code locally as on CI.
      node: '12',
    },
  }], '@babel/preset-react'],
  plugins: [
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-proposal-object-rest-spread',
    '@babel/plugin-transform-object-assign',
    '@babel/plugin-proposal-optional-chaining',
    '@babel/plugin-transform-modules-commonjs',
    [
      'transform-imports',
      {
        '@patternfly/react-core': {
          transform: (importName) => {
            const files = glob.sync(
              path.resolve(
                __dirname,
                `./node_modules/@patternfly/react-core/dist/js/**/${PFmapper[
                  importName
                ] || importName}.js`,
              ),
            );
            if (files.length > 0) {
              return files[0].replace(/.*(?=@patternfly)/, '');
            }
            throw new Error(`File with importName ${importName} does not exist`);
          },
          preventFullImport: false,
          skipDefaultConversion: true,
        },
      },
      'react-core',
    ],
    [
      'transform-imports',
      {
        '@patternfly/react-icons': {
          transform: importName => `@patternfly/react-icons/dist/js/icons/${importName
            .split(/(?=[A-Z])/)
            .join('-')
            .toLowerCase()}`,
          preventFullImport: true,
        },
      },
      'react-icons',
    ],
    [
      'transform-imports',
      {
        '@redhat-cloud-services/frontend-components': {
          transform: importName => `@redhat-cloud-services/frontend-components/${FECMapper[importName] || importName}`,
          preventFullImport: false,
          skipDefaultConversion: true,
        },
      },
      'frontend-components',
    ],
    [
      'transform-imports',
      {
        '@redhat-cloud-services/frontend-components-notifications': {
          transform: importName => `@redhat-cloud-services/frontend-components-notifications/${importName}`,
          preventFullImport: false,
        },
      },
      'frontend-notifications',
    ],
  ],
};
