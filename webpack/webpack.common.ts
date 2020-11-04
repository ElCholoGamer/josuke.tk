import webpack from 'webpack';
import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import FriendlyErrorsPlugin from 'friendly-errors-webpack-plugin';

const SRC = path.join(__dirname, '..', 'src');

const config: webpack.Configuration = {
	context: path.join(__dirname, '..'),
	entry: {
		app: path.join(SRC, 'APP', 'index.tsx'),
	},
	output: {
		filename: '[name].[contenthash].js',
		publicPath: '/',
		chunkFilename: '[name].[contenthash].chunk.js',
	},
	resolve: {
		extensions: ['.js', '.jsx', '.ts', '.tsx'],
		alias: {
			Assets: path.join(SRC, 'app', 'assets'),
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
				test: /\.(jpe?g|png|svg|ico|webp|gif|mp4)$/,
				use: ['file-loader'],
			},
		],
	},
	plugins: [
		new HtmlWebpackPlugin({ template: './src/app/index.html' }),
		new ForkTsCheckerWebpackPlugin({ async: false }),
		new CleanWebpackPlugin(),
		new FriendlyErrorsPlugin(),
		!!process.env.ANALYZE ? new BundleAnalyzerPlugin() : false,
	].filter(plugin => plugin !== false) as any[],
};

export default config;
