import webpack from 'webpack';
import { merge } from 'webpack-merge';
import common from './webpack.common';
import pkg from '../package.json';
import path from 'path';
import open from 'open';

// Open dev browser
const port = 3000;
open(`http://localhost:${port}/`);

// Dev proxy settings
const { proxy = '/' } = pkg;
const secure = proxy.startsWith('https');

const config: webpack.Configuration = merge(common, {
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
			'/': { target: proxy, secure },
		},
	},
	plugins: [new webpack.HotModuleReplacementPlugin()],
});

export default config;
