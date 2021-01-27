const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = env => {
	return {
		mode: env.NODE_ENV || 'production',
		entry: {
			background: './src/background.js',
			popup: ['./src/popup.js', '/src/popup.less'],
			sd_covid: './src/sd_covid.js',
			calvax: './src/calvax.js'
		},
		module: {
			rules: [
				{
					test: /\.js$/,
					exclude: /node_modules/,
					use: ['babel-loader']
				},
				{
					test: /\.less$/,
					use: [
						MiniCssExtractPlugin.loader,
						'css-loader',
						'less-loader'
					]
				}
			]
		},
		plugins: [
			new HtmlWebpackPlugin({
				chunks: ['popup'],
				filename: 'popup.html',
				template: './src/popup.html'
			}),
			new MiniCssExtractPlugin()
		],
		devtool: 'source-map'
	};
};
