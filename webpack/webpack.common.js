const { resolve, join } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const context = resolve(__dirname, '../');

/** @type {import('webpack').Configuration} */
const config = {
	context,
	entry: join(context, 'src/app/index.tsx'),
	output: {
		filename: 'js/[name].[contenthash:8].js',
		publicPath: '/',
		chunkFilename: 'js/[name].[contenthash:8].chunk.js',
		path: join(context, 'build'),
	},
	resolve: {
		extensions: ['.js', '.jsx', '.ts', '.tsx'],
	},
	module: {
		rules: [
			{
				test: /\.[jt]sx?$/i,
				exclude: /node_modules/,
				use: [
					{
						loader: 'babel-loader',
						options: {
							cacheDirectory: true,
							presets: ['@babel/env', '@babel/react', '@babel/typescript'],
							plugins: [['@babel/transform-runtime', { regenerator: true }]],
						},
					},
					{
						loader: 'ts-loader',
						options: {
							transpileOnly: true,
						},
					},
				],
			},
			{
				test: /\.(s[ac]|c)ss$/i,
				use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
			},
			{
				test: /\.(jpe?g|png|gif|ico|svg|mp4)$/i,
				loader: 'file-loader',
				options: {
					name: 'assets/[name].[ext]',
				},
			},
		],
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: join(context, 'public/index.html'),
		}),
		new ForkTsCheckerWebpackPlugin({ async: false }),
		new CleanWebpackPlugin(),
		new CopyWebpackPlugin({ patterns: [{ from: 'public/' }] }),
		new MiniCssExtractPlugin({ filename: 'css/[name].[contenthash:8].css' }),
	],
};

module.exports = config;
