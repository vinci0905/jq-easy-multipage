const path = require('path');
const glob = require('glob');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const webpack = require('webpack');
var ROOT = path.resolve(__dirname);
var ENV = process.env.ENV;
var CDN = process.env.CDN;

/*入口*/
var entries = getEntry('src/**/*.js', 'src/');
entries['vendor'] = ['jquery', './src/common/shim.js', './src/common/alice.js'];

/*插件*/
var plugins = [];
for (chunk in entries) {
  if(chunk == 'vendor') continue;
  plugins.push(new HtmlWebpackPlugin({
    filename: chunk + '.html',
    template: 'html-withimg-loader?min=false!src/' + chunk + '.html',
    chunks: ['vendor', chunk]
  }));
}

/*less loader*/
const extractLess = new ExtractTextPlugin({
    filename: "[name]/index_[contenthash].css",
    disable: ENV === "DEV"
});

if(ENV != 'DEV') {
  plugins.push(new webpack.optimize.UglifyJsPlugin({minimize: true}));
  plugins.push(
      new OptimizeCssAssetsPlugin({
        assetNameRegExp: /\.css$/g,
        cssProcessor: require('cssnano'),
        cssProcessorOptions: { discardComments: { removeAll: true } },
        canPrint: true
      })
  );
  plugins.push(new CleanWebpackPlugin(['dist']));
  plugins.push(new webpack.HashedModuleIdsPlugin());
}

/*资源*/
var rules = [];
if(ENV == 'DEV') {
  rules.push({
      test: /\.less$/,
      use: [{
          loader: "style-loader"
      }, {
          loader: "css-loader"
      }, {
          loader: "less-loader"
      }]
  });
} else {
  rules.push({
    test: /\.less$/,
    use: extractLess.extract({
        use: [{
            loader: "css-loader", 
            options: {
                sourceMap: true
            }
        }, {
            loader: "less-loader", 
            options: {
                sourceMap: true
            }
        }],
        // use style-loader in development
        fallback: "style-loader"
    })
  });
}


module.exports = {
  entry: entries,
  devtool: ENV == 'DEV' ? 'cheap-eval-source-map' : 'source-map',
  output: {
    filename: '[name]/index_[hash].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/'
  },
  module: {
  	rules: rules.concat([
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: "css-loader"
        })
      },
  		{
  			test: /\.(png|svg|jpg|gif)$/,
  			use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              name: 'img/[name].[ext]'
            }
          }
        ]
  		},
  		{
         	test: /\.(woff|woff2|eot|ttf|otf)$/,
        	use: [
          	'file-loader'
        	]
     	},
      {
        test: /\.js$/,
        use: [
          'babel-loader'
        ],
        exclude: /node_modules/
      },
      {
        test: /\.tpl$/,
        use: [
          'handlebars-loader'
        ]
      }
  	])
  },
  plugins: plugins.concat([
    new webpack.HotModuleReplacementPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor'
    }),
    new webpack.ProvidePlugin({
      $: 'jquery'
    }),
    new webpack.DefinePlugin({
      'ENV': JSON.stringify(process.env.ENV)
    }),
    extractLess
  ]),
  devServer: {
    contentBase: './dist',
    hot: true
  },
  resolve: {
      alias: {
          jquery: "jquery/src/jquery"
      }
  }
};

function getEntry(globPath, pathDir) {
  var files = glob.sync(globPath);
  var entries = {},
      entry, dirname, pathname;
  for (var i = 0; i < files.length; i++) {
      entry = files[i];
      dirname = path.dirname(entry);
      if(dirname.indexOf('src/common') >= 0) continue;
      pathname = dirname.replace(new RegExp('^' + pathDir), '');
      entries[pathname] = ('./' + entry);
  }
  return entries;
}