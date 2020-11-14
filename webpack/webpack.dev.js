const webpack = require('webpack');
const { merge } = require('webpack-merge');
const common = require('./webpack.common');
const ESLintPlugin = require('eslint-webpack-plugin');
const pkg = require('../package.json');
const path = require('path');

// Dev proxy settings
const { proxy = '/' } = pkg;
const secure = proxy.startsWith('https');

module.exports = merge(common, {
	mode: 'development',
	devtool: 'eval-source-map',
	devServer: {
		contentBase: path.resolve(__dirname, '..', 'build'),
		port: 3000,
		compress: true,
		hot: true,
		historyApiFallback: true,
		overlay: true,
		stats: 'minimal',
		quiet: true,
		proxy: {
			'/': {
				target: proxy,
				secure,
				bypass: ({ headers, path }) => {
					if (headers.accept.includes('html') && !path.startsWith('/oauth'))
						return '/index.html';
				},
			},
		},
	},
	plugins: [new webpack.HotModuleReplacementPlugin(), new ESLintPlugin()],
});
