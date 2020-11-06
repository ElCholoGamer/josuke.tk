const webpack = require('webpack');
const { merge } = require('webpack-merge');
const common = require('./webpack.common');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');

module.exports = merge(common, {
	mode: 'production',
	plugins: [
		new webpack.optimize.SplitChunksPlugin(),
		new webpack.optimize.AggressiveMergingPlugin(),
		new CompressionPlugin(),
	],
	optimization: {
		minimize: true,
		minimizer: [new CssMinimizerPlugin()],
		splitChunks: {
			chunks: 'all',
			maxInitialRequests: Infinity,
			minSize: 0,
			cacheGroups: {
				vendor: {
					test: /[\\/]node_modules[\\/]/,
					name(module) {
						const packageName = module.context.match(
							/[\\/]node_modules[\\/](.*?)([\\/]|$)/
						)[1];

						return `npm.${packageName.replace('@', '')}`;
					},
				},
			},
		},
	},
});
