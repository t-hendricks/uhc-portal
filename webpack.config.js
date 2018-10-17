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
const CopyWebpackPlugin = require('copy-webpack-plugin')

const modDir = path.resolve(__dirname, 'node_modules');
const srcDir = path.resolve(__dirname, 'src');
const outDir = path.resolve(__dirname, 'build');

module.exports = (env, argv) => {
  const devMode = argv.mode !== 'production';
  let copyConfig = null;
  if (devMode) {
    copyConfig = new CopyWebpackPlugin([
      { from: 'src/config', to: `${outDir}/config` },
    ]);
  }
  return ({
    mode: argv.mode || 'development',
    entry: {
      main: path.resolve(srcDir, 'main.jsx'),
    },

    output: {
      path: outDir,
      filename: 'bundle.js',
      publicPath: '/',
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
        template: 'src/index.html',
      }),
      copyConfig,
    ].filter(Boolean),

    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: [
            /node_modules/,
          ],
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-react',
                '@babel/preset-env',
              ],
              plugins: [
                '@babel/plugin-proposal-class-properties',
                '@babel/plugin-proposal-object-rest-spread',
                '@babel/plugin-transform-object-assign',
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
          use: [
            devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
            'css-loader',
          ],
        },
        {
          test: /(webfont\.svg|\.(eot|ttf|woff|woff2))$/,
          loader: 'file-loader',
          options: {
            name: 'fonts/[name].[ext]',
          },
        },
        {
          test: /\.(gif|jpg|png|svg)$/,
          loader: 'url-loader',
          options: {
            name: 'images/[name].[ext]',
          },
        },
      ],
    },

    resolve: {
      extensions: ['.js', '.jsx'],
      modules: [
        srcDir,
        modDir,
      ],
    },

    devServer: {
      historyApiFallback: true,
      contentBase: outDir,
      publicPath: '/',
      hot: true,
      inline: true,
      port: 8001,
      proxy: [
        {
          context: [
            '/api/clusters_mgmt',
          ],
          changeOrigin: true,
          secure: false,
          target: 'https://clusters-service.127.0.0.1.nip.io/',
        },
        {
          context: [
            '/api/accounts_mgmt',
          ],
          changeOrigin: true,
          secure: false,
          target: 'http://localhost:8080/',
        },
      ],
    },
  });
};
