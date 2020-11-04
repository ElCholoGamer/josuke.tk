import webpack from 'webpack';
import { merge } from 'webpack-merge';
import common from './webpack.common';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';

const config: webpack.Configuration = merge(common, {
	mode: 'production',
	module: {
		rules: [
			{
				test: /\.s?[ac]css$/,
				use: [MiniCssExtractPlugin.loader],
			},
			{
				test: /\.tsx?$/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: [
							'@babel/preset-env',
							'@babel/preset-react',
							'@babel/preset-typescript',
						],
					},
				},
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
