const Path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const WebpackObfuscator = require('webpack-obfuscator');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const packageJson = require('../package.json');

module.exports = (options) => {
  const webpackConfig = {
    mode: options.isProduction ? 'production' : 'development',
    devtool: options.devtool,
    entry: [
      // `webpack-dev-server/client?https://www.runesx.com:${+options.port}`,
      'webpack-dev-server/client?https://localhost',
      'webpack/hot/dev-server',
      Path.join(__dirname, '../src/app/index'),
    ],
    output: {
      path: Path.join(__dirname, '../dist'),
      filename: `./scripts/[name].${options.jsFileName}`,
      chunkFilename: '[id].[chunkhash].js',
      publicPath: '/',
    },
    optimization: {
      chunkIds: 'total-size',
      moduleIds: 'size',
      minimizer: [
        new CssMinimizerPlugin(),
        new ImageMinimizerPlugin({
          minimizer: {
            implementation: ImageMinimizerPlugin.imageminMinify,
            options: {
              plugins: [
                [
                  'gifsicle',
                  {
                    interlaced: true,
                  },
                ],
                [
                  'jpegtran',
                  {
                    progressive: true,
                  },
                ],
                [
                  'optipng',
                  {
                    optimizationLevel: 5,
                  },
                ],
              ],
            },
          },
        }),
        new TerserPlugin({
          parallel: true,
          terserOptions: {
            ecma: 6,
            compress: {
              drop_console: true,
            },
            output: {
              comments: !!options.isProduction,
            },
          },
        }),
      ],
      runtimeChunk: 'single',
      splitChunks: {
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            enforce: true,
            chunks: 'all',
          },
        },
      },
    },
    resolve: {
      extensions: [
        '.js',
        '.jsx',
      ],
      alias: {
        buffer: require.resolve('buffer/'),
        url: require.resolve('url/'),
        crypto: require.resolve('crypto-browserify'),
        zlib: require.resolve('browserify-zlib'),
        https: require.resolve('https-browserify'),
        http: require.resolve('stream-http'),
        stream: require.resolve('stream-browserify'),
        fs: false,
        module: false,
        typescript: false,
      },
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: Path.join(__dirname, '../src/index.html'),
        NODE_ENV: options.isProduction ? 'production' : 'development',
        minify: {
          removeComments: false,
        },
      }),
      !options.isProduction && new ReactRefreshWebpackPlugin(),
      new Webpack.DefinePlugin({
        'process.env': {
          APP_VERSION: JSON.stringify(packageJson.version),
          ENV: options.isProduction ? JSON.stringify('production') : JSON.stringify('development'),
        },
      }),
      new Webpack.ProvidePlugin({
        Buffer: [
          'buffer',
          'Buffer',
        ],
      }),

      new MiniCssExtractPlugin({
        filename: '[name][fullhash].css',
      }),
    ].filter(Boolean),
    module: {
      rules: [
        {
          test: /\.[jt]sx?$/,
          exclude: /node_modules/,
          use: [
            {
              loader: require.resolve('babel-loader'),
              options: {
                envName: !options.isProduction ? 'development' : 'production',
                plugins: [
                  !options.isProduction && require.resolve('react-refresh/babel'),
                ].filter(Boolean),
              },
            },
          ],
        },
        {
          test: /\.(gif|png|jpe?g)$/i,
          type: 'asset/resource',
          ...(options.isProduction && {
            generator: {
              filename: 'static/images/[hash][ext][query]',
            },
          }),
        },
        {
          test: /\.svg$/,
          use: [
            {
              loader: '@svgr/webpack',
              options: {
                prettier: false,
                svgo: true,
                svgoConfig: {
                  plugins: [
                    {
                      name: 'removeViewBox',
                      active: false,
                    },
                  ],
                },
                titleProp: true,
              },
            },
          ],
          issuer: {
            and: [/\.(ts|tsx|js|jsx|md|mdx)$/],
          },
        },
        {
          test: /\.(eot|woff|woff2|ttf)(\?\S*)?$/,
          type: 'asset/resource',
          ...(options.isProduction && {
            generator: {
              filename: 'static/fonts/[hash][ext][query]',
            },
          }),
        },
        {
          test: /\.css$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
        },
        {
          test: /\.m?js$/,
          resolve: {
            fullySpecified: false,
          },
        },
        {
          test: /.jsx?$/,
          include: Path.join(__dirname, '../src/app'),
          use: {
            loader: 'babel-loader',
            options: {
              envName: !options.isProduction ? 'development' : 'production',
              presets: [
                '@babel/preset-react',
                '@babel/preset-env',
              ],
              plugins: [
                '@babel/plugin-transform-runtime',
              ],
            },
          },
        }],
    },
  };

  webpackConfig.module.rules.push({
    rules: [
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
    ],
  });

  if (options.isProduction) {
    webpackConfig.entry = [Path.join(__dirname, '../src/app/index')];

    webpackConfig.plugins.push(
      new CopyPlugin({
        patterns: [
          {
            from: Path.join(__dirname, '../static'),
            to: Path.join(__dirname, '../dist/static'),
          },
        ],
      }),
    );

    webpackConfig.plugins.push(
      new WebpackObfuscator({
        rotateStringArray: true,
      }, [
        'excluded_bundle_name.js',
      ]),
    );
  } else {
    webpackConfig.plugins.push(
      new Webpack.HotModuleReplacementPlugin(),
    );

    webpackConfig.devServer = {
      hot: !!options.isProduction,
      port: options.port,
      historyApiFallback: true,
      host: 'localhost',
      allowedHosts: [
        'localhost',
        'devwebsite.runebase.io',
      ],
      client: {
        overlay: false,
        logging: 'warn', // Want to set this to 'warn' or 'error'
      },
    };
  }

  return webpackConfig;
};
