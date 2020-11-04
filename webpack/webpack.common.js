const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');

const SRC = path.join(__dirname, '..', 'src');

/** @type {webpack.Configuration} */
module.exports = {
	context: path.join(__dirname, '..'),
	entry: path.join(SRC, 'app', 'index.tsx'),
	output: {
		filename: '[name].[contenthash:8].js',
		publicPath: '/',
		chunkFilename: '[name].[contenthash:8].chunk.js',
		path: path.join(__dirname, '..', 'build'),
	},
	resolve: {
		extensions: ['.js', '.jsx', '.ts', '.tsx'],
		alias: {
			assets: path.join(SRC, 'app', 'assets'),
		},
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				loader: 'ts-loader',
				options: {
					transpileOnly: true,
				},
			},
			{
				test: /\.s?[ac]ss$/,
				use: ['style-loader', 'css-loader', 'sass-loader'],
			},
			{
				test: /assets[\\/].*\.(jpe?g|png|gif|mp4)$/,
				loader: 'file-loader',
				options: {
					name: 'assets/[name].[ext]',
				},
			},
		],
	},
	plugins: [
		new HtmlWebpackPlugin({ template: './src/app/index.html' }),
		new ForkTsCheckerWebpackPlugin({ async: false }),
		new CleanWebpackPlugin(),
		new FriendlyErrorsPlugin(),
		!!process.env.ANALYZE && new BundleAnalyzerPlugin(),
	].filter(plugin => plugin !== false),
};
