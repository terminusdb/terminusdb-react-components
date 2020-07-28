const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    mode: 'production',
    entry: [
      path.join(__dirname, 'src/index.js'),
    ],
    devtool: false,    
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'terminusdb-react-components.min.js',
        sourceMapFilename: 'terminusdb-react-components.min.js.map',
        library: 'TerminusDBComponents',
        publicPath:'/'
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: 'terminusdb-react-components-main.css',
      })
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                use:{
                    loader: "babel-loader",
                },
                include: path.resolve(__dirname, "src"),
                exclude: /node_modules/,
            },
            {
              test: /\.(css|less)$/,
              use: [
                MiniCssExtractPlugin.loader,
                'css-loader', 'less-loader'
              
              ],

            }
        ]
    },
    externals: {
    
    react: {
      root: 'React',
      commonjs2: 'react',
      commonjs: 'react',
      amd: 'react',
    },
    'react-dom': {
      root: 'ReactDOM',
      commonjs2: 'react-dom',
      commonjs: 'react-dom',
      amd: 'react-dom'
    },
    'prop-types': {
      root: 'PropTypes',
      commonjs2: 'prop-types',
      commonjs: 'prop-types',
      amd: 'prop-types',
    }
  },
  //target: 'node'
};
