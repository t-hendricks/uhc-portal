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
  ],
};
