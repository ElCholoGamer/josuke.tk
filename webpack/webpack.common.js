const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const SRC = path.resolve(__dirname, '..', 'src');
const FILE_REGEX = /assets[\\/].*\.(jpe?g|png|gif|mp4)$/i;

/** @type {require('webpack').Configuration} */
module.exports = {
	context: path.resolve(__dirname, '..'),
	entry: path.join(SRC, 'app', 'index.tsx'),
	output: {
		filename: '[name].[contenthash].js',
		publicPath: '/',
		chunkFilename: '[name].[contenthash].chunk.js',
		path: path.resolve(__dirname, '..', 'build'),
	},
	resolve: {
		extensions: ['.js', '.jsx', '.ts', '.tsx'],
		alias: {
			assets: path.join(SRC, 'app', 'assets'),
			components: path.join(SRC, 'app', 'components'),
		},
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/i,
				use: [
					{
						loader: 'babel-loader',
						options: {
							cacheDirectory: true,
							sourceType: 'unambiguous',
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
				use: ['style-loader', 'css-loader', 'sass-loader'],
			},
			{
				test: FILE_REGEX,
				loader: 'file-loader',
				options: {
					name: 'assets/[name].[ext]',
				},
			},
		],
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: './src/app/index.html',
		}),
		new ForkTsCheckerWebpackPlugin({ async: false }),
		new CleanWebpackPlugin(),
		!!process.env.ANALYZE && new BundleAnalyzerPlugin(),
	].filter(plugin => plugin !== false),
	performance: {
		assetFilter: asset => !FILE_REGEX.test(asset),
	},
};
