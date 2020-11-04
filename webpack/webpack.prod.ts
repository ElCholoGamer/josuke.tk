import webpack from 'webpack';
import { merge } from 'webpack-merge';
import common from './webpack.common';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import path from 'path';

const config: webpack.Configuration = merge(common, {
	mode: 'production',
	output: {
		path: path.join(__dirname, '..', 'src', 'server-prod', 'build'),
	},
	module: {
		rules: [
			{
				test: /\.s?[ac]css$/,
				use: [MiniCssExtractPlugin.loader],
			},
		],
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: '[name].css',
			chunkFilename: '[id].css',
		}),
	],
	optimization: {
		minimize: true,
		minimizer: [new CssMinimizerPlugin() as webpack.WebpackPluginInstance],
		splitChunks: {
			chunks: 'all',
		},
	},
});

export default config;
