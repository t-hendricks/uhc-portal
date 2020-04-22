module.exports = {
  env: {
    test: {
      presets: [['@babel/preset-env', {
        targets: {
          browsers: [
            'last 2 firefox versions',
            'last 2 chrome versions',
            'last 2 edge versions',
            'last 2 safari versions',
          ],
        },
      }], '@babel/preset-react'],
      plugins: [
        '@babel/plugin-proposal-class-properties',
        '@babel/plugin-syntax-dynamic-import',
        '@babel/plugin-proposal-object-rest-spread',
        '@babel/plugin-transform-object-assign',
      ],
    },
  },
};
