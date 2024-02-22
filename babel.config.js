const pfReactIconsMapper = {
  IconSize: '@patternfly/react-icons/dist/esm/createIcon',
};

module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          browsers: ['chrome >= 67', 'edge >= 79', 'firefox >= 68', 'opera >= 54', 'safari >= 14'],
          // We have Node 18 in the CI. Could use 'current' but prefer testing exactly same code locally as on CI.
          node: '18',
        },
      },
    ],
    '@babel/preset-react',
  ],
  plugins: [
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-proposal-object-rest-spread',
    '@babel/plugin-transform-object-assign',
    '@babel/plugin-proposal-optional-chaining',
    '@babel/plugin-transform-modules-commonjs',
    'transform-class-properties',
    ['istanbul', {}, 'istanbul-unique'],
    [
      'transform-imports',
      {
        '@patternfly/react-icons': {
          transform: (importName) =>
            pfReactIconsMapper[importName] ||
            `@patternfly/react-icons/dist/esm/icons/${importName
              .split(/(?=[A-Z])/)
              .join('-')
              .toLowerCase()}`,
          preventFullImport: true,
        },
      },
      'react-icons',
    ],
    [
      '@babel/plugin-transform-runtime',
      {
        regenerator: true,
      },
    ],
  ],
};
