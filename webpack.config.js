const path = require('path')
const webpack = require('webpack')

module.exports = {
  target: 'node',
  mode: 'production',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'lib'),
    filename: 'svn-committer.js',
    library: 'svn-committer',
    libraryTarget: 'commonjs2'
  },
  plugins: [
    new webpack.BannerPlugin({ banner: "#!/usr/bin/env node", raw: true })
  ]
}