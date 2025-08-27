const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const { insights } = require('./package.json');

const name = insights.appname;

module.exports = {
  appUrl: `/${name}`,
  appEntry: path.resolve(__dirname, 'src/bootstrap.ts'),
  hotReload: process.env.HOT === 'true',
  debug: true,
  devtool: process.env.NODE_ENV !== 'production' ? 'cheap-module-source-map' : 'source-map',
  useProxy: true,
  proxyVerbose: true,
  interceptChromeConfig: false,
  customProxy: [
    {
      context: ['/mockdata'],
      pathRewrite: { '^/mockdata': '' },
      target: 'http://[::1]:8010',
    },
  ],
  plugins: [
    new ForkTsCheckerWebpackPlugin(),
    new webpack.DefinePlugin({
      APP_DEVMODE: process.env.NODE_ENV !== 'production',
      APP_SENTRY_RELEASE_VERSION: JSON.stringify(process.env.SENTRY_VERSION),
      APP_DEV_SERVER: process.env.NODE_ENV !== 'production',
    }),
    new CopyWebpackPlugin({
      patterns: [{ from: 'public', to: path.resolve(__dirname, 'dist', name), toType: 'dir' }],
    }),
    new MonacoWebpackPlugin({
      languages: ['yaml'],
      customLanguages: [
        {
          label: 'yaml',
          entry: 'monaco-yaml',
          worker: {
            id: 'monaco-yaml/yamlWorker',
            entry: 'monaco-yaml/yaml.worker',
          },
        },
      ],
    }),
  ],
  resolve: {
    modules: [path.resolve(__dirname, 'src'), 'node_modules'],
    alias: {
      '~': path.resolve(__dirname, 'src/'),
    },
  },
  moduleFederation: {
    exclude: ['react-redux', 'react-router-dom'],
    shared: [
      {
        'react-router-dom': {
          singleton: true,
          import: false,
          version: '^6.2.0',
        },
      },
    ],
    exposes: {
      './RootApp': path.resolve(__dirname, 'src/chrome-main.tsx'),
    },
  },
};
