/*
Copyright (c) 2018 Red Hat, Inc.

Licensed under the Apache License, Version 2.0 (the 'License');
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

const path = require('path');
const webpack = require('webpack');
const axios = require('axios').default;
const HtmlWebpackPlugin = require('html-webpack-plugin');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const ChunkMapperPlugin = require('@redhat-cloud-services/frontend-components-config-utilities/chunk-mapper');
const FederationPlugin = require('@redhat-cloud-services/frontend-components-config-utilities/federated-modules');
const { insights } = require('./package.json');

const name = insights.appname;
const moduleName = name.replace(/-(\w)/g, (_, match) => match.toUpperCase());
const reactCSS = /@patternfly\/react-styles\/css/;

const modDir = 'node_modules';
const srcDir = path.resolve(__dirname, 'src');
const outDir = path.resolve(__dirname, 'build', insights.appname);

module.exports = async (_env, argv) => {
  const devMode = argv.mode !== 'production';
  const betaMode = argv.env.beta === 'true';
  const isDevServer = process.argv.includes('serve');

  // Select default API env based on argument if specified.
  // Otherwise, default to 'development' for backend-proxy users when running in dev server,
  // or 'production' when it's a real build.
  const apiEnv = argv.env['api-env'] || (isDevServer ? 'development' : 'production');
  console.log(`Building with apiEnv=${apiEnv}, beta=${betaMode}, isDevServer=${isDevServer}`);

  let bundleAnalyzer = null;
  const appDeployment = betaMode ? 'beta/apps' : 'apps';
  if (process.env.BUNDLE_ANALYZER) {
    bundleAnalyzer = new BundleAnalyzerPlugin({ analyzerPort: '5000', openAnalyzer: true });
  }
  const publicPath = `/${appDeployment}/${insights.appname}/`;
  const entry = path.resolve(srcDir, 'bootstrap.js');

  const noInsightsProxy = argv.env.noproxy;

  const getChromeTemplate = async () => {
    const result = await axios.get(`https://console.redhat.com/${betaMode ? 'beta/' : ''}apps/chrome`);
    return result.data;
  };
  const chromeTemplate = await getChromeTemplate();

  return {
    mode: argv.mode || 'development',
    entry,

    output: {
      path: outDir,
      filename: 'bundle.[name].[contenthash].js',
      publicPath,
    },
    devtool: 'source-map',

    plugins: [
      new MiniCssExtractPlugin({
        filename: devMode ? '[name].css' : '[name].[contenthash].css',
        chunkFilename: devMode ? '[id].css' : '[id].[contenthash].css',
      }),
      new HtmlWebpackPlugin({
        templateContent: chromeTemplate,
      }),
      new webpack.DefinePlugin({
        APP_BETA: betaMode,
        APP_DEVMODE: devMode,
        APP_DEV_SERVER: isDevServer,
        APP_API_ENV: JSON.stringify(apiEnv),
        // For openshift-assisted-ui-lib
        BASE_PATH: JSON.stringify(process.env.BASE_PATH),
      }),
      // For openshift-assisted-ui-lib
      new webpack.EnvironmentPlugin({
        REACT_APP_API_ROOT: '',
        REACT_APP_BUILD_MODE: argv.mode || 'development',
      }),
      new CopyWebpackPlugin({
        patterns: [
          { from: 'public', to: outDir, toType: 'dir' },
        ],
      }),
      FederationPlugin({
        root: __dirname,
        moduleName,
        exposes: {
          './RootApp': path.resolve(srcDir, 'chrome-main.jsx'),
        },
      }),
      new ChunkMapperPlugin({
        modules: [moduleName],
      }),
      bundleAnalyzer,
    ].filter(Boolean),

    module: {
      rules: [
        {
          test: new RegExp(entry),
          loader: require.resolve('@redhat-cloud-services/frontend-components-config-utilities/chrome-render-loader'),
          options: {
            appName: moduleName,
          },
        },
        {
          test: /\.jsx?$/,
          include: srcDir,
          use: {
            loader: 'babel-loader', // babel config is in babel.config.js
            options: {
              cacheDirectory: true,
            },
          },
        },
        {
          test: /\.scss$/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            {
              loader: 'sass-loader',
              options: {
                sassOptions: {
                  includePaths: ['./node_modules/', './src'],
                },
              },
            },
          ],
        },
        {
          test: /\.css$/,
          exclude: reactCSS,
          use: [MiniCssExtractPlugin.loader, 'css-loader'],
        },
        {
          // eslint-disable-next-line max-len
          // Since we use Insights' upstream PatternFly, we're using null-loader to save about 1MB of CSS
          test: /\.css$/i,
          include: reactCSS,
          use: 'null-loader',
        },
        {
          test: /(webfont\.svg|\.(eot|ttf|woff|woff2))$/,
          loader: 'file-loader',
          options: {
            name: 'fonts/[name].[hash].[ext]',
          },
        },
        {
          test: /(?!webfont)\.(gif|jpg|png|svg)$/,
          loader: 'url-loader', // Bundle small images in JS as base64 URIs.
          options: {
            limit: 8000, // Don't bundle images larger than 8KB in the JS bundle.
            name: 'images/[name].[hash].[ext]',
          },
        },
        // For react-markdown#unified#vfile
        // https://github.com/vfile/vfile/issues/38#issuecomment-683198538
        {
          test: /node_modules\/vfile\/core\.js/,
          use: [{
            loader: 'imports-loader',
            options: {
              type: 'commonjs',
              imports: ['single process/browser process'],
            },
          }],
        },
      ],
    },

    resolve: {
      extensions: ['.js', '.jsx'],
      modules: [srcDir, modDir],
      // For react-markdown#unified#vfile
      fallback: {
        path: require.resolve('path-browserify'),
        url: require.resolve('url/'),
      },
    },

    devServer: {
      historyApiFallback: {
        index: `${publicPath}index.html`,
      },
      setupMiddlewares: (middlewares, devServer) => {
        if (!devServer) {
          throw new Error('webpack-dev-server is not defined');
        }

        return middlewares;
      },
      proxy: noInsightsProxy ? [
        {
          context: ['/mockdata'],
          pathRewrite: { '^/mockdata': '' },
          target: 'http://localhost:8010',
          logLevel: 'info', // Less necessary because mockserver also logs.
        },
        {
          // docs: https://github.com/chimurai/http-proxy-middleware#http-proxy-options
          // proxy everything except our own app, mimicking insights-proxy behaviour
          context: ['**', `!${publicPath}**`, '!/mockdata'],
          target: 'https://console.redhat.com',
          // replace the "host" header's URL origin with the origin from the target URL
          changeOrigin: true,
          // change the "origin" header of the proxied request to avoid CORS
          // many APIs do not allow the requests from the foreign origin
          onProxyReq(request) {
            request.setHeader('origin', 'https://console.redhat.com');
          },
          logLevel: 'debug',
        },
      ] : undefined,
      hot: false,
      port: noInsightsProxy ? 1337 : 8001,
      https: !!noInsightsProxy,
      host: 'localhost',
      webSocketServer: 'sockjs',
      allowedHosts: 'all',
    },
  };
};
