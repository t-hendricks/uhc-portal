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

const fs = require('fs');
const path = require('path');
const webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const ReplaceWebpackPlugin = require('html-replace-webpack-plugin');
const { insights } = require('./package.json');

const modDir = path.resolve(__dirname, 'node_modules');
const srcDir = path.resolve(__dirname, 'src');
const outDir = path.resolve(__dirname, 'build', 'clusters');

module.exports = (env, argv) => {
  const devMode = argv.mode !== 'production';
  let copyConfig = null;
  let bundleAnalyzer = null;
  const embeddedApp = process.env.EMBEDDED === 'true';
  const appDeployment = devMode ? 'beta/apps' : 'apps';
  if (devMode) {
    copyConfig = new CopyWebpackPlugin([{ from: 'src/config', to: `${outDir}/config` }]);
    bundleAnalyzer = new BundleAnalyzerPlugin({ analyzerPort: '5000', openAnalyzer: false });
  }
  const publicPath = embeddedApp ? `/${appDeployment}/${insights.appname}/` : '/clusters/';
  return {
    mode: argv.mode || 'development',
    entry: {
      main: path.resolve(srcDir, 'main.jsx'),
      token: path.resolve(srcDir, 'token.jsx'),
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
        chunks: ['token'],
        template: 'src/token.html',
        filename: 'token.html',
      }),
      new HtmlWebpackPlugin({
        hash: true, // cache invalidation on bundle updates
        chunks: ['main'],
        template: 'src/index.html',
      }),
      new webpack.DefinePlugin({
        'process.env.UHC_DISABLE_KEYCLOAK': JSON.stringify(process.env.UHC_DISABLE_KEYCLOAK),
        'process.env.UHC_GATEWAY_DOMAIN': JSON.stringify(process.env.UHC_GATEWAY_DOMAIN),
        'process.env.UHC_SHOW_OLD_METRICS': JSON.stringify(process.env.UHC_SHOW_OLD_METRICS),
        APP_EMBEDDED: embeddedApp,
      }),
      new ReplaceWebpackPlugin([
        ...embeddedApp ? [{
          pattern: '<div id="root"></div>',
          replacement: `<esi:include src="/${appDeployment}/chrome/snippets/body.html" />`
        }, {
          pattern: '@@head-snippet@@',
          replacement: `<esi:include src="/${appDeployment}/chrome/snippets/head.html" />`
        }] : [{
          pattern: '@@head-snippet@@',
          replacement: '',
        }],
      ]),
      new CopyWebpackPlugin([
        { from: 'public', to: outDir, toType: 'dir' },
      ]),
      !embeddedApp && bundleAnalyzer,
      copyConfig,
    ].filter(Boolean),

    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: [/node_modules/],
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-react', '@babel/preset-env'],
              plugins: [
                '@babel/plugin-proposal-class-properties',
                '@babel/plugin-proposal-object-rest-spread',
                '@babel/plugin-transform-object-assign',
                '@babel/plugin-syntax-dynamic-import'
              ],
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
                includePaths: ['./node_modules/', './src'],
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
      ],
    },

    resolve: {
      extensions: ['.js', '.jsx'],
      modules: [srcDir, modDir],
    },

    devServer: {
      historyApiFallback: true,
      contentBase: outDir,
      publicPath,
      hot: true,
      inline: true,
      port: 8001,
    },
  };
};
