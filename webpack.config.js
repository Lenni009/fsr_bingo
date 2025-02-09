const path = require('path');
const webpack = require('webpack');
const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  entry: './src/main.ts',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js'
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  watch: true, // Aktiviert den Watch-Modus
  watchOptions: {
    ignored: /node_modules/, // Ignoriere node_modules beim Überwachen
    aggregateTimeout: 300, // Warte 300ms nach der letzten Änderung
    poll: 1000, // Polling alle 1000ms (1 Sekunde), um Änderungen zu erkennen
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(process.env)  // Umgebungsvariablen hier einfügen
    })
  ],
  mode: 'production'
};
