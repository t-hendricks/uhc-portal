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

const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const ReplaceWebpackPlugin = require('html-replace-webpack-plugin');
const { insights } = require('./package.json');

const modDir = 'node_modules';
const srcDir = path.resolve(__dirname, 'src');
const outDir = path.resolve(__dirname, 'build', insights.appname);

module.exports = (env, argv) => {
  const devMode = argv.mode !== 'production';
  const betaMode = argv.beta == 'true';
  const apiEnv = argv['api-env'] || 'production';
  const isDevServer = !!process.argv.find(v => v.includes('webpack-dev-server'));

  let bundleAnalyzer = null;
  const appDeployment = betaMode ? 'beta/apps' : 'apps';
  if (process.env.BUNDLE_ANALYZER) {
    bundleAnalyzer = new BundleAnalyzerPlugin({ analyzerPort: '5000', openAnalyzer: true });
  }
  const publicPath = `/${appDeployment}/${insights.appname}/`;
  return {
    mode: argv.mode || 'development',
    entry: {
      main: path.resolve(srcDir, 'main.jsx'),
    },

    output: {
      path: outDir,
      filename: 'bundle.[name].js',
      publicPath,
    },
    devtool: 'source-map',

    plugins: [
      new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // both options are optional
        filename: devMode ? '[name].css' : '[name].[hash].css',
        chunkFilename: devMode ? '[id].css' : '[id].[hash].css',
      }),
      new HtmlWebpackPlugin({
        hash: true, // cache invalidation on bundle updates
        chunks: ['main'],
        template: 'src/index.html',
      }),
      new webpack.DefinePlugin({
        OCM_SHOW_OLD_METRICS: process.env.OCM_SHOW_OLD_METRICS === 'true',
        APP_BETA: betaMode,
        APP_DEVMODE: devMode,
        APP_DEV_SERVER: isDevServer,
        APP_API_ENV: JSON.stringify(apiEnv),
      }),
      new ReplaceWebpackPlugin(
        [{
          pattern: '@@insights-esi-body@@',
          replacement: `<esi:include src="/${appDeployment}/chrome/snippets/body.html" />`,
        }, {
          pattern: '@@insights-esi-head@@',
          replacement: `<esi:include src="/${appDeployment}/chrome/snippets/head.html" />`,
        }],
      ),
      new CopyWebpackPlugin([
        { from: 'public', to: outDir, toType: 'dir' },
      ]),
      bundleAnalyzer,
    ].filter(Boolean),

    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: [/node_modules/],
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
            devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
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
          use: [devMode ? 'style-loader' : MiniCssExtractPlugin.loader, 'css-loader'],
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
        {
          test: /\.mjs$/,
          include: /node_modules/,
          type: 'javascript/auto',
        },
      ],
    },

    resolve: {
      extensions: ['.mjs', '.js', '.jsx'],
      modules: [srcDir, modDir],
    },

    devServer: {
      historyApiFallback: true,
      contentBase: outDir,
      disableHostCheck: true,
      publicPath,
      // Watching & hot reloading defaults on under webpack-dev-server anyway,
      // and is hard to turn off (https://github.com/webpack/webpack-dev-server/issues/1251).
      hot: true,
      watchOptions: {
      // Kludge: Effectively disable watching by polling once a day.
        poll: (process.env.WEBPACK_WATCH === 'false') ? 24*60*60*1000 : false,
      },
      inline: true,
      port: 8001,
    },
  };
};
