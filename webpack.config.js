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

const fs = require('fs')
const path = require('path')
const webpack = require('webpack')

const CopyWebpackPlugin = require('copy-webpack-plugin')

const modDir = path.resolve(__dirname, 'node_modules')
const srcDir = path.resolve(__dirname, 'src')
const rscDir = path.resolve(__dirname, 'src')
const outDir = path.resolve(__dirname, 'build')

module.exports = {
  mode: "development",
  entry: {
    main: path.resolve(srcDir, 'main.js'),
  },

  output: {
    path: outDir,
    filename: 'bundle.js',
    publicPath: '/'
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: [
          /node_modules/
        ],
        use: {
          loader: 'babel-loader',
          options: {
            'presets': [
              path.join(__dirname, 'node_modules/babel-preset-react'),
              path.join(__dirname, 'node_modules/babel-preset-env')
            ],
            'plugins': [
              path.join(__dirname, 'node_modules/babel-plugin-transform-class-properties'),
              path.join(__dirname, 'node_modules/babel-plugin-transform-object-rest-spread'),
              path.join(__dirname, 'node_modules/babel-plugin-transform-object-assign'),
            ]
          }
        }
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /(webfont\.svg|\.(eot|ttf|woff|woff2))$/,
        loader: 'file-loader',
        options: {
          name: 'fonts/[name].[ext]'
        }
      },
      {
        test: /\.(gif|jpg|png|svg)$/,
        loader: 'url-loader',
        options: {
          name: 'images/[name].[ext]'
        }
      }
    ]
  },

  plugins: [
    // Copy the static files to the output directory:
    new CopyWebpackPlugin([
      { from: rscDir, to: outDir }
    ])
  ],

  resolve: {
    extensions: ['.js', '.jsx'],
    modules: [
      srcDir,
      modDir
    ]
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
        target: 'http://clusters-service.127.0.0.1.nip.io/',
      },
      {
        context: [
          '/api/customers_mgmt',
        ],
        changeOrigin: true,
        secure: false,
        target: 'https://customers-service.127.0.0.1.nip.io/',
      }
    ]  }
}
