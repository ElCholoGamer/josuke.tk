const webpack = require('webpack');
const { merge } = require('webpack-merge');
const common = require('./webpack.common');
const pkg = require('../package.json');
const path = require('path');
const open = require('open');

// Open dev browser
const port = 3000;
open(`http://localhost:${port}/`);

// Dev proxy settings
const { proxy = '/' } = pkg;
const secure = proxy.startsWith('https');

module.exports = merge(common, {
	mode: 'development',
	devtool: 'eval-source-map',
	devServer: {
		contentBase: path.resolve(__dirname, '..', 'build'),
		port,
		hot: true,
		historyApiFallback: true,
		overlay: true,
		stats: 'minimal',
		quiet: true,
		proxy: {
			'/': {
				target: proxy,
				secure,
			},
		},
	},
	plugins: [new webpack.HotModuleReplacementPlugin()],
});
