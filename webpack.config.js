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
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
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

  // While user-visible URLs are moving /beta/openshift -> /preview/openshift,
  // the compiled assets will remain at /beta/apps/openshift.
  const appDeployment = betaMode ? 'beta/apps' : 'apps';
  const publicPath = `/${appDeployment}/${insights.appname}/`;

  let bundleAnalyzer = null;
  if (process.env.BUNDLE_ANALYZER) {
    bundleAnalyzer = new BundleAnalyzerPlugin({ analyzerPort: '5000', openAnalyzer: true });
  }
  const entry = path.resolve(srcDir, 'bootstrap.ts');

  const noInsightsProxy = argv.env.noproxy;
  // Support `logging=quiet` vs. `logging=verbose`. Default verbose (might change in future).
  const verboseLogging = argv.env.logging !== 'quiet';

  const getChromeTemplate = async () => {
    const result = await axios.get(
      `https://console.redhat.com/${betaMode ? 'preview/' : ''}apps/chrome/index.html`,
    );
    return result.data;
  };
  const chromeTemplate = await getChromeTemplate();

  // For hot reloads while developing, reset window's onbeforeunload event
  // to prevent browser confirmation dialogs.
  if (module.hot && typeof module.hot.dispose === 'function') {
    module.hot.dispose(() => {
      window.onbeforeunload = null;
    });
  }

  return {
    mode: argv.mode || 'development',
    entry,

    infrastructureLogging: {
      level: verboseLogging ? 'verbose' : 'warn',
      // Logs all proxy activity. Is verbose & redundant with mockserver's own logging.
      // debug: [name => name.includes('webpack-dev-server')],
    },

    output: {
      path: outDir,
      filename: 'bundle.[name].[contenthash].js',
      hashFunction: 'xxhash64', // default md4 not allowed on recent NodeJS/OpenSSL
      publicPath,
    },
    devtool: 'source-map',

    plugins: [
      new ForkTsCheckerWebpackPlugin(),
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
        process: { env: {} },
      }),
      // For openshift-assisted-ui-lib
      new webpack.EnvironmentPlugin({
        REACT_APP_API_ROOT: '',
        REACT_APP_BUILD_MODE: argv.mode || 'development',
        REACT_APP_CLUSTER_PERMISSIONS: '',
      }),
      new CopyWebpackPlugin({
        patterns: [{ from: 'public', to: outDir, toType: 'dir' }],
      }),
      FederationPlugin({
        root: __dirname,
        moduleName,
        exposes: {
          './RootApp': path.resolve(srcDir, 'chrome-main.tsx'),
        },
        shared: [
          {
            '@scalprum/react-core': { requiredVersion: '*', singleton: true },
          },
        ],
      }),
      new ChunkMapperPlugin({
        modules: [moduleName],
      }),
      bundleAnalyzer,
    ].filter(Boolean),

    module: {
      rules: [
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
          test: /src\/.*\.tsx?$/,
          loader: 'ts-loader',
          exclude: /(node_modules)/i,
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
          // eslint-disable-next-line max-len
          // Since we use Insights' upstream PatternFly, we're using null-loader to save about 1MB of CSS
          test: /\.css$/i,
          include: reactCSS,
          use: 'ocm-null-loader',
        },
        {
          test: /\.css$/,
          exclude: reactCSS,
          use: [MiniCssExtractPlugin.loader, 'css-loader'],
        },
        {
          test: /(webfont\.svg|\.(eot|ttf|woff|woff2))$/,
          type: 'asset/resource',
          generator: {
            filename: 'fonts/[name].[hash].[ext]'
          },
        },
        {
          test: /(?!webfont)\.(gif|jpg|png|svg)$/,
          type: 'asset', // automatically chooses between bundling small images in JS as base64 URIs and emitting separate files based on size
          generator: {
            filename: 'images/[name].[hash].[ext]'
          },
        },
        // For react-markdown#unified#vfile
        // https://github.com/vfile/vfile/issues/38#issuecomment-683198538
        {
          test: /node_modules\/vfile\/core\.js/,
          use: [
            {
              loader: 'imports-loader',
              options: {
                type: 'commonjs',
                imports: ['single process/browser process'],
              },
            },
          ],
        },
      ],
    },

    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      modules: [srcDir, modDir],
      // For react-markdown#unified#vfile
      fallback: {
        path: require.resolve('path-browserify'),
        url: require.resolve('url/'),
      },
      alias: {
        '~': path.resolve(__dirname, 'src/'),
        '@testUtils': path.resolve(__dirname, 'src/testUtils.tsx'),
      },
    },

    resolveLoader: {
      modules: ['node_modules', path.resolve(__dirname, 'loaders')],
    },

    devServer: {
      historyApiFallback: {
        index: `${publicPath}index.html`,
      },
      setupMiddlewares: (middlewares, devServer) => {
        if (!devServer) {
          throw new Error('webpack-dev-server is not defined');
        }

        if (verboseLogging) {
          middlewares.unshift({
            name: 'logging',
            middleware: (request, response, next) => {
              console.log('Handling', request.originalUrl);
              next();
            },
          });
        }
        return middlewares;
      },
      proxy: noInsightsProxy
        ? [
          {
            context: ['/mockdata'],
            pathRewrite: { '^/mockdata': '' },
            target: 'http://localhost:8010',
            onProxyReq(request) {
              if (verboseLogging) {
                // Redundant with mockserver's own logging.
                // console.log('  proxying localhost:8010:', request.path);
              }
            },
          },
          {
            // docs: https://github.com/chimurai/http-proxy-middleware#http-proxy-options
            // proxy everything except our own app, mimicking insights-proxy behaviour
            context: [
              '**',
              '!/mockdata/**',
              `!/apps/${insights.appname}/**`,
              `!/beta/apps/${insights.appname}/**`,
              `!/preview/apps/${insights.appname}/**`, // not expected to be used
            ],
            target: 'https://console.redhat.com',
            // replace the "host" header's URL origin with the origin from the target URL
            changeOrigin: true,
            // change the "origin" header of the proxied request to avoid CORS
            // many APIs do not allow the requests from the foreign origin
            onProxyReq(request) {
              request.setHeader('origin', 'https://console.redhat.com');
              if (verboseLogging) {
                console.log('  proxying console.redhat.com:', request.path);
              }
            },
          },
        ]
        : undefined,
      hot: false,
      port: noInsightsProxy ? 1337 : 8001,
      https: !!noInsightsProxy,
      host: '0.0.0.0',
      allowedHosts: 'all',
    },
  };
};
