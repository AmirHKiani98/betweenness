const path = require('path');

module.exports = {
  entry: './main.js', // Entry point for the application
  output: {
    path: path.resolve(__dirname, 'dist'), // Output directory
    filename: 'bundle.js', // Output file name
  },
  module: {
    rules: [
      {
        test: /\.js$/, // Process JavaScript files
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader', // Transpile ES6+ to ES5
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.css$/, // Process CSS files
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpg|gif|svg|ico)$/, // Process image files
        type: 'asset/resource',
      },
    ],
  },
  resolve: {
    alias: {
      wgl: path.resolve(__dirname, 'assets/w-gl'), // Alias for w-gl library
    },
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'), // Serve files from the dist directory
    },
    compress: true,
    port: 9000, // Development server port
  },
  mode: 'development', // Set mode to development
};