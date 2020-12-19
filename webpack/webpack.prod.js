const webpack = require('webpack');
const { merge } = require('webpack-merge');
const WorkboxPlugin = require('workbox-webpack-plugin');
const common = require('./webpack.common');

const config = merge(common, {
	mode: 'production',
	plugins: [
		new webpack.optimize.SplitChunksPlugin(),
		new WorkboxPlugin.GenerateSW(),
	],
	optimization: {
		splitChunks: {
			chunks: 'all',
		},
	},
});

module.exports = config;
